import { useEffect, useState } from "react";
import { getAllUser } from "../../service/userAccountService";
import "../css/dashboard.scss";

const Accounts = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const usersPerPage = 10;

    useEffect(() => {
        getAllUsersList();
    }, []);

    const getAllUsersList = async () => {
        try {
            const response = await getAllUser(); // Fetch users from API
            if (response.EC === 1) {
                console.log(response.DT);
                setUsers(response.DT || []);
            }
            else {
                console.error("Failed");
            }
        }
        catch (error) {
            console.log("Failed", error)
        }

    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const currentUsers = users
        .filter(
            (user) =>
                user.hoten.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);



    return (
        <div>
            <div className="group-header">
                <h2>Danh sách tài khoản</h2>
                <div className="filterGroup" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ paddingRight: '30px' }} // Chừa khoảng trống cho icon
                    />
                    <i
                        className="fa-solid fa-magnifying-glass"
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: '#000'
                        }}
                    ></i>
                </div>
            </div>

            {/* <table className="table table-striped"> */}
            <table className="table table-hover">
                <thead className="thead-dark">
                    <tr className="table-title">
                        <th scope="col">STT</th>
                        <th scope="col">Tên người dùng</th>
                        <th scope="col">Email</th>
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Phân quyền</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user, index) => (
                            <tr key={user.makhachhang}>
                                <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                <td>{user.hoten || "Không có tên"}</td>
                                <td>{user.email || "Không có email"}</td>
                                <td>{user.sodienthoai}</td>
                                <td>{user.diachi}</td>
                                <td>
                                    {user.role === 1
                                        ? "Admin"
                                        : user.role === -1
                                            ? "Tạm Khóa"
                                            : "User"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">
                                <h6>Không tìm thấy</h6>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end admin-pagination">
                    {/* Nút Previous */}
                    <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li
                        className={`page-item ${currentPage === totalPages || currentUsers.length === 0 ? "disabled" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages || currentUsers.length === 0}
                        >
                            Sau
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Accounts;
