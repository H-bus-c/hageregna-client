import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import TablePage from "../table/TablePage";

const BusTable = ({ buss, users, handleCreate, handleUpdate,handleDelete }) => {
  const columns = [
    {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userId",
      headerName: "Car Attendant",
      headerAlign: "center",
      align: "center",
      flex: 0.16,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        users.find((role) => role.Id === params)?.fullName || "",
    },
    {
      field: "licensePlate",
      headerName: "License Plate",
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "capacity",
      headerName: "Capacity",
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      width:100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="row ">
          <center><GridActionsCellItem className="col-6"
            icon={
              <Tooltip title="Edit">
                <Edit color="primary" />
              </Tooltip>
            }
            onClick={() => handleUpdate(params.row)}
            label="Edit"
          />
          <GridActionsCellItem className="col-6"
            icon={
              <Tooltip title="Delete">
                <Delete color="error" />
              </Tooltip>
            }
            onClick={() => handleDelete(params.id)}
            label="Delete"
          /></center>
          
        </div>
      ),
    },
  ];
  const rows = buss.map((bus, index) => {
    let newBus = bus;
    newBus.index = index + 1;
    return newBus;
  });
  return (
    <div>
      <TablePage
        rows={rows}
        columns={columns}
        datas={buss}
        handleCreate={handleCreate}
      />
    </div>
  );
};

export default BusTable;
