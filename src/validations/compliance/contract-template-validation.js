const Joi = require("joi");
const { asArray, CONTRACT_TEMPLATE_STATUSES } = require("../../enum/utils");

const createValidation = Joi.object({
  contractTypeId: Joi.number().required(),
  approverId: Joi.string().uuid().required(),
  createdById: Joi.string().uuid().required(),
  subcategory: Joi.string().required(),
  variant: Joi.string().required(),
  status: Joi.string().optional().allow(null, ""),
  reviewerIds: Joi.array()
    .items(Joi.string().uuid().required())
    .optional()
    .allow(null),
  clauses: Joi.required(),
});

const updateValidation = Joi.object({
  id: Joi.string().uuid().required(),
  contractTypeId: Joi.number().required(),
  approverId: Joi.string().uuid().required(),
  createdById: Joi.string().uuid().required(),
  subcategory: Joi.string().required(),
  variant: Joi.string().required(),
  status: Joi.string().optional().allow(null, ""),
  reviewerIds: Joi.array()
    .items(Joi.string().uuid().required())
    .optional()
    .allow(null),
  clauses: Joi.required(),
});

const deleteManyValidation = Joi.object({
  ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

const commentValidation = Joi.object({
  userId: Joi.string().uuid().required(),
  contractTemplateId: Joi.string().uuid().required(),
  mentions: Joi.array().items(Joi.string().uuid().required()),
  comment: Joi.string().required(),
});

const approvalValidation = Joi.object({
  userId: Joi.string().uuid().required(),
  contractTemplateId: Joi.string().uuid().required(),
  status: Joi.string()
    .valid(...asArray(CONTRACT_TEMPLATE_STATUSES))
    .required(),
  reason: Joi.string().optional().allow("", null),
});

module.exports = {
  createValidation,
  updateValidation,
  deleteManyValidation,
  commentValidation,
  approvalValidation,
};
