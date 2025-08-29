import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Person as PersonIcon,
  LocalOffer as LocalOfferIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Comment as CommentIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import ReduxStateExport from "../../redux/redux-state";

const NavBarAdmin = () => {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();
  const { userInfo } = ReduxStateExport();

  // ------------------- CẤU HÌNH MENU THEO ROLE -------------------
  const menuConfig = {
    1: [ // Admin
      {
        label: "Thống kê cơ bản",
        icon: <BarChartIcon />,
        path: "/admin",
      },
      {
        label: "Quản lý người dùng",
        icon: <PersonIcon />,
        path: "/admin/user",
      },
      {
        label: "Quản lý thương hiệu",
        icon: <LocalOfferIcon />,
        path: "/admin/manufacturer",
      },
      {
        label: "Quản lý sản phẩm",
        icon: <InventoryIcon />,
        section: "sanPham",
        children: [
          { label: "Tất cả sản phẩm", path: "/admin/product" },
          { label: "Sản phẩm chờ duyệt", path: "/admin/product/pending" },
        ],
      },
      {
        label: "Quản lý đơn hàng",
        icon: <ShoppingCartIcon />,
        path: "/admin/orders",
      },
      {
        label: "Quản lý bình luận",        // 👈 thêm mục mới
        icon: <CommentIcon />,
        path: "/admin/comments",
      },
    ],
    2: [ // Nhân viên
      {
        label: "Thống kê cơ bản",
        icon: <BarChartIcon />,
        path: "/admin",
      },
      {
        label: "Quản lý sản phẩm",
        icon: <InventoryIcon />,
        section: "sanPham",
        children: [
          { label: "Tất cả sản phẩm", path: "/admin/product" },
        ],
      },
      {
        label: "Quản lý đơn hàng",
        icon: <ShoppingCartIcon />,
        path: "/admin/orders",
      },
    ],
  };

  const role = userInfo?.role ?? 2; // nếu chưa có user thì mặc định là nhân viên
  const menuItems = menuConfig[role] || [];

  // ------------------- FUNCTION -------------------
  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const listItemBaseStyle = (path) => ({
    borderRadius: "12px",
    color: "#1f1f1f",
    cursor: "pointer",
    userSelect: "none",
    backgroundColor: location.pathname === path ? "#ffd400" : "transparent",
    "&:hover": { backgroundColor: "#ffd400" },
  });

  // ------------------- RENDER -------------------
  return (
    <Box
      sx={{
        width: "250px",
        backgroundColor: "#fff",
        padding: "30px 10px",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "1px" },
        "&::-webkit-scrollbar-track": { background: "#0d1117" },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": { background: "#fff" },
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#1f1f1f", px: 2 }}
      >
        Quản lý hệ thống
      </Typography>

      <List component="nav">
        {menuItems.map((item, index) =>
          item.children ? (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => toggleSection(item.section)}
                sx={listItemBaseStyle()}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: "#1f1f1f" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {openSection === item.section ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                in={openSection === item.section}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.children.map((child, cIndex) => (
                    <ListItem
                      key={cIndex}
                      button
                      component={Link}
                      to={child.path}
                      sx={{
                        ...listItemBaseStyle(child.path),
                        pl: 4,
                        mt: cIndex > 0 ? 1 : 0,
                      }}
                    >
                      <ListItemText primary={child.label} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem
              key={index}
              button
              component={Link}
              to={item.path}
              sx={listItemBaseStyle(item.path)}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "#1f1f1f" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          )
        )}
      </List>
    </Box>
  );
};

export default NavBarAdmin;
