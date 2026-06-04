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
  assignCompensationValidation,
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

const getCategoryCode = (value) => {
  switch (value) {
    case "Employment":
      return "E";
    case "Service":
      return "S";
    default:
      return "";
  }
};

const getSubcategoryCode = (value) => {
  switch (value) {
    case "PKWT":
      return "FD";
    case "PKWTT":
      return "P";
    case "Certification":
      return "C";
    case "Training":
      return "T";
    default:
      return "";
  }
};

const getVariantCode = (value) => {
  switch (value) {
    case "Regular":
      return "R";
    case "Auditor":
      return "A";
    case "Trainer":
      return "T";
    case "In-House Training":
      return "IHT";
    case "Public Training":
      return "PT";
    case "Personnel Certification":
      return "PC";
    default:
      return "";
  }
};

const generateCode = async (data) => {
  const categoryCode = getCategoryCode(data.category);
  const subcategoryCode = getSubcategoryCode(data.subcategory);
  const variantCode = getVariantCode(data.variant);

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

  return await pagination(result, page, limit, model.ContractTemplate);
};

const create = async (data) => {
  data = validate(createValidation, data);
  const user = await getUser(data.createdById);

  data.code = await generateCode(data);
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

const assignCompensation = async (id, data) => {
  data.id = id;
  data = validate(assignCompensationValidation, data);

  await getData(id);
  return await model.ContractTemplate.update(data, { where: { id } });
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

  if (contractTemplate.status !== "Draft") {
    if (data.userId !== contractTemplate.approverId) {
      throw new Error("You are not allowed to approve this contract template");
    }
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
  assignCompensation,
  approval,
};
