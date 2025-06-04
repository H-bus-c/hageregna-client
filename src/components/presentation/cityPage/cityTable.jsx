import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import TablePage from "../table/TablePage";
const CityTable = ({ citys, zones, regions, handleCreate, handleUpdate,handleDeleteCity }) => {
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
      headerName: "City",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "zoneId",
      headerName: "Zone",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        zones.find((zone) => zone.Id === params)?.name || "",
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
             onClick={() => handleDeleteCity(params.id)}
            label="Delete"
          /></center>
          
        </div>
      ),
    },
  ];
  const rows = citys.map((city, index) => {
    const zone = zones.find((z) => z.Id === city.zoneId);
    let newCity = city;
    newCity.regionId = zone.regionId;
    newCity.index = index + 1;
    return newCity;
  });
  return (
    <div>
      <TablePage
        rows={rows}
        columns={columns}
        datas={citys}
        handleCreate={handleCreate}
      />
    </div>
  );
};

export default CityTable;
