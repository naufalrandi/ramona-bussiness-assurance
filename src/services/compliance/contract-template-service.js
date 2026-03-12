const model = require("../../models/index");
const modelMasterdata = require("../../models/masterdata/index");
const {
  searchData,
  pagination,
  updateWithHistory,
  createContractHistoryEntry,
  getUser,
} = require("../../helpers/func");
const { Op } = require("sequelize");
const validate = require("../../validations/validation");
const {
  createValidation,
  updateValidation,
  deleteManyValidation,
  commentValidation,
  approvalValidation,
} = require("../../validations/compliance/contract-template-validation");

const getData = async (id) => {
  let contractTemplate = await model.ContractTemplate.findOne({
    where: { id },
    include: [
      {
        model: model.ContractTemplateComment,
        as: "comments",
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  if (!contractTemplate) {
    throw new Error("Contract template not found");
  }

  contractTemplate = contractTemplate.toJSON();
  contractTemplate.contractType = await getContractType(
    contractTemplate.contractTypeId,
  );

  // get approver
  contractTemplate.approver = await getUser(contractTemplate.approverId);

  // get comments
  contractTemplate.comments = await Promise.all(
    contractTemplate.comments.map(async (comment) => {
      comment.user = await getUser(comment.userId);
      return comment;
    }),
  );

  return contractTemplate;
};

const getContractType = async (id) => {
  return await modelMasterdata.ContractType.findOne({
    where: { id },
  });
};

const getAvailableLetter = (usedLetters, preferredLetter) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (!usedLetters.includes(preferredLetter)) {
    return preferredLetter;
  }

  return alphabet.find((letter) => !usedLetters.includes(letter));
};

const generateCode = async (data, categoryCode) => {
  const baseSub = data.subcategory.trim().charAt(0).toUpperCase();
  const baseVar = data.variant.trim().charAt(0).toUpperCase();

  const existing = await model.ContractTemplate.findAll({
    where: { contractTypeId: data.contractTypeId },
    attributes: ["code", "subcategory"],
  });

  // ================================
  // 1️⃣ HANDLE SUBCATEGORY
  // ================================

  // Cari apakah subcategory sudah ada
  const existingSub = existing.find(
    (item) => item.subcategory === data.subcategory,
  );

  let subcategoryCode;

  if (existingSub) {
    // Ambil kode subcategory dari code sebelumnya
    subcategoryCode = existingSub.code.split("/")[1];
  } else {
    // Ambil semua huruf subcategory yang sudah dipakai
    const usedSubLetters = existing.map((item) => item.code.split("/")[1]);

    subcategoryCode = getAvailableLetter(usedSubLetters, baseSub);
  }

  // ================================
  // 2️⃣ HANDLE VARIANT (per subcategory)
  // ================================

  const existingSameSub = existing.filter(
    (item) => item.code.split("/")[1] === subcategoryCode,
  );

  const usedVariantLetters = existingSameSub.map(
    (item) => item.code.split("/")[2],
  );

  const variantCode = getAvailableLetter(usedVariantLetters, baseVar);

  return `${categoryCode}/${subcategoryCode}/${variantCode}`;
};

const getAll = async (data) => {
  const { page, limit, offset, orderby, sortBy, search } = data;
  const fieldSearch = searchData(["code", "status", "reason"], search);

  const result = await model.ContractTemplate.findAndCountAll({
    where: {
      ...fieldSearch,
    },
    limit,
    offset,
    order: [[sortBy, orderby]],
    attributes: { exclude: ["histories"] },
  });

  result.rows = await Promise.all(
    result.rows.map(async (template) => {
      const contractType = await getContractType(template.contractTypeId);

      return {
        ...template.toJSON(),
        contractType,
      };
    }),
  );

  return pagination(result, page, limit);
};

const create = async (data) => {
  data = validate(createValidation, data);
  const user = await getUser(data.createdById);
  const contractType = await getContractType(data.contractTypeId);

  const errors = {};
  if (!contractType) {
    errors.contractTypeId = "contract type not found";
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error("Validation error");
    error.errors = errors;
    throw error;
  }

  data.code = await generateCode(data, contractType.categoryCode);
  data.histories = [
    createContractHistoryEntry(
      "created",
      data.createdById,
      user ? user.userDetail?.fullname : "Superadmin",
      "Contract template created",
    ),
  ];

  return await model.ContractTemplate.create(data);
};

const getOne = async (id) => {
  return await getData(id);
};

const update = async (id, data) => {
  data.id = id;
  data = validate(updateValidation, data);

  // Use helper function to update with history tracking
  const historyEntry = createContractHistoryEntry(
    "updated",
    data.createdById || 1,
    "Superadmin",
    "Contract template updated",
  );

  return await updateWithHistory("ContractTemplate", id, data, historyEntry);
};

const destroy = async (id) => {
  await getData(id);
  return await model.ContractTemplate.destroy({
    where: { id },
  });
};

const destroyMany = async (data) => {
  data = validate(deleteManyValidation, data);
  return await model.ContractTemplate.destroy({
    where: {
      id: {
        [Op.in]: data.ids,
      },
    },
  });
};

const getComment = async (id) => {
  const result = await model.ContractTemplateComment.findAll({
    where: {
      contractTemplateId: id,
    },
    order: [["createdAt", "DESC"]],
  });

  return await Promise.all(
    result.map(async (comment) => {
      comment = comment.toJSON();
      comment.user = await getUser(comment.userId);
      return comment;
    }),
  );
};

const createComment = async (id, data) => {
  data.contractTemplateId = id;
  data = validate(commentValidation, data);

  await getData(id);
  return await model.ContractTemplateComment.create(data);
};

const approval = async (id, data) => {
  data.contractTemplateId = id;
  data = validate(approvalValidation, data);

  const contractTemplate = await getData(id);

  if (data.userId !== contractTemplate.approverId) {
    throw new Error("You are not allowed to approve this contract template");
  }

  const historyEntry = createContractHistoryEntry(
    "approved",
    data.createdById || 1,
    "Superadmin",
    "Contract template approved",
  );

  return await updateWithHistory("ContractTemplate", id, data, historyEntry);
};

module.exports = {
  getAll,
  create,
  getOne,
  update,
  destroy,
  destroyMany,
  getComment,
  createComment,
  approval,
};
