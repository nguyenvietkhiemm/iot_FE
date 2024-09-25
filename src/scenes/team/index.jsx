import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from 'axios';
import Header from "../../components/Header";
import { useEffect, useState } from 'react';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "temperature", headerName: "TEMPERATURE", flex: 1 },
    { field: "humidity", headerName: "HUMIDITY", flex: 1 },
    { field: "light", headerName: "LIGHT", flex: 1 },
    { field: "time", headerName: "TIME", flex: 1 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/data/data_sensors`, {
          params: { page: page + 1, pageSize } // Cộng 1 vì API thường bắt đầu từ 1
        });
        setData(response.data.items); // Giả sử dữ liệu trả về là { items: [...], total: ... }
        setTotalRows(response.data.total); // Cập nhật tổng số hàng
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [page, pageSize]);

  return (
    <Box m="20px">
      <Header title="DATA SENSORS" subtitle="based on time" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "16px",
          },
          "& .MuiDataGrid-row": {
                            borderBottom: '1px solid #ddd',
                        },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid 
          checkboxSelection 
          rows={data} 
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalRows} // Tổng số hàng
          page={page}

          onPageChange={(newPage) => setPage(newPage)} // Cập nhật page
          onPageSizeChange={(newPageSize) => {
            setPage(0); // Quay về trang đầu khi thay đổi kích thước trang
            setPageSize(newPageSize);
          }}
        />
      </Box>
    </Box>
  );
};

export default Team;