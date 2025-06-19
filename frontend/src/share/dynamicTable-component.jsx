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
import VisibilityIcon from '@mui/icons-material/Visibility';

const DynamicTable = ({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  hideDeleteButton = false,
  showViewButton = false,
  getRowStyle,
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
            <TableRow key={index} style={getRowStyle ? getRowStyle(row) : {}}>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ padding: "0px 16px" }}>
                  {typeof col.render === "function" ? (
                    col.render(row[col.key], row)
                  ) : col.isImage ? (
                    // Render image if isImage is true
                    <div>
                      {/* Lấy ảnh đầu tiên từ danh sách ảnh */}
                      {row[col.key].split(',')[0] && (
                        <img
                          src={`http://localhost:3333/images/${row[col.key].split(',')[0]}`}
                          alt={col.label}
                          style={{
                            width: "90px",
                            height: "60px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
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
                    startIcon={<VisibilityIcon />}
                    onClick={() => onView?.(row.id)}
                    style={{ marginRight: "8px" }}
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
            sx={{ marginBottom: 0 }}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DynamicTable;
