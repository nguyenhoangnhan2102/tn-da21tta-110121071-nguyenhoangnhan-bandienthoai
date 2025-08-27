
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
// POST: user thêm bình luận
router.post("/", commentController.createComment);

// GET: lấy tất cả bình luận của 1 sản phẩm
router.get("/:masanpham", commentController.getCommentsByProduct);

// PUT: cập nhật bình luận
router.put("/:madanhgia", commentController.updateComment);

// DELETE: ẩn bình luận
router.delete("/:madanhgia", commentController.deleteComment);

module.exports = router;