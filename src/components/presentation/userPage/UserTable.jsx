import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import TablePage from "../table/TablePage";

const UserTable = ({
  users,
  roles,
  handleCreate,
  handleUpdate,
  handleDelete,
  citys,
  loginUser,
  busTypes
}) => {
  const columns = [
    {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "fullName",
      headerName: "Full Name",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userName",
      headerName: "Username",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "phoneNumber",
      headerName: "PhoneNumber",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roleId",
      headerName: "Role",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        roles.find((role) => role.Id === params)?.roleName || "",
    },
    loginUser.roleId===1?{
      field: "busType",
      headerName: "Bus Type",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
    }:{
      field: "workPlace",
      headerName: "Work Place",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        citys.find((city) => city.Id === params)?.name || "____",
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
          <center>  <GridActionsCellItem className="col-6 "
            icon={
              <Tooltip title="Edit User Data">
                <Edit color="primary" />
              </Tooltip>
            }
            onClick={() => handleUpdate(params.row)}
            label="Edit"
          />
          <GridActionsCellItem className="col-6 "
            icon={
              <Tooltip title="Delete User Data">
                <Delete color="error" />
              </Tooltip>
            }
            onClick={() =>loginUser.Id!==params.row.Id&& handleDelete(params.row.Id)}
            label="Delete"
          /></center>
        
        </div>
      ),
    },
  ];
  const rows = users.map((user, index) => {
    const busType = busTypes.find((b) => b.userId===user.Id)?.name || "____";
    let newUser = user;
    newUser.index = index + 1;
    newUser.busType = busType;
    console.log(newUser);
    return newUser;
  });
  return (
    <div>
      <TablePage
        rows={rows}
        columns={columns}
        datas={users}
        handleCreate={handleCreate}
        minWidth={"750px"}
      />
    </div>
  );
};

export default UserTable;
