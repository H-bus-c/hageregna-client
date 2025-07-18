import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  TextField,
  IconButton,
  Divider,
  Box,
  MenuItem,
  InputAdornment,
  Container,
  CardHeader,
} from "@mui/material";
import { EventSeat, ArrowBack, DirectionsBusFilled } from "@mui/icons-material";
import { styled } from "@mui/system";
import { menuItem } from "../../../services/InputValue";
import AlertCondition from "../alert/AlertCondition";
import { Col, Row } from "react-bootstrap";
import { passengersSchema } from "../../../services/passengersSchema";
import CustomerPage from "../../../services/CustomerPage";

const SeatButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(0.43),
  marginBottom: "-5px",
  color: "white",
  "&:hover": {
    color: "black",
  },
}));

const CustomerBooking = ({
  formik,
  hnadleSelectBus,
  holdSeat,
  activeStep,
  handleBack,
  setActiveStep,
  listAvailableBus,
  busTypes,
  activeBus,
  availableSeatNumbers,
  isMobile,
  handleChange,
  passengers,
  setPassengers,
  errors,
  setErrors,
  departureTimes,
  buss,
  calenderECtoGC,
  userType,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [busValue, setBusValue] = useState(null);
  const [clickValue, setClickValue] = useState({
    clickFunction: "",
    value: "",
  });

  const leaveBus = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
  ];
  const customerPage = new CustomerPage();
  // Sample bus data
  const rowIndexs = (rowindex, index) => {
    if (index === 1) {
      return rowindex * 4 + 1 === 1
        ? 1
        : rowindex * 4 + 1 < 30
        ? rowindex * 4 - 1
        : rowindex * 4 - 3;
    } else if (index === 2) {
      return rowindex * 4 + 2 === 2
        ? 2
        : rowindex * 4 + 1 < 31
        ? rowindex * 4
        : rowindex * 4 - 2;
    } else if (index === 3) {
      return rowindex * 4 + 3 < 31 ? rowindex * 4 + 1 : rowindex * 4 - 1;
    } else {
      return rowindex * 4 + 4 < 32 ? rowindex * 4 + 2 : rowindex * 4;
    }
  };
  const style = (status) => {
    return {
      width: { xs: 45, sm: 60, md: 75, lg: 90 },
      height: "50px",
      backgroundColor:
        status === "booked"
          ? "rgb(168, 25, 25)"
          : status === "selected"
          ? "rgb(2, 136, 31)"
          : status === "held"
          ? "rgb(248, 171, 4)"
          : "rgb(0, 18, 117)",
    };
  };
  const steps = ["Select Seats", "Passenger Details", "Confirm Booking"];
  const rows = Array.from({ length: 13 }, (_, rowIndex) => (
    <Grid container justifyContent="space-between" key={rowIndex}>
      <Grid mb={1.2}>
        <Box display="flex">
          <SeatButton
            onClick={(e) => {
              holdSeat(rowIndexs(rowIndex, 1));
            }}
            sx={style(
              availableSeatNumbers[rowIndexs(rowIndex, 1) - 1]?.status ||
                "booked"
            )}
            startIcon={<EventSeat />}
            variant="contained"
          >
            {rowIndexs(rowIndex, 1)}
          </SeatButton>
          <SeatButton
            onClick={(e) => {
              holdSeat(rowIndexs(rowIndex, 2));
            }}
            sx={style(
              availableSeatNumbers[rowIndexs(rowIndex, 2) - 1]?.status ||
                "booked"
            )}
            startIcon={<EventSeat />}
            variant="contained"
          >
            {rowIndexs(rowIndex, 2)}
          </SeatButton>
        </Box>
      </Grid>
      <Grid mb={1.2}>
        <Box display="flex">
          <SeatButton
            onClick={(e) => {
              holdSeat(rowIndexs(rowIndex, 3));
            }}
            sx={style(
              availableSeatNumbers[rowIndexs(rowIndex, 3) - 1]?.status ||
                "booked"
            )}
            startIcon={<EventSeat />}
            variant="contained"
            style={
              rowIndex * 4 + 3 === 31 || rowIndex * 4 + 3 === 3
                ? { display: "none" }
                : {}
            }
          >
            {rowIndexs(rowIndex, 3)}
          </SeatButton>
          <SeatButton
            onClick={(e) => {
              holdSeat(rowIndexs(rowIndex, 4));
            }}
            sx={style(
              availableSeatNumbers[rowIndexs(rowIndex, 4) - 1]?.status ||
                "booked"
            )}
            startIcon={<EventSeat />}
            variant="contained"
            style={
              rowIndex * 4 + 4 === 32 || rowIndex * 4 + 4 === 4
                ? { display: "none" }
                : {}
            }
          >
            {rowIndexs(rowIndex, 4)}
          </SeatButton>
        </Box>
      </Grid>
    </Grid>
  ));
  const handleClick = () => {
    const fun = clickValue.clickFunction;
    setAlertOpen(false);
    setAlertMessage("");
    if (fun === 1) {
      handleBack();
    } else if (fun === 2) {
      hnadleSelectBus(clickValue.value);
      const listBus = listAvailableBus.find(
        (item, index) => index === clickValue.value
      );
      const busType = busTypes.find((b) => b.Id === listBus.busTypeId);
      setBusValue(busType.name);
    }
  };
  return (
    <div>
      <Container maxWidth="lg">
        {alertOpen && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AlertCondition
              open={alertOpen}
              setOpen={setAlertOpen}
              message={alertMessage}
              handleClick={handleClick}
              title={"Cancel Holding Seat"}
              color="warning"
            />
          </div>
        )}
        <Paper
          sx={{
            minWidth: { xs: 350 },
            mx: { xs: -1.5 },
            px: { xs: 1, sm: 2 },
            my: 1,
            py: 1.5,
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* Header Section */}
          <Grid className="row" alignItems="center">
            <Grid className="col-1 col-sm-5 col-md-4 col-lg-3">
              {isMobile ? (
                <IconButton
                  onClick={(e) => {
                    const checkSelecteSeat = availableSeatNumbers?.find(
                      (item) => item.status === "selected"
                    );
                    if (checkSelecteSeat) {
                      setAlertOpen(true);
                      setAlertMessage(
                        "Are you sure you want to cancel holding this seat? It will become available to other users."
                      );
                      setClickValue({ clickFunction: 1, value: "" });
                    } else {
                      handleBack();
                    }
                  }}
                  title="Back to Search"
                  sx={{
                    color: "white",
                    backgroundColor: "primary.main",
                    borderColor: "primary.main",
                    border: "solid 1px",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "error.main",
                    },
                  }}
                >
                  <ArrowBack />
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<ArrowBack />}
                  onClick={(e) => {
                    const checkSelecteSeat = availableSeatNumbers?.find(
                      (item) => item.status === "selected"
                    );
                    if (checkSelecteSeat) {
                      setAlertOpen(true);
                      setAlertMessage(
                        "Are you sure you want to cancel holding this seat? It will become available to other users."
                      );
                      setClickValue({ clickFunction: 1, value: "" });
                    } else {
                      handleBack();
                    }
                  }}
                  //fullWidth={isMobile}
                  sx={{
                    minWidth: 150,
                    "&:hover": {
                      color: "black",
                    },
                  }}
                >
                  Back to Search
                </Button>
              )}
            </Grid>
            <Grid className="col-11 col-sm-7 col-md-8 col-lg-9">
              <Typography variant="h5" gutterBottom>
                {formik.values.origin.name} To {formik.values.destination.name}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          {/* Progress Stepper */}
          <Grid className="col-12">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <hr />
          {/* Seat Map Section */}
          <Box>
            {activeStep === 0 && (
              <Grid className="row" display="flex" justifyContent="center">
                <Grid
                  textAlign="center"
                  justifyItems="center"
                  className="col-6 col-md-3"
                >
                  <div
                    style={{
                      borderRadius: "10px",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "rgb(2, 136, 31)",
                    }}
                  ></div>{" "}
                  <Typography variant="body1" color="textPrimary">
                    Selected By You
                  </Typography>
                </Grid>
                <Grid
                  textAlign="center"
                  justifyItems="center"
                  className="col-6 col-md-3"
                >
                  <div
                    style={{
                      borderRadius: "10px",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "rgb(248, 171, 4)",
                    }}
                  ></div>{" "}
                  <Typography variant="body1" color="textPrimary">
                    Selected By Someone
                  </Typography>
                </Grid>
                <Grid
                  textAlign="center"
                  justifyItems="center"
                  className="col-6 col-md-3"
                >
                  <div
                    style={{
                      borderRadius: "10px",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "rgb(168, 25, 25)",
                    }}
                  ></div>{" "}
                  <Typography variant="body1" color="textPrimary">
                    Booked Seat
                  </Typography>
                </Grid>
                <Grid
                  textAlign="center"
                  justifyItems="center"
                  className="col-6 col-md-3"
                >
                  <div
                    style={{
                      borderRadius: "10px",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "rgb(0, 18, 117)",
                    }}
                  ></div>{" "}
                  <Typography variant="body1" color="textPrimary">
                    Available Seat
                  </Typography>
                </Grid>
                <Grid className="col-12" textAlign="center" mt={2}>
                  <TextField
                    select
                    id="ksdjks"
                    type="text"
                    variant="outlined"
                    fullWidth
                    // defaultValue={listAvailableBus[activeBus]}
                    size="small"
                    sx={{
                      maxWidth: 300,
                      m: "auto",
                      //  mt: 3,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          // borderColor: "rgba(0,0,0,1)",
                          border: "solid 3px black",
                        },
                      },
                    }}
                    label={
                      <strong style={{ fontSize: "1.2rem" }}>Select Bus</strong>
                    }
                    value={busValue ?? ""}
                    onChange={(e) => {
                      const checkSelecteSeat = availableSeatNumbers?.find(
                        (item) => item.status === "selected"
                      );
                      if (checkSelecteSeat) {
                        setAlertOpen(true);
                        setAlertMessage(
                          "Are you sure you want to cancel holding this seat? It will become available to other users."
                        );
                        setClickValue({
                          clickFunction: 2,
                          value: e.target.value,
                        });
                      } else {
                        hnadleSelectBus(e.target.value);
                        const listBus = listAvailableBus.find(
                          (item, index) => index === e.target.value
                        );
                        const busType = busTypes.find(
                          (b) => b.Id === listBus.busTypeId
                        );
                        setBusValue(busType.name);
                      }
                    }}
                  >
                    {listAvailableBus.map((l, index) => {
                      const busType = busTypes.find(
                        (b) => b.Id === l.busTypeId
                      );
                      return (
                        <MenuItem
                          key={l.Id}
                          value={index ?? ""}
                          sx={menuItem()}
                        >
                          {busType.name}
                          <Typography ml={5}>
                            {53 - Number(l.totalSeat)} <EventSeat />
                          </Typography>
                          <Typography ml={5}>{l.basePrice} Br</Typography>
                        </MenuItem>
                      );
                    })}
                  </TextField>

                  <hr />
                </Grid>

                <Grid className="col-12" textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Select Seats (
                    <strong>
                      {availableSeatNumbers?.filter(
                        (a) => a?.status === "selected"
                      )?.length || 0}{" "}
                      selected
                    </strong>
                    ){" "}
                    <strong style={{ fontSize: 24, marginLeft: "20px" }}>
                      {
                        busTypes?.find(
                          (bus) =>
                            bus?.Id === listAvailableBus[activeBus]?.busTypeId
                        )?.name
                      }
                    </strong>
                  </Typography>
                </Grid>

                {activeBus !== "" && (
                  <Grid
                    className="col-12"
                    textAlign="center"
                    justifyItems="center"
                  >
                    <Box>
                      {rows}
                      <Grid container justifyContent="space-between" key={1}>
                        <Grid mb={1.2}>
                          <Box display="flex">
                            {[49, 50, 51, 52, 53].map((num) => (
                              <SeatButton
                                onClick={(e) => {
                                  holdSeat(num);
                                }}
                                sx={style(
                                  availableSeatNumbers[num - 1]?.status ||
                                    "booked"
                                )}
                                key={num}
                                variant="contained"
                                startIcon={<EventSeat />}
                              >
                                {num}
                              </SeatButton>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>

                      {/* </Box> */}
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Passenger Details */}
            {activeStep === 1 && (
              <Grid>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  Passenger Details
                </Typography>
                <Grid className="row">
                  {passengers.map((p, index) => (
                    <Grid className="col-12 col-md-6 mb-2" key={index}>
                      <Paper
                        sx={{
                          px: 2,
                          py: 1,
                          boxShadow: "15px 15px 15px",
                          borderRadius: "16px",
                        }}
                      >
                        <Row className="mb-1">
                          {/* Left Column: Seat image + label */}
                          <Col sm={3}>
                            <div>
                              <img
                                src="./images/car-seat.png"
                                alt="Seat"
                                width={isMobile ? 30 : 60}
                                height={isMobile ? 30 : 60}
                              />
                              <h5 style={{ margin: 0 }}>Seat {p.seatNumber}</h5>
                            </div>
                          </Col>

                          {/* Right Column: Input fields */}
                          <Col sm={9}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Full Name"
                              margin="normal"
                              required
                              value={p.name ?? ""}
                              onChange={(e) =>
                                handleChange(index, "name", e.target.value)
                              }
                              error={!!errors[index]?.name}
                              helperText={errors[index]?.name}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              label="Phone No"
                              type="text"
                              margin="normal"
                              // inputProps={{ inputMode: 'numeric' }}
                              required
                              value={p.phone ?? ""}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    sx={{ color: "whitesmoke" }}
                                  >
                                    +251
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e) =>
                                handleChange(index, "phone", e.target.value)
                              }
                              error={!!errors[index]?.phone}
                              helperText={errors[index]?.phone}
                            />
                          </Col>
                        </Row>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Booking Summary */}
            {activeStep === 2 && (
              <Grid m={isMobile ? -1 : 2} className="col-12">
                <Typography
                  variant="h6"
                  gutterBottom
                  display="flex"
                  justifyContent="center"
                >
                  Booking Summary
                </Typography>
                <Grid className="row">
                  <center>
                    <Grid
                      className="col-12 col-sm-11 col-md-9 col-lg-7"
                      textAlign="center"
                      alignItems="center"
                    >
                      <Paper
                        sx={{
                          m: { xs: 0.7, sm: 1, md: 3 },
                          px: { xs: 0.5, sm: 1, md: 3 },
                          py: 2,
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: "#1976d2" }}>
                              <DirectionsBusFilled />
                            </Avatar>
                          }
                          title={
                            busTypes?.find(
                              (bus) =>
                                bus?.Id ===
                                listAvailableBus[activeBus]?.busTypeId
                            )?.name
                          }
                          subheader={"Detail Info"}
                          titleTypographyProps={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                          }}
                          subheaderTypographyProps={{
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        />

                        <hr />
                        <Grid className="row" sx={{ mt: 2 }} textAlign="left">
                          {/* Route Info */}
                          <Grid className="col-12">
                            <Box display="flex">
                              <Typography
                                className="col-3"
                                fontSize={{ xs: 16, sm: 18 }}
                                fontWeight="bold"
                                mr={1}
                              >
                                Route:
                              </Typography>
                              <Typography
                                className="col"
                                textAlign="center"
                                fontSize={{ xs: 16, sm: 18 }}
                              >
                                {formik.values.origin.name} To{" "}
                                {formik.values.destination.name}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Departure Time */}
                          <Grid className="col-12">
                            <Box display="flex">
                              <Typography
                                className="col"
                                fontSize={{ xs: 16, sm: 18 }}
                                fontWeight="bold"
                                mr={1}
                              >
                                Departure Time:
                              </Typography>
                              <Typography
                                className="col"
                                fontSize={{ xs: 16, sm: 18 }}
                              >
                                {`${
                                  typeof formik.values.departureTime ===
                                  "number"
                                    ? `${
                                        departureTimes[
                                          parseInt(formik.values.departureTime)
                                        ].split("-")[1]
                                      } (${
                                        departureTimes[
                                          parseInt(formik.values.departureTime)
                                        ].split("-")[0]
                                      }) `
                                    : `${
                                        customerPage
                                          .changeTime({
                                            time: formik.values.departureTime,
                                          })
                                          .split("-")[1]
                                      } (${
                                        customerPage
                                          .changeTime({
                                            time: formik.values.departureTime,
                                          })
                                          .split("-")[0]
                                      })`
                                } `}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Travel Date */}
                          <Grid className="col-12">
                            <Box display="flex">
                              <Typography
                                className="col"
                                fontSize={{ xs: 16, sm: 18 }}
                                fontWeight="bold"
                                mr={1}
                              >
                                Travel Date:
                              </Typography>
                              <Typography
                                className="col"
                                fontSize={{ xs: 16, sm: 18 }}
                              >
                                {customerPage.toEthiopianCalendar({
                                  date: new Date(
                                    calenderECtoGC(formik.values.travelDate)
                                  ),
                                })}{" "}
                                ዓ.ም <br />
                                {new Date(
                                  calenderECtoGC(formik.values.travelDate)
                                ).toDateString()}{" "}
                                A.D
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Leaving Bus */}
                          <Grid className="col-12">
                            <Box display="flex">
                              <Typography
                                className="col"
                                fontSize={{ xs: 16, sm: 18 }}
                                fontWeight="bold"
                                mr={1}
                              >
                                Leaving Bus:
                              </Typography>
                              <Typography
                                className="col"
                                fontSize={{ xs: 16, sm: 18 }}
                              >
                                {leaveBus[listAvailableBus[activeBus]?.bus - 1]}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Passenger Details Section */}
                        {passengers.map((p) => (
                          <Box key={p.seatNumber} mt={2}>
                            <Divider sx={{ my: 2, opacity: 1 }} />
                            <Grid className="row" alignItems="center">
                              {/* Seat icon and number */}
                              <Grid
                                className="col-3 col-sm-2"
                                textAlign="center"
                              >
                                <Box>
                                  <img
                                    src="./images/car-seat.png"
                                    alt="Seat"
                                    width={30}
                                    height={30}
                                    style={{ maxWidth: "100%" }}
                                  />
                                  <Typography fontSize={{ xs: 14, sm: 16 }}>
                                    <strong>No {p.seatNumber}</strong>
                                  </Typography>
                                </Box>
                              </Grid>

                              {/* Passenger info */}
                              <Grid className="col-9 col-sm-10">
                                <Grid className="row">
                                  <Grid className="col-12">
                                    <Box display="flex">
                                      <Typography
                                        fontSize={{ xs: 14, sm: 16 }}
                                        fontWeight="bold"
                                        mr={2}
                                      >
                                        Full Name:
                                      </Typography>
                                      <Typography fontSize={{ xs: 14, sm: 16 }}>
                                        {p.name.toUpperCase()}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid className="col-12">
                                    <Box display="flex">
                                      <Typography
                                        fontSize={{ xs: 14, sm: 16 }}
                                        fontWeight="bold"
                                        mr={2}
                                      >
                                        Phone No:
                                      </Typography>
                                      <Typography fontSize={{ xs: 14, sm: 16 }}>
                                        +251{p.phone}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                        <Divider sx={{ my: 2, opacity: 1 }} />
                        <Grid container className="row" textAlign="left">
                          {/* <Grid className="col-5">
                          Generate QR Code
                        </Grid> */}
                          <Grid className="col-12">
                            {" "}
                            {/* Seats Selected */}
                            <Grid className="col-12">
                              <Box display="flex">
                                <Typography
                                  className="col"
                                  fontSize={{ xs: 16, sm: 18 }}
                                  fontWeight="bold"
                                  mr={1}
                                >
                                  Total Seat:
                                </Typography>
                                <Typography
                                  className="col"
                                  fontSize={{ xs: 14, sm: 16 }}
                                >
                                  <strong>{passengers.length}</strong>
                                </Typography>
                              </Box>
                            </Grid>
                            {/* Unit Price */}
                            <Grid className="col-12">
                              <Box display="flex">
                                <Typography
                                  className="col"
                                  fontSize={{ xs: 16, sm: 18 }}
                                  fontWeight="bold"
                                  mr={1}
                                >
                                  Unit Price:
                                </Typography>
                                <Typography
                                  className="col"
                                  fontSize={{ xs: 14, sm: 16 }}
                                >
                                  <strong>
                                    {Number(
                                      buss.find(
                                        (b) =>
                                          b.Id ===
                                          listAvailableBus[activeBus]?.Id
                                      )?.basePrice
                                    ).toLocaleString()}{" "}
                                    Birr
                                  </strong>
                                </Typography>
                              </Box>
                            </Grid>
                            {/* Total Price */}
                            <Grid className="col-12">
                              <Box display="flex">
                                <Typography
                                  className="col"
                                  fontSize={{ xs: 16, sm: 18 }}
                                  fontWeight="bold"
                                  mr={1}
                                >
                                  Total Price:
                                </Typography>
                                <Typography
                                  className="col"
                                  fontSize={{ xs: 14, sm: 16 }}
                                >
                                  <strong>
                                    {(
                                      passengers.length *
                                      buss.find(
                                        (b) =>
                                          b.Id ===
                                          listAvailableBus[activeBus]?.Id
                                      )?.basePrice
                                    ).toLocaleString()}{" "}
                                    Birr
                                  </strong>
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </center>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Navigation Controls */}
          <Grid className="col-12" mt={3}>
            <Grid className="row" justifyContent="space-between">
              <Button
                variant="contained"
                className="col-6"
                sx={{ width: 120 }}
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  className="col-6"
                  sx={{ width: 120 }}
                  onClick={formik.handleSubmit}
                  //  disabled={bookingConfirmed}
                >
                  Pay Now
                  {/* {bookingConfirmed ? "Booking Confirmed!" : "Confirm Booking"} */}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="col-6"
                  sx={{ width: 120 }}
                  onClick={async () => {
                    if (activeStep === 0) {
                      let seats = availableSeatNumbers.filter(
                        (item) => item.status === "selected"
                      );
                      if (seats.length === 0) return;
                      setPassengers(
                        seats?.map((seat) => {
                          if (userType === 2)
                            return { ...passengers[0], seatNumber: seat.id };
                          return { name: "", phone: "", seatNumber: seat.id };
                        })
                      );
                      setActiveStep((prev) => prev + 1);
                    } else if (activeStep === 1) {
                      try {
                        await passengersSchema.validate(passengers, {
                          abortEarly: false,
                        });
                        setErrors([]);
                        setActiveStep((prev) => prev + 1);
                      } catch (err) {
                        const newErrors = [];
                        passengers.forEach(() => newErrors.push({}));
                        err.inner.forEach((e) => {
                          const index = e.path.match(/\[(\d+)\]/)?.[1];
                          const field = e.path.split(".").pop();
                          if (index !== undefined && field) {
                            newErrors[index][field] = e.message;
                          }
                        });
                        setErrors(newErrors);
                      }
                    }
                  }}
                >
                  Continue
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default CustomerBooking;
