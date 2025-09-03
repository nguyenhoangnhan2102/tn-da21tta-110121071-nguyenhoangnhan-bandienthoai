// SidebarUser.jsx
import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { AccountCircle, History, Star } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";


const SidebarUser = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Thông tin cá nhân", icon: <AccountCircle />, path: "/profile" },
        { text: "Lịch sử đơn hàng", icon: <History />, path: "/profile/history-order" },
    ];

    return (
        <>
            <h3 style={{ padding: "16px", marginBottom: 0 }}>Tài khoản</h3>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        selected={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                        sx={{
                            "&.Mui-selected": {
                                backgroundColor: "#e3f2fd",
                                color: "#1976d2",
                            },
                            "&:hover": {
                                backgroundColor: "#f1f1f1",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? "#1976d2" : "#555" }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};

export default SidebarUser;
