import React from "react";
import { CustomToolbar } from "./DataGridTable";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import { Box, Button, createTheme, ThemeProvider, Typography } from "@mui/material";
import { KeyboardReturnRounded } from "@mui/icons-material";
const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const TablePage = ({
  rows,
  columns,
  datas,
  width,
  minWidth,
  openCreate = true,
  openBack = false,
  openView = false,
  handleBack,
  handleCreate,
  handleView,
}) => {

  return (
    <ThemeProvider theme={theme}>
      <Card
        style={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          maxWidth: width ? `${width.lg}` : "1200px",
          margin: "10px 5px",  
          padding:"10px",
          textAlign: "left",
          borderRadius: "15px",
        }}
     
      >
        {(openCreate || openBack) && (
          <>
            <CardHeader style={{ paddingBottom: "5px" }}>
              {openCreate && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderColor: "primary.main",
                    width: { xs: "100px", lg: "110px" },
                    height: { xs: "30px", md: "35px", lg: "40px" },
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                  onClick={handleCreate}
                >
                  <span style={{ fontSize: 30 }}>+</span>
                  <Typography
                    sx={{
                      marginLeft: "5px",
                      fontSize: { xs: "0.85rem", lg: "1.1rem" },
                    }}
                  >
                    Create
                  </Typography>
                </Button>
              )}{" "}
              {openBack && (
                <Button
                  variant="outlined"
                  sx={{
                    float: "right",
                    borderColor: "rgba(119, 2, 165, 0.77)",
                    color: "white",
                    backgroundColor: "rgba(119, 2, 165, 0.77)",
                    width: { xs: "80px", lg: "90px" },
                    height: { xs: "30px", md: "35px", lg: "40px" },
                    "&:hover": {
                      color: "white",
                      borderColor: "info.main",
                      backgroundColor: "info.main",
                    },
                  }}
                  onClick={handleBack}
                >
                  <KeyboardReturnRounded fontWeight="small" />
                  <Typography
                    sx={{
                      marginLeft: "5px",
                      fontSize: { xs: "0.85rem", lg: "1.1rem" },
                    }}
                  >
                    Back
                  </Typography>
                </Button>
              )}
            </CardHeader>
          </>
        )}

        <CardBody>
          <Box sx={{ whiteSpace: "nowrap", overflow: "auto",mx:{xs:-2.5,sm:-2,md:0} }}>
            <Box
              sx={{
                // backgroundColor: "rgba(26, 24, 24, 0)",
                // backdropFilter: "blur(8px)",
                height: 500,
                maxWidth: width
                  ? {
                      lg: `${width.lg}`,
                      md: `${width.md}`,
                      sm: `${width.sm}`,
                      xs: `${width.xs}`,
                    }
                  : {
                      lg: "1100px",
                      md: "1000px",
                      sm: "700px",
                      xs: "450px",
                    },
                whiteSpace: "nowrap",
                overflow: "auto",
              }}
            >
              <DataGrid
                rows={rows}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                sx={{
                  minWidth:minWidth||"500px" ,
                  "& .super-app-theme--header": {
                    backgroundColor: "rgba(134, 134, 134, 0.7)",
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: {
                      xs: "13px",
                      sm: "15px", //500
                      md: "17px", //768
                      lg: "18px", //1024
                    },
                  },
                  "& .MuiDataGrid-cell": {
                    cursor: "pointer",
                    fontSize: {
                      xs: "12px",
                      sm: "14px", //500
                      md: "16px", //768
                      lg: "17px", //1024
                    },
                  },
                }}
                columns={columns}
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                initialState={{
                  ...datas.initialState,
                  pagination: {
                    paginationModel: { pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 15]}
                onCellDoubleClick={(rows) => openView && handleView(rows.row)}
                getRowId={(row) => row.Id}
              />
            </Box>
          </Box>
        </CardBody>
      </Card>
    </ThemeProvider>
  );
};

export default TablePage;
