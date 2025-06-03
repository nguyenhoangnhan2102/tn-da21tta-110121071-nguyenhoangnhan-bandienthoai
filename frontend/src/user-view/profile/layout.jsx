// src/pages/profile/UserLayout.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import "../../web-view/style/profile.scss";

const UserLayout = () => {
    const location = useLocation();

    const navLinks = [
        { name: "Thông tin cá nhân", path: "/profile" },
    ];

    return (
        <div className="d-flex h-100" style={{ minHeight: "75vh" }}>
            {/* Sidebar bên trái */}
            <aside className="p-3 border-end" style={{ width: "220px", backgroundColor: "#f8f9fa" }}>
                <h5 className="mb-3">Tài khoản</h5>
                <ul className="nav flex-column gap-2">
                    {navLinks.map((link) => (
                        <li key={link.path} className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === link.path ? "active fw-bold" : ""}`}
                                to={link.path}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Nội dung bên phải */}
            <main className="flex-grow-1 p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
