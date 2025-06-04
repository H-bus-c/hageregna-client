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
    <FormPaper >
      <Grid container spacing={2}>
        <Grid item sm={8} md={9} xl={11} lg={10}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: "1976d2" }}>
            {Id === "" ? "Add New User" : "Edit User Data"}
          </Typography>
        </Grid>
        <Grid item sm={4} md={3} xl={1} lg={2}>
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
        <Grid container spacing={1}>
          <Grid container>
            <TextField
              required
              type="text"
              label="Full Name"
              size="small"
              sx={{
                width: "90vw",
                margin: "10px",
              }}
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
          <Grid container>
            <TextField
              required
              label="Username"
              type="text"
              size="small"
              sx={{
                width: "90vw",
                margin: "10px",
              }}
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
          <Grid container>
            <TextField
              required
              type="email"
              label="Email"
              size="small"
              sx={{
                width: "90vw",
                margin: "10px",
              }}
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
          <Grid container>
            <TextField
              required
              type="tel"
              label="Phone Number"
              size="small"
              sx={{
                width: "90vw",
                margin: "10px",
              }}
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
          <Grid container>
            <TextField
              select
              required
              label="Role"
              size="small"
              sx={{
                width: "90vw",
                margin: "10px",
              }}
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
          {formik.values.roleId===4&&<Grid container>
            <TextField
              select
              required
              label="Work Place"
              size="small"
              sx={{
                width: "90vw",
                margin: "10px",
              }}
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
          </Grid>}
          <Grid container>
            <Button
              variant="outlined"
              color="success"
              type="submit"
              disabled={isLoading}
              sx={{
                width: "90vw",
                margin: "10px",
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
