// CommentModal.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CommentModal = ({ show, handleClose, handleSubmit }) => {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");

    const onSubmit = () => {
        if (!title || !rating || !content) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        handleSubmit({ title, rating, content });
        setTitle("");
        setRating(0);
        setContent("");
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>

            <Modal.Header closeButton>
                <Modal.Title>Đánh giá sản phẩm:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="commentRating" className="mb-3">
                        <Form.Label>Đánh giá (1 - 5)</Form.Label>
                        <Form.Select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value={0}>Chọn số sao</option>
                            <option value={1}>1 sao</option>
                            <option value={2}>2 sao</option>
                            <option value={3}>3 sao</option>
                            <option value={4}>4 sao</option>
                            <option value={5}>5 sao</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="commentContent" className="mb-3">
                        <Form.Label>Nội dung bình luận</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Nhập nội dung..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    Gửi bình luận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CommentModal;
