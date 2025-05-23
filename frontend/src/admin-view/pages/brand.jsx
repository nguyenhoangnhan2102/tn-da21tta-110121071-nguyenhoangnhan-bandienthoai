import React, { useState, useEffect } from "react";
import DynamicTable from "../../share/dynamicTable-component";
import { Button, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import BrandModal from "../modal/brand-modal";
import brandService from "../../services/brandService";
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import DynamicSearchSort from "../../share/dynamicSearchSort";

const BrandComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState({});
    const [sortColumn, setSortColumn] = useState("tenthuonghieu");
    const [sortOrder, setSortOrder] = useState("asc");

    const [bands, setBands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editting, setEditing] = useState(null);
    const [filterList, setFilterList] = useState([]);

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

            setFilterList([
                {
                    key: "trangthaithuonghieu",
                    label: "Trạng thái",
                    value: "",
                    listSelect: [
                        { id: 0, name: "Hoạt động" },
                        { id: 1, name: "Ngưng hoạt động" }
                    ]
                }
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const handleFilterChange = (updatedList) => {
        const mapped = {};
        updatedList.forEach((f) => {
            mapped[f.key] = f.value;
        });
        setFilterValue(mapped);
    };

    const filteredData = bands.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = Object.values(item).some((val) =>
            val?.toString().toLowerCase().includes(searchLower)
        );

        const matchFilter = Object.entries(filterValue).every(([key, value]) =>
            value !== "" ? item[key]?.toString() === value.toString() : true
        );

        return matchSearch && matchFilter;
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

    const handleDelete = async (mathuonghieu) => {
        try {
            const response = await brandService.deleteBrand(mathuonghieu);
            if (response) {
                toast.success("Xóa thương hiệu thành công");
                fetchData();
            } else {
                toast.error("Xóa thương hiệu thất bại");
            }
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    };

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
                    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
                        handleDelete(id);
                    }
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
        </div>
    );
};

export default BrandComponent;
