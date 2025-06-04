import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import TablePage from "../table/TablePage";
const ZoneTable = ({ zones, regions, handleCreate, handleUpdate,handleDeleteZone }) => {
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
      field: "name",
      headerName: "Zone",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "regionId",
      headerName: "Region",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        regions.find((region) => region.Id === params)?.name || "",
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
          <center>  <GridActionsCellItem className="col-6"
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
             onClick={() => handleDeleteZone(params.id)}
            label="Delete"
          /></center>
        
        </div>
      ),
    },
  ];
  const rows = zones.map((zone, index) => {
    let newZone = zone;
    newZone.index = index + 1;
    return newZone;
  });
  return (
    <div>
      <TablePage
        rows={rows}
        columns={columns}
        datas={zones}
        handleCreate={handleCreate}
        width={{
          lg: `700px`,
          md: `700px`,
          sm: `700px`,
          xs: `500px`,
        }}
        minWidth={"350px"}
      />
    </div>
  );
};

export default ZoneTable;
