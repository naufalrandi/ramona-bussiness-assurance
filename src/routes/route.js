const authMiddleware = require("../middleware/auth-middleware");
const contractTemplateController = require("../controllers/compliance/contract-template-controller");
const express = require("express");
const mainRoutes = express.Router();

// Contract Templates - Compliance Module
mainRoutes.get("/contract-templates", authMiddleware, contractTemplateController.getAll);
mainRoutes.post("/contract-templates", authMiddleware, contractTemplateController.create);
mainRoutes.get("/contract-templates/:id", authMiddleware, contractTemplateController.getOne);
mainRoutes.put("/contract-templates/:id", authMiddleware, contractTemplateController.update);
mainRoutes.delete("/contract-templates/:id", authMiddleware, contractTemplateController.destroy);
mainRoutes.delete("/contract-templates", authMiddleware, contractTemplateController.destroyMany);
mainRoutes.get("/contract-templates/:id/comments", authMiddleware, contractTemplateController.getComment);
mainRoutes.post("/contract-templates/:id/comments", authMiddleware, contractTemplateController.createComment);
mainRoutes.post("/contract-templates/:id/approval", authMiddleware, contractTemplateController.approval);

module.exports = mainRoutes;
