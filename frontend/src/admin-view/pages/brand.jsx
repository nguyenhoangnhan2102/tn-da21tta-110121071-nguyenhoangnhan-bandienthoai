import React, { useState, useEffect } from "react";
import DynamicTable from "../../share/dynamicTable-component";
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    DialogActions
} from "@mui/material";
import BrandModal from "../modal/brand-modal";
import brandService from "../../services/brandService";
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';

const BrandComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState("tenthuonghieu");
    const [sortOrder, setSortOrder] = useState("asc");
    const [bands, setBands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editting, setEditing] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await brandService.getAllBrand();
            const mappedResponse = response.map((item) => {
                const formatDateTime = (isoString) =>
                    new Date(isoString).toLocaleString("vi-VN", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    });
                return {
                    ...item,
                    id: item.mathuonghieu,
                    trangthaithuonghieuText: item.trangthaithuonghieu === 0 ? "Hoạt động" : "Ngưng hoạt động",
                    ngaytao: formatDateTime(item.ngaytao),
                    ngaycapnhat: formatDateTime(item.ngaycapnhat),
                };
            });

            setBands(mappedResponse);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const openDeleteModal = (brand) => {
        setBrandToDelete(brand);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setBrandToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!brandToDelete) return;
        try {
            const response = await brandService.deleteBrand(brandToDelete.mathuonghieu);
            if (response) {
                toast.success("Xóa thương hiệu thành công");
                fetchData();
            } else {
                toast.error("Xóa thương hiệu thất bại");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa");
        }
        closeDeleteModal();
    };


    const filteredData = bands.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = item.tenthuonghieu?.toLowerCase().includes(searchLower);
        return matchSearch;
    });

    const sortedData = filteredData.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (!isNaN(aVal) && !isNaN(bVal)) {
            return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = aVal?.toString().toLowerCase() || "";
        const bStr = bVal?.toString().toLowerCase() || "";

        if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
        if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const columns = [
        { key: "mathuonghieu", label: "ID" },
        { key: "tenthuonghieu", label: "Tên thương hiệu" },
        { key: "trangthaithuonghieuText", label: "Trạng thái" },
        { key: "ngaytao", label: "Ngày tạo" },
        { key: "ngaycapnhat", label: "Ngày cập nhật" },
    ];

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 Danh sách thương hiệu</h2>

            <TextField
                fullWidth
                label="Tìm kiếm..."
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: "1rem", width: "24%" }}
                size="small"
            />
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <FormControl size="small" style={{ minWidth: 180 }}>
                    <InputLabel>Sắp xếp theo</InputLabel>
                    <Select
                        value={sortColumn}
                        onChange={(e) => setSortColumn(e.target.value)}
                        label="Sắp xếp theo"
                    >
                        {columns.map((col) => (
                            <MenuItem key={col.key} value={col.key}>
                                {col.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" style={{ minWidth: 120 }}>
                    <InputLabel>Thứ tự</InputLabel>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Thứ tự"
                    >
                        <MenuItem value="asc">Tăng dần (A→Z)</MenuItem>
                        <MenuItem value="desc">Giảm dần (Z→A)</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setEditing(null);
                        setShowModal(true);
                    }}
                >
                    <AddIcon />Thêm thương hiệu
                </Button>
            </div>

            <DynamicTable
                columns={columns}
                data={sortedData}
                onEdit={(id) => {
                    const selected = sortedData.find((u) => u.id === id);
                    setEditing(selected);
                    setShowModal(true);
                }}
                onDelete={(id) => {
                    const selected = bands.find((b) => b.id === id);
                    openDeleteModal(selected);
                }}
            />

            <BrandModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => {
                    fetchData();
                    setShowModal(false);
                }}
                brand={editting}
                isView={false}
            />

            <Dialog open={deleteModalOpen} onClose={closeDeleteModal}>
                <DialogTitle>Xác nhận xóa thương hiệu</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc muốn xóa thương hiệu{" "}
                        <strong>{brandToDelete?.tenthuonghieu}</strong> không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Xóa
                    </Button>
                    <Button onClick={closeDeleteModal} variant="outlined" color="primary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default BrandComponent;
