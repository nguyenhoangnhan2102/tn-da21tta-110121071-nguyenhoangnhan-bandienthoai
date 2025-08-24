import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse, // Đừng quên import Collapse
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People"; // Quản lý người dùng
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Quản lý đơn hàng
import InventoryIcon from "@mui/icons-material/Inventory"; // Quản lý sản phẩm
import GroupIcon from "@mui/icons-material/Group"; // Tương tác người dùng
import ExpandLess from "@mui/icons-material/ExpandLess"; // Import đúng từ đây
import ExpandMore from "@mui/icons-material/ExpandMore"; // Import đúng từ đây
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
const NavBarAdmin = () => {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  const [openCategory, setOpenCategory] = useState(false);

  const handleClick = () => {
    setOpenCategory(!openCategory);
  };
  return (
    <>
      {" "}
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
          "&::-webkit-scrollbar": {
            width: "1px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0d1117",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#fff",
          },
        }}
      >
        <Typography
          variant="h6"
          style={{
            marginBottom: "20px",
            color: "#1f1f1f",
            padding: "0px 16px",
          }}
        >
          Quản lý hệ thống
        </Typography>
        <List component="nav">
          <ListItem
            button
            component={Link}
            to="/admin"
            sx={{
              borderRadius: "12px",
              color: "#1f1f1f",
              cursor: "pointer",
              userSelect: "none",
              backgroundColor:
                location.pathname === "/admin" ? "#ffd400" : "transparent", // Kiểm tra nếu đang ở trang này
              "&:hover": { backgroundColor: "#ffd400" },
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", color: "#1f1f1f" }}>
              {" "}
              <BarChartIcon />
            </ListItemIcon>

            <ListItemText primary="Thống kê cơ bản" />
          </ListItem>
          {/* //----------------------- */}
          <List>
            {/* Quản lý người dùng */}
            <ListItem
              button
              component={Link}
              to="/admin/user"
              sx={{
                borderRadius: "12px",
                color: "#1f1f1f",
                cursor: "pointer",
                userSelect: "none",
                backgroundColor:
                  location.pathname === "/admin/user"
                    ? "#ffd400"
                    : "transparent", // Kiểm tra nếu đang ở trang này
                "&:hover": { backgroundColor: "#ffd400" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "#1f1f1f" }}>
                {" "}
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Quản lý người dùng" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/admin/manufacturer"
              sx={{
                borderRadius: "12px",
                color: "#1f1f1f",
                cursor: "pointer",
                userSelect: "none",
                backgroundColor:
                  location.pathname === "/admin/manufacturer"
                    ? "#ffd400"
                    : "transparent", // Kiểm tra nếu đang ở trang này
                "&:hover": { backgroundColor: "#ffd400" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "#1f1f1f" }}>
                {" "}
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Quản lý thương hiệu" />
            </ListItem>

            {/* Quản lý sản phẩm */}
            <ListItem
              button
              onClick={() => toggleSection("sanPham")}
              sx={{
                borderRadius: "12px",
                color: "#1f1f1f",
                cursor: "pointer",
                userSelect: "none",
              }}
              to="/admin/product"
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "#1f1f1f" }}>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý sản phẩm"
                sx={{ color: "#1f1f1f" }}
              />
              {openSection === "sanPham" ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openSection === "sanPham"}
              timeout="auto"
              unmountOnExit
              to="/admin/product"
            >
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/admin/product"
                  sx={{
                    pl: 4,
                    color: "#1f1f1f",
                    borderRadius: "13px",
                    backgroundColor:
                      location.pathname === "/admin/product"
                        ? "#ffd400"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": { backgroundColor: "#ffd400" },
                  }}
                >
                  <ListItemText primary="Tất cả sản phẩm" />
                </ListItem>{" "}
              </List>
            </Collapse>
            <Collapse
              in={openSection === "sanPham"}
              timeout="auto"
              unmountOnExit
              to="/admin/product"
            >
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/admin/product/pending"
                  sx={{
                    pl: 4,
                    mt: 1,
                    color: "#1f1f1f",
                    borderRadius: "13px",
                    backgroundColor:
                      location.pathname === "/admin/product/pending"
                        ? "#ffd400"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": { backgroundColor: "#ffd400" },
                  }}
                >
                  <ListItemText primary="Sản phẩm chờ duyệt" />
                </ListItem>{" "}
              </List>
            </Collapse>

            {/* Quản lý đơn hàng */}
            <ListItem
              button
              component={Link}
              to="/admin/orders"
              sx={{
                borderRadius: "12px",
                color: "#1f1f1f",
                cursor: "pointer",
                userSelect: "none",
                backgroundColor:
                  location.pathname === "/admin/orders"
                    ? "#ffd400"
                    : "transparent", // Kiểm tra nếu đang ở trang này
                "&:hover": { backgroundColor: "#ffd400" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "#1f1f1f" }}>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Quản lý đơn hàng" />
            </ListItem>
          </List>
        </List>
      </Box>{" "}
    </>
  );
};

export default NavBarAdmin;
