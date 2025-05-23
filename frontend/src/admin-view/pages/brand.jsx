import React, { useState, useEffect } from "react";
import DynamicTable from "../../share/dynamicTable-component";
import { Button } from "@mui/material";
import BrandModal from "../modal/brand-modal";
import brandService from "../../services/brandService";
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';

const BrandComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState({});

    // ✅ Tạm tắt logic sắp xếp frontend
    // const [sortColumn, setSortColumn] = useState("ngaycapnhat");
    // const [sortOrder, setSortOrder] = useState("asc");

    const [bands, setBands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editting, setEditing] = useState(null);

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    const fetchData = async () => {
        try {
            const response = await brandService.getAllBrand();
            console.log("response", response);
            const mappedResponse = response.map((item) => ({
                ...item,
                id: item.mathuonghieu,
                trangthaithuonghieuText: item.trangthaithuonghieu === 0 ? "Hoạt động" : "Ngưng hoạt động",
            }));
            setBands(mappedResponse);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = bands.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = item.tenthuonghieu &&
            item.tenthuonghieu.toLowerCase().includes(searchLower);

        const matchFilter = Object.entries(filterValue).every(([key, value]) =>
            value ? item[key] === value : true
        );
        return matchSearch && matchFilter;
    });

    // ✅ Tắt sorting thủ công ở frontend
    // const sortedData = filteredData.sort((a, b) => {
    //     if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
    //     if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
    //     return 0;
    // });

    // ✅ Dữ liệu giữ nguyên theo thứ tự đã sắp xếp từ backend
    const sortedData = filteredData;

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
    }

    const columns = [
        { key: "mathuonghieu", label: "ID" },
        { key: "tenthuonghieu", label: "Tên thương hiệu" },
        { key: "trangthaithuonghieuText", label: "Trạng thái" },
    ];

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 Danh sách sản phẩm</h2>

            <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />
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
