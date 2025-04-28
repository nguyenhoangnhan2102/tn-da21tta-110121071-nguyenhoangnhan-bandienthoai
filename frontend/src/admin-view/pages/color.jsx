import React, { useState, useEffect } from "react";
import DynamicTable from "../../share/dynamicTable-component";
// import ProductModalMui from "../modal/product-modal";
import { Button } from "@mui/material";
import userService from "../../services/userAccountService";
import BrandModal from "../modal/brand-modal";
import brandService from "../../services/brandService";
import { toast } from "react-toastify";
import colorService from "../../services/colorService";
import ColorModal from "../modal/color-modal";

const ColorComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState({});
    const [sortColumn, setSortColumn] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [colors, setColors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    const fetchData = async () => {
        try {
            const response = await colorService.getAllColor();
            console.log("response", response);
            // Map lại để mỗi item có thêm trường id = mathuonghieu
            const mappedResponse = response.map((item) => ({
                ...item,
                id: item.mamau,
            }));
            setColors(mappedResponse);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    // Hàm tìm kiếm dữ liệu
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
    const filteredData = colors.filter((item) => {
        const searchLower = searchTerm.toLowerCase();

        const matchSearch = item.tenmau &&
            item.tenmau.toLowerCase().includes(searchLower);

        const matchFilter = Object.entries(filterValue).every(([key, value]) =>
            value ? item[key] === value : true
        );
        return matchSearch && matchFilter;
    });


    console.log("filteredData", filteredData);

    // Sắp xếp dữ liệu
    const sortedData = filteredData.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // List data cho C_SortList
    // const listData = [
    //     {
    //         key: "name",
    //         value: filterValue.name || "",
    //         listSelect: Array.from(new Set(bands.map((u) => u.name))).map(
    //             (name) => ({
    //                 id: name,
    //                 name,
    //             })
    //         ),
    //     },
    // ];

    const handleDelete = async (mamau) => {
        try {
            const response = await colorService.deleteColor(mamau);
            if (response) {
                toast.success("Xóa thương hiệu thành công");
                fetchData(); // Cập nhật lại danh sách sau khi xóa
            } else {
                toast.error("Xóa thương hiệu thất bại");
            }
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    }

    //data của dữ liệu
    const columns = [
        { key: "mamau", label: "ID" },
        { key: "tenmau", label: "Tên màu" },
        { key: "trangthaimau", label: "Trạng thái" },
        { key: "created_at", label: "Ngày tạo" },
        { key: "updated_at", label: "Ngày cập nhật" },
    ];

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 Danh sách sản phẩm</h2>

            {/* Giao diện tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "1rem",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setEditing(null);
                        setShowModal(true);
                    }}
                >
                    Thêm thương hiệu
                </Button>
            </div>
            {/* Hiển thị table với dữ liệu đã lọc và sắp xếp */}
            <DynamicTable
                columns={columns}
                data={sortedData}
                onEdit={(id) => {
                    const selectedUser = sortedData.find((u) => u.id === id);
                    setEditing(selectedUser);
                    setShowModal(true);
                }}
                onDelete={(id) => {
                    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
                        handleDelete(id);
                    }
                }}
            />

            <ColorModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => {
                    fetchData();
                    setShowModal(false); // 👈 Đóng modal sau khi lưu
                }}
                color={editing} // 👈 Thêm dòng này
                isView={false}
            />
        </div>
    );
};

export default ColorComponent;
