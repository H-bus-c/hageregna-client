import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import TablePage from "../table/TablePage";
const BusTypeTable = ({ users, busTypes, handleCreate, handleUpdate ,handleDelete}) => {
  const columns = [
    {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      flex: 0.075,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userId",
      headerName: "Admin",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        users.find((role) => role.Id === params)?.fullName || "",
    },
    {
      field: "name",
      headerName: "Bus Name",
      headerAlign: "center",
      align: "center",
      flex: 0.15,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "contactName",
      headerName: "Contact Name",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "contactEmail",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "contactPhone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 0.15,
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
  const rows = busTypes.map((busType, index) => {
    let newBusType = busType;
    newBusType.index = index + 1;
    return newBusType;
  });
  return (
    <div>
      <TablePage
        rows={rows}
        columns={columns}
        datas={busTypes}
        handleCreate={handleCreate}
        minWidth={"700px"}
      />
    </div>
  );
};

export default BusTypeTable;
