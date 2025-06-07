import {
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  Autocomplete,
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
const RouteCreate = ({
  citys,
  zones,
  regions,
  handleCreate,
  formik,
  isLoading,
  Id,
}) => {
  return (
    <FormPaper sx={{ overflow: "auto" }}>
      <Grid container className="row" minWidth={350}>
        <Grid className="col-7 col-sm-8 col-md-9 col-lg-10 col-xl-11">
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: "1976d2" }}>
            {Id === "" ? "Add New Routes" : "Edit Routes Data"}
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
            <Autocomplete
              options={citys}
              getOptionLabel={(option) => {
                const zone = zones.find((z) => z?.Id === option?.zoneId);
                const region = regions.find((r) => r?.Id === zone?.regionId);
                return `${option?.name} , ${zone?.name} , ${region?.name}`;
              }}
              value={!formik.values.city1 ? null : formik.values.city1}
              onChange={(_, value) => formik.setFieldValue("city1", value)}
              onBlur={formik.handleBlur}
              isOptionEqualToValue={(option, value) =>
                option.name === value?.name
              }
              size="small"
              fullWidth
              sx={{
                minWidth: 330,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Departure Place"
                  name="city1"
                  error={formik.touched.city1 && Boolean(formik.errors.city1)}
                  helperText={
                    formik.touched.city1 && formik.errors.city1
                      ? `${formik.errors.city1}`
                      : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid className="col-12 mb-2">
            <Autocomplete
              options={citys}
              getOptionLabel={(option) => {
                const zone = zones.find((z) => z?.Id === option?.zoneId);
                const region = regions.find((r) => r?.Id === zone?.regionId);
                return `${option?.name} , ${zone?.name} , ${region?.name}`;
              }}
              value={!formik.values.city2 ? null : formik.values.city2}
              onChange={(_, value) => formik.setFieldValue("city2", value)}
              onBlur={formik.handleBlur}
              isOptionEqualToValue={(option, value) =>
                option.name === value?.name
              }
              size="small"
              fullWidth
              sx={{
                minWidth: 330,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Arraival Place"
                  name="city2"
                  error={formik.touched.city2 && Boolean(formik.errors.city2)}
                  helperText={
                    formik.touched.city2 && formik.errors.city2
                      ? `${formik.errors.city2}`
                      : ""
                  }
                />
              )}
            />
          </Grid>

          <Grid className="col-12 mb-2">
            <TextField
              required
              type="number"
              label="Distance (Km)"
              size="small"
              fullWidth
              sx={{
                minWidth: 330,
              }}
              name="distance"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.distance}
              error={formik.touched.distance && formik.errors.distance}
              helperText={
                formik.touched.distance && formik.errors.distance
                  ? `${formik.errors.distance}`
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
              fullWidth
              sx={{
                minWidth: 330,
                "&:hover": {
                  backgroundColor: "success.main",
                  color: "white",
                },
              }}
            >
              {Id === "" ? "Add" : "Edit"} Routes
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormPaper>
  );
};

export default RouteCreate;
