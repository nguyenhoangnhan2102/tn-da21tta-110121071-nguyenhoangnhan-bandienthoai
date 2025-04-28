const express = require("express");
const router = express.Router();

const permissionController = require("../controllers/permissionController");

router.get("/", permissionController.getPermissions);
router.post("/", permissionController.createPermission);
router.put("/:maquyen", permissionController.updatePermission);
router.delete("/:maquyen", permissionController.deletePermission);


module.exports = router;