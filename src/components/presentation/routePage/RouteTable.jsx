import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import TablePage from "../table/TablePage";

const RouteTable = ({ routes, citys, handleCreate, handleUpdate,handleDelete }) => {
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
      field: "city1",
      headerName: "Departure Place",
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        citys.find((city) => city.Id === params)?.name || "",
      renderCell: (params) => (
        <Tooltip
          title={`Zone : ${
            citys.find((city) => city.Id === params.row.city1)?.zone || ""
          }, Region : ${
            citys.find((city) => city.Id === params.row.city1)?.region || ""
          }`}
          arrow
        >
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "city2",
      headerName: "Arraival Place",
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        citys.find((city) => city.Id === params)?.name || "",
      renderCell: (params) => (
        <Tooltip
          title={`Zone : ${
            citys.find((city) => city.Id === params.row.city2)?.zone || ""
          }, Region : ${
            citys.find((city) => city.Id === params.row.city2)?.region ||
            ""
            }`}
          
          arrow
        >
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "duration",
      headerName: "Duration Time (24 hrs)",
      headerAlign: "center",
      align: "center",
      flex: 0.16,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "distance",
      headerName: "Distance (Km)",
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      headerClassName: "super-app-theme--header",
    },
    
    // {
    //   field: "action",
    //   headerName: "Action",
    //   headerAlign: "center",
    //   align: "center",
    //   width:100,
    //   headerClassName: "super-app-theme--header",
    //   renderCell: (params) => (
    //     <div className="row" >
    //       <center><GridActionsCellItem className="col-6"
    //         icon={
    //           <Tooltip title="Edit">
    //             <Edit color="primary" />
    //           </Tooltip>
    //         }
    //         onClick={() => handleUpdate(params.row)}
    //         label="Edit"
    //       />
    //       <GridActionsCellItem className="col-6"
    //         icon={
    //           <Tooltip title="Delete">
    //             <Delete color="error" />
    //           </Tooltip>
    //         }
    //          onClick={() => handleDelete(params.id)}
    //         label="Delete"
    //       /></center>
          
    //     </div>
    //   ),
    // },
  ];
  const rows = routes.map((route, index) => {
    let newBus = route;
    newBus.index = index + 1;
    return newBus;
  });
  return (
    <div>
      <TablePage
        rows={rows}
        columns={columns}
        datas={routes}
        handleCreate={handleCreate}
      />
    </div>
  );
};

export default RouteTable;
