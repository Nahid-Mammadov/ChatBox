const express = require("express");
const router = express.Router();
const Controller = require("../controllers/AdminController");
router.get("/admin", Controller.getall);
router.get("/admin/:id", Controller.getById);
router.delete("/admin/:id", Controller.deleteByiD);
router.post("/admin", Controller.postOne);
router.patch("/admin/:id", Controller.patchOne);
router.post("/admin/register", Controller.register);
router.post("/admin/login", Controller.login);
router.post("/admin/forgot-password", Controller.forgotPassword);
router.post("/admin/verify-code", Controller.verifyCode);
router.post("/admin/reset-password/:id", Controller.resetPassword);


module.exports = router;
