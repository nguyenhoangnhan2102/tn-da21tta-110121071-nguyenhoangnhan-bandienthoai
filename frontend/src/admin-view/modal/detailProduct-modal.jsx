import React from "react";
import { Modal, Box, TextField, Typography, Button, Grid } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
};

const ProductDetailModal = ({ open, onClose, product, imageBaseUrl }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    Thông tin chi tiết sản phẩm
                </Typography>

                {product ? (
                    <Box component="form" noValidate autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Tên sản phẩm"
                                    value={product.tensanpham || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Hệ điều hành"
                                    value={product.hedieuhanh || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="RAM"
                                    value={product.ram || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="CPU"
                                    value={product.cpu || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="GPU"
                                    value={product.gpu || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Camera trước"
                                    value={product.cameratruoc || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Camera sau"
                                    value={product.camerasau || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Công nghệ màn hình"
                                    value={product.congnghemanhinh || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Độ phân giải màn hình"
                                    value={product.dophangiaimanhinh || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Pin"
                                    value={product.pin || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Mô tả"
                                    value={product.mota || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {product.hinhanh && (
                                <Grid item xs={12}>
                                    <Box textAlign="center">
                                        <img
                                            src={`${imageBaseUrl}/${product.hinhanh}`}
                                            alt="Sản phẩm"
                                            style={{
                                                width: "100%",
                                                maxHeight: "300px",
                                                objectFit: "contain",
                                                borderRadius: 8,
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            )}
                        </Grid>

                        <Box mt={3} textAlign="right">
                            <Button variant="contained" onClick={onClose}>
                                Đóng
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography>Không có dữ liệu sản phẩm.</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default ProductDetailModal;
