import { SearchOutlined } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";

export function CustomToolbar() {
  return (
    <center>
      <GridToolbarQuickFilter
        variant="filled"
        placeholder="Search..."
        sx={{
          width: "300px",
          mt: 0.5,
          
        }} // Adjust width
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
      />
    </center>
  );
}
