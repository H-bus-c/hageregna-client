import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import React, { useMemo, useCallback } from "react";
import { menuItem } from "../../../services/InputValue";

const PassengerCard = React.memo(({ p, index, setCustomerData }) => {
  const toggleAvailable = useCallback(() => {
    setCustomerData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  }, [index, setCustomerData]);

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <strong>Full Name : </strong>
          {p.name}
        </Typography>
        <Grid container className="row">
          <Grid className="col-12" lg={8}>
            <Grid container className="row">
              <Grid sm={5}>
                <Typography variant="body1">
                  <strong>📞 Phone :</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>🎟 Ticket :</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>🪑 Seat :</strong>
                </Typography>
              </Grid>
              <Grid sm={7}>
                <Typography variant="body1">+251{p.phone}</Typography>
                <Typography variant="body1">
                  {p.ticketNumber?.match(/.{1,4}/g)?.join("−")}
                </Typography>
                <Typography variant="body1">
                  <b>{p.seatNumber}</b>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid className="col-12" lg={4}>
            <FormControlLabel
              control={
                <Checkbox checked={p.isAvailable} onClick={toggleAvailable} />
              }
              label="Available"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

const CheckList = ({
  routes = [],
  departureTimes = [],
  busGoesOut = [],
  customerData = [],
  isMobile,
  formik,
  handleDepartureTime,
  handleBus,
  handleCustomer,
  setCustomerData,
}) => {
  const renderedCustomers = useMemo(
    () =>
      customerData.map((p, index) => (
        <Grid className="col-12" md={6} key={index}>
          <PassengerCard
            p={p}
            index={index}
            setCustomerData={setCustomerData}
          />
        </Grid>
      )),
    [customerData, setCustomerData]
  );

  return (
    <Box maxWidth={1000} sx={{ my: 4, overflow: "auto" }}>
      <Paper
        sx={{ p: 2, minWidth: 355, background: "rgba(255, 255, 255, 0.8)" }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          🧾 Car Attendant
        </Typography>
        <Grid container className="row" justifyContent="center">
          <Grid className="col-11" sm={6} md={4}>
            <Autocomplete
              options={routes}
              getOptionLabel={(option) => {
                return `${option?.origin || ""} To ${option.destination || ""}`;
              }}
              value={formik.values.routeId || null}
              onChange={(_, value) => {
                handleDepartureTime(value);
                formik.setFieldValue("routeId", value);
              }}
              onBlur={formik.handleBlur}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Route"
                  fullWidth
                  error={
                    formik.touched.routeId && Boolean(formik.errors.routeId)
                  }
                  helperText={formik.touched.routeId && formik.errors.routeId}
                />
              )}
            />
          </Grid>
          <Grid className="col-11" sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Departure Time"
              type="time"
              variant="outlined"
              value={formik.values.departureTime}
              name="departureTime"
              onChange={(e) => {
                handleBus(e.target.value);
                formik.setFieldValue("departureTime", e.target.value);
              }}
              onBlur={formik.handleBlur}
              select
              error={
                formik.touched.departureTime &&
                Boolean(formik.errors.departureTime)
              }
              helperText={
                formik.touched.departureTime && formik.errors.departureTime
              }
            >
              {departureTimes.map((bus, index) => (
                <MenuItem key={index} value={index} sx={menuItem()}>
                  {bus}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid className="col-11" sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Leaving Bus"
              type="time"
              variant="outlined"
              value={formik.values.bus}
              name="bus"
              onChange={(e) => formik.setFieldValue("bus", e.target.value)}
              onBlur={formik.handleBlur}
              select
              error={formik.touched.bus && Boolean(formik.errors.bus)}
              helperText={formik.touched.bus && formik.errors.bus}
            >
              {busGoesOut.map((bus, index) => (
                <MenuItem key={index} value={index} sx={menuItem()}>
                  {bus}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid className="col-11" sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              size="medium"
              onClick={() => {
                setCustomerData(handleCustomer());
              }}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, 0.3)",
                },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <hr />

        {customerData.length > 0 ? (
          <Box pt={2} sx={{ width: isMobile ? "350px" : "auto" }}>
            <form onSubmit={formik.handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Passengers for:
              </Typography>
              <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container className="row">
                  {renderedCustomers}
                </Grid>
              </Box>

              <Button type="submit" variant="contained" color="success">
                Submit
              </Button>
            </form>
          </Box>
        ) : (
          <Typography variant="h5" color="textPrimary" my={5}>
            Not Found
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CheckList;
