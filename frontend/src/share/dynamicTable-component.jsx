import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableFooter,
  TablePagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const DynamicTable = ({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  hideDeleteButton = false,
  showViewButton = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Cắt data theo trang
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Table sx={{ minWidth: 900 }} aria-label="dynamic table">
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.key}>{col.label}</TableCell>
          ))}
          <TableCell>Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.isArray(data) && data.length > 0 ? (
          paginatedData.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {typeof col.render === "function" ? (
                    col.render(row[col.key], row)
                  ) : col.isImage ? (
                    <img
                      src={row[col.key]}
                      alt={col.label}
                      style={{
                        width: "60px",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    row[col.key]
                  )}
                </TableCell>
              ))}
              <TableCell sx={{ display: "flex" }}>
                {showViewButton && (
                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => onView?.(row.id)}
                  >
                    Xem
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit?.(row.id)}
                  style={{ marginRight: "8px" }}
                >
                  Sửa
                </Button>
                {!hideDeleteButton && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete?.(row.id)}
                  >
                    Xóa
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length + 1} align="center">
              Không có dữ liệu
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Số hàng mỗi trang"
            sx={{ marginBottom: 0 }} // 👈 Thêm dòng này
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DynamicTable;
