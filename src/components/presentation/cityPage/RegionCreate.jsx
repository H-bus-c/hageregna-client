import {
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "15px",
  backdropFilter: "blur(5px)",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  maxWidth: "500px",
  margin:"10px 5px"
}));
const RegionCreate = ({ handleCreate, formik, isLoading, Id }) => {
  return (
    <FormPaper sx={{ overflow: "auto" }}>
      <Grid container className="row" minWidth={350}>
        <Grid className="col-7 col-sm-8 col-md-9 col-lg-10 col-xl-11">
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: "1976d2" }}>
            {Id === "" ? "Add New Region" : "Edit Region Data"}
          </Typography>
        </Grid>
        <Grid className="col-5 col-sm-4 col-md-3 col-lg-2 col-xl-1">
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
            onClick={handleCreate}
          >
            <KeyboardReturnRoundedIcon fontWeight="small" />
            <Typography
              sx={{
                marginLeft: "5px",
                fontSize: { xs: "0.85rem", lg: "1.1rem" },
              }}
            >
              Back
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <hr />
      <form onSubmit={formik.handleSubmit}>
        <Grid container className="row">
          <Grid className="col-12 mb-2">
            <TextField
              required
              type="text"
              label="Region"
              size="small"
              sx={{
                minWidth: 330,
              }}
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={formik.touched.name && formik.errors.name}
              helperText={
                formik.touched.name && formik.errors.name
                  ? `${formik.errors.name}`
                  : ""
              }
            />
          </Grid>

          <Grid className="col-12 mb-2">
            <Button
              variant="outlined"
              color="success"
              type="submit"
              disabled={isLoading}
              sx={{
                minWidth: 330,
                "&:hover": {
                  backgroundColor: "success.main",
                  color: "white",
                },
              }}
            >
              {Id === "" ? "Add" : "Edit"} Region
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormPaper>
  );
};

export default RegionCreate;
