import {
  DeleteForeverOutlined,
  DirectionsBusFilled,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@mui/system";
import React, { useRef, useState } from "react";
import AlertCondition from "../alert/AlertCondition";
import VerifyCodeModal from "../alert/VerifyCodeModal";
import { useReactToPrint } from "react-to-print";

const MyBooking = ({
  formik,
  results,
  handleCancelBooking,
  handleEditBooking,
  handleSendData,
  isUnderMobile,
  loginUser,
  qrCodeUrl,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [openVerify, setOpenVerify] = useState(false);
  const [clickFunction, setClickFunction] = useState(0);
  const [openPrint, setOpenPrint] = useState(false);
  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({
    contentRef: contentRef, // Pass the ref to the hook
  });

  const handleClick = () => {
    setOpen(false);
    setMessage("");
    setColor("");
    setTitle("");
    if (clickFunction === 1) {
      handleEditBooking(`+251${results?.customerPhone}`);
      setOpenVerify(true);
    } else if (clickFunction === 2) {
      handleCancelBooking(results.Id);
    }
    setClickFunction(0);
  };
  const handlePrint = () => {
    setOpenPrint(true);
    if (openPrint) {
      reactToPrint();
    }
  };
  const subHeader = () => {
    return (
      <div>
        <h5>Name : {results.customerName}</h5>
        <h6>Phone No : +251{results.customerPhone}</h6>
      </div>
    );
  };
  return (
    <Container maxWidth="lg">
      <AlertCondition
        open={open}
        setOpen={setOpen}
        message={message}
        title={title}
        handleClick={handleClick}
        color={color}
      />
      <VerifyCodeModal
        open={openVerify}
        setOpen={setOpenVerify}
        phone={`+251${results?.customerPhone}`}
        onResend={handleEditBooking}
        handleSendData={handleSendData}
      />
      <Paper
        sx={{
          minWidth: { xs: 320 },
          mx: { xs: -1.5 },
          px: { xs: 0.8, sm: 2 },
          my: 1,
          py: 1.5,
          background: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          🎟️ Search Your Booking
        </Typography>
        <br />
        <Grid
          container
          className="row"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid className="col-8 col-sm-7 col-md-4 mb-2">
            <TextField
              fullWidth
              size="small"
              label="Ticket Number"
              type="text"
              variant="outlined"
              value={formik.values.ticketNumber}
              name="ticketNumber"
              onChange={(e) => {
                return formik.setFieldValue("ticketNumber", e.target.value);
              }}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(0,0,0,0.5)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(207, 49, 255, 0.9)",
                  },
                },
              }}
              error={
                formik.touched.ticketNumber &&
                Boolean(formik.errors.ticketNumber)
              }
              helperText={
                formik.touched.ticketNumber && formik.errors.ticketNumber
              }
            />
          </Grid>
          <Grid className="col-8 col-sm-7 col-md-4 mb-2">
            <TextField
              fullWidth
              size="small"
              label="Phone Number"
              type="text"
              variant="outlined"
              value={formik.values.phoneNumber}
              name="phoneNumber"
              onChange={(e) => {
                return formik.setFieldValue("phoneNumber", e.target.value);
              }}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(0,0,0,0.5)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(207, 49, 255, 0.9)",
                  },
                },
              }}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
          </Grid>
          <Grid className="col-8 col-sm-7 col-md-4">
            <Button
              fullWidth
              variant="contained"
              size="medium"
              type="submit"
              // disabled={isLoading}
              onClick={formik.handleSubmit}
              sx={{
                width: { sm: "100%", xs: "100%" },

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
        {results ? (
          <Box display="flex" justifyContent="center">
            <Card
              sx={{
                borderRadius: 4,
                mb: 3,
              }}
            >
              <div ref={contentRef} style={{ width: 350 }}>
                {" "}
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                      <DirectionsBusFilled />
                    </Avatar>
                  }
                  title={results.bus}
                  subheader={subHeader()}
                  titleTypographyProps={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "1.2rem",
                  }}
                  subheaderTypographyProps={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "1.1rem",
                  }}
                />
                <Divider sx={{ opacity: 1, my: 0.1 }} />
                <CardContent sx={{ textAlign: "left" }}>
                  <Grid container className="row">
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Departure Place:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.departurePlace}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Arrival Place:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.arrivalPlace}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Departure Time:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.departureTime[1]} ({results.departureTime[0]}
                          )
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Arrival Time:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.arrivalTime[1]} ({results.arrivalTime[0]})
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Travel Date:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.travelDateEC}
                          <br />
                          {new Date(results.travelDateGC).toDateString()} A.D
                        </Typography>
                      </Box>
                    </Grid>{" "}
                  </Grid>
                  <div
                    style={{ border: "solid 0.2px black", margin: "5px 0" }}
                  ></div>
                  <Grid container className="row">
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Ticket No:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.ticketNumber
                            .match(new RegExp(".{1," + 4 + "}", "g"))
                            .join("−")}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Leaving Bus:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.leaving}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Seat No:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {results.seatNumber}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid className="col-12">
                      <Box display="flex">
                        <Typography
                          className="col"
                          variant="body1"
                          color="textPrimary"
                        >
                          <strong>Price:</strong>
                        </Typography>
                        <Typography
                          className="col-7"
                          variant="body1"
                          color="textPrimary"
                        >
                          {Number(results.price).toLocaleString()} Birr
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <div
                    style={{ border: "solid 0.2px black", margin: "5px 0" }}
                  ></div>
                  <Grid container className="row">
                    <Grid className="col-8">
                      <Typography variant="body1" color="textPrimary">
                        <strong>Booking Date:</strong>
                      </Typography>
                      <Typography variant="body1" color="textPrimary">
                        {results.date[0]}
                        <br />
                        {results.date[1]}
                      </Typography>
                    </Grid>
                    <Grid className="col-4">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        style={{
                          width: "100%",
                          height: "auto",
                          marginBottom: "-35px",
                          marginLeft: "-30px",
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </div>
              <hr />
              <Grid className="col-12" sx={{ marginLeft: "-20px", mb: 2 }}>
                <Grid container className="row">
                  <Grid className="col-7">
                    {results.isCancel ? (
                      <Button
                        onClick={() => {
                          setClickFunction(1);
                          setColor("warning");
                          setOpen(true);
                          setMessage(
                            "Editing your booking will cancel the current seat and attempt to book the new one. Do you want to continue?"
                          );
                          setTitle("Editing Your Booking");
                        }}
                      >
                        <Chip
                          icon={
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              fontSize={20}
                            />
                          }
                          //avatar={}
                          label={
                            results.status === 1
                              ? "Edit Booking"
                              : "Edit Booking"
                          }
                          color={results.status === 1 ? "warning" : "warning"}
                          sx={{ fontWeight: "bold" }}
                        />
                      </Button>
                    ) : (
                      <Typography variant="body1" color="warning">
                        This ticket can't <br /> cancel or edit
                      </Typography>
                    )}
                  </Grid>
                  <Grid className="col-5">
                    <Button onClick={handlePrint}>
                      <Chip
                        icon={<FontAwesomeIcon icon={faPrint} fontSize={20} />}
                        //avatar={}
                        label={"Print"}
                        color={"primary"}
                        sx={{
                          ml: 4,
                          fontWeight: "bold",
                          "&:hover": {
                            border: "solid 1px black",
                            background: "white",
                            color: "black",
                          },
                        }}
                      />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container className="row">
                  {loginUser && (
                    <Grid className="col-8">
                      {results.isCancel && (
                        <Button
                          onClick={() => {
                            setClickFunction(2);
                            setColor("error");
                            setOpen(true);
                            setMessage(
                              "Are you sure you want to cancel your booking? This action cannot be undone and the seat will be released to others.And You must go to bus ticket office to receive the money."
                            );
                            setTitle("Cancel Your Booking");
                          }}
                        >
                          <Chip
                            icon={
                              <DeleteForeverOutlined sx={{ fontSize: 28 }} />
                            }
                            label={
                              results.status === 1
                                ? "Cancel Booking"
                                : "Cancel Booking"
                            }
                            color={results.status === 1 ? "error" : "error"}
                            sx={{ fontWeight: "bold" }}
                          />
                        </Button>
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Box>
        ) : (
          <Box>
            <h3>Not found</h3>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default MyBooking;
