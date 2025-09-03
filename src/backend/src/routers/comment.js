
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.get("/", commentController.getAllComments);
router.post("/", commentController.createComment);
router.get("/:masanpham", commentController.getCommentsByProduct);
router.put("/:madanhgia", commentController.updateComment);
router.delete("/:madanhgia", commentController.deleteComment);

module.exports = router;