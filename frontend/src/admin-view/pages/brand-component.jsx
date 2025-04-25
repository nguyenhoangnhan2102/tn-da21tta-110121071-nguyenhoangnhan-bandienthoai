import React, { useState, useEffect } from "react";
import DynamicTable from "../../share/dynamicTable-component";
// import ProductModalMui from "../modal/product-modal";
import { Button } from "@mui/material";
import userService from "../../services/userAccountService";

const BrandComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState({});
    const [sortColumn, setSortColumn] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [bands, setBands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    const fetchData = async () => {
        try {
            const response = await userService.getAllUser();
            console.log("response", response);
            setBands(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Hàm tìm kiếm dữ liệu
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
    const filteredData = bands.filter((item) => {
        const searchLower = searchTerm.toLowerCase();

        const matchSearch =
            item.hoten.toLowerCase().includes(searchLower) ||
            item.email.toLowerCase().includes(searchLower);

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
    const listData = [
        {
            key: "name",
            value: filterValue.name || "",
            listSelect: Array.from(new Set(bands.map((u) => u.name))).map(
                (name) => ({
                    id: name,
                    name,
                })
            ),
        },
    ];

    // Hàm thay đổi bộ lọc
    const handleFilterChange = (updatedListData) => {
        const updatedFilterValue = updatedListData.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        setFilterValue(updatedFilterValue); // Cập nhật giá trị bộ lọc
    };

    //data của dữ liệu
    const columns = [
        { key: "manguoidung", label: "ID" },
        { key: "hoten", label: "Họ tên" },
        { key: "email", label: "Email" },
        { key: "sodienthoai", label: "Số điện thoại" },
        { key: "diachi", label: "Địa chỉ" },
        { key: "role", label: "Vai trò" },
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
                        setEditingUser(null);
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
            // onEdit={(id) => {
            //     const selectedUser = sortedData.find((u) => u.id === id);
            //     setEditingUser(selectedUser);
            //     setShowModal(true);
            // }}
            // onDelete={(id) => {
            //     if (window.confirm("Bạn có chắc muốn xóa user này?")) {
            //         handleDeleteUser(id);
            //     }
            // }}
            />
            {/*
            <ProductModalMui
                open={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={() => fetchProduct()}
                initialData={editingUser}
            /> */}
        </div>
    );
};

export default BrandComponent;
