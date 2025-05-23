import React, { useState, useEffect } from "react";
import DynamicTable from "../../share/dynamicTable-component";
import { Button } from "@mui/material";
import BrandModal from "../modal/brand-modal";
import brandService from "../../services/brandService";
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import DynamicSearchSort from "../../share/dynamicSearchSort";

const BrandComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState({});
    const [bands, setBands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editting, setEditing] = useState(null);
    const [filterList, setFilterList] = useState([]); // 👉 để hiển thị Select lọc động

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await brandService.getAllBrand();
            const mappedResponse = response.map((item) => ({
                ...item,
                id: item.mathuonghieu,
                trangthaithuonghieuText: item.trangthaithuonghieu === 0 ? "Hoạt động" : "Ngưng hoạt động",
            }));

            setBands(mappedResponse);

            // 👉 Tạo dữ liệu cho DynamicSearchSort sau khi có data
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
    }

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
            <h2>📋 Danh sách thương hiệu</h2>

            <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />

            {/* 👉 Bổ sung lọc nâng cao */}
            <DynamicSearchSort
                initialListData={filterList}
                label="Tất cả"
                onChange={handleFilterChange}
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
