import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Rating,
    Box,
    Input
} from "@mui/material";
import Button from "@mui/material/Button"; // ✅ Import đúng Button MUI

const CommentModal = ({ open, handleClose }) => {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");

    const handleSubmit = () => {
        if (!rating || !content) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        console.log({ title, rating, content });
        handleClose();
        setTitle("");
        setRating(0);
        setContent("");
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Đánh giá sản phẩm</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                        name="product-rating"
                        value={rating}
                        onChange={(e, newValue) => setRating(newValue)}
                    />
                </Box>
                <input
                    label="Nội dung"
                    fullWidth
                    margin="dense"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" variant="outlined">
                    Đóng
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Gửi đánh giá
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommentModal;
