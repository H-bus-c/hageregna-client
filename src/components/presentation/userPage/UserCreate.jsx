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
import { menuItem } from "../../../services/InputValue";

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
const UserCreate = ({ roles, handleCreate, formik, isLoading, Id,citys }) => {
  return (
    <FormPaper sx={{ overflow: "auto" }}>
      <Grid container className="row" minWidth={350} textAlign="center">
        <Grid className="col-7 col-7 col-sm-8 col-md-9 col-lg-10 col-xl-11">
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: "1976d2" }}>
            {Id === "" ? "Add New User" : "Edit User Data"}
          </Typography>
        </Grid>
        <Grid className="col-5 col-5 col-sm-4 col-md-3 col-lg-2 col-xl-1">
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
              label="Full Name"
              size="small"
              fullWidth
              sx={{ minWidth: 330 }}
              name="fullName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullName}
              error={formik.touched.fullName && formik.errors.fullName}
              helperText={
                formik.touched.fullName && formik.errors.fullName
                  ? `${formik.errors.fullName}`
                  : ""
              }
            />
          </Grid>
          <Grid className="col-12 mb-2">
            <TextField
              required
              label="Username"
              type="text"
              size="small"
              fullWidth
              sx={{ minWidth: 330 }}
              name="userName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
              error={formik.touched.userName && formik.errors.userName}
              helperText={
                formik.touched.userName && formik.errors.userName
                  ? `${formik.errors.userName}`
                  : ""
              }
            />
          </Grid>
          <Grid className="col-12 mb-2">
            <TextField
              required
              type="email"
              label="Email"
              size="small"
              fullWidth
              sx={{ minWidth: 330 }}
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && formik.errors.email}
              helperText={
                formik.touched.email && formik.errors.email
                  ? `${formik.errors.email}`
                  : ""
              }
            />
          </Grid>
          <Grid className="col-12 mb-2">
            <TextField
              required
              type="tel"
              label="Phone Number"
              size="small"
              fullWidth
              sx={{ minWidth: 330 }}
              name="phoneNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              error={formik.touched.phoneNumber && formik.errors.phoneNumber}
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? `${formik.errors.phoneNumber}`
                  : ""
              }
            />
          </Grid>
          <Grid className="col-12 mb-2">
            <TextField
              select
              required
              label="Role"
              size="small"
              fullWidth
              sx={{ minWidth: 330 }}
              name="roleId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.roleId}
              error={formik.touched.roleId && formik.errors.roleId}
              helperText={
                formik.touched.roleId && formik.errors.roleId
                  ? `${formik.errors.roleId}`
                  : ""
              }
            >
              {roles.map((role, index) => (
                <MenuItem key={index} value={role.Id} sx={menuItem()}>
                  {role.roleName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {formik.values.roleId === 4 && (
            <Grid className="col-12 mb-2">
              <TextField
                select
                required
                label="Work Place"
                size="small"
                fullWidth
                sx={{ minWidth: 330 }}
                name="workPlace"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.workPlace}
                error={formik.touched.workPlace && formik.errors.workPlace}
                helperText={
                  formik.touched.workPlace && formik.errors.workPlace
                    ? `${formik.errors.workPlace}`
                    : ""
                }
              >
                {citys.map((city, index) => (
                  <MenuItem key={index} value={city.Id} sx={menuItem()}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
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
              {Id === "" ? "Add" : "Edit"} User
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormPaper>
  );
};

export default UserCreate;
