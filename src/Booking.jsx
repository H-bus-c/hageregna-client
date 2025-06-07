import React, { useState } from "react";
import {
  Container,
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
  Badge,
} from "@mui/material";
import {
  EventSeat,
  Person,
  DirectionsBus,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import { styled } from "@mui/system";

const SeatButton = styled(Button)(({ theme, status }) => ({
  minWidth: "60px",
  margin: theme.spacing(0.5),
  backgroundColor:
    status === "booked"
      ? theme.palette.error
      : status === "selected"
      ? theme.palette.success
      : theme.palette.primary,
  color: "white",
  "&:hover": {
    backgroundColor:
      status === "booked"
        ? theme.palette.error
        : status === "selected"
        ? theme.palette.success
        : theme.palette.primary,
  },
}));

const Booking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({});
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Sample bus data
  const busDetails = {
    busNumber: "TN 01 AB 1234",
    origin: "Chennai",
    destination: "Bangalore",
    departure: "2023-08-15 08:00",
    arrival: "2023-08-15 14:00",
    price: 1200,
    seats: Array(24)
      .fill()
      .map((_, i) => ({
        number: i + 1,
        status: Math.random() < 0.3 ? "booked" : "available",
      })),
  };

  const handleSeatSelect = (seat) => {
    if (seat.status === "available") {
      const isSelected = selectedSeats.includes(seat.number);
      setSelectedSeats((prev) =>
        isSelected
          ? prev.filter((s) => s !== seat.number)
          : [...prev, seat.number]
      );
    }
  };

  const handlePassengerDetails = (seatNumber, field, value) => {
    setPassengerDetails((prev) => ({
      ...prev,
      [seatNumber]: { ...prev[seatNumber], [field]: value },
    }));
  };

  const handleBooking = () => {
    // Add your booking API call here
    setBookingConfirmed(true);
  };

  const steps = ["Select Seats", "Passenger Details", "Confirm Booking"];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container className="row">
          {/* Header Section */}
          <Grid className="col-12">
            <Button startIcon={<ArrowBack />} href="/search">
              Back to Search
            </Button>
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
              <DirectionsBus sx={{ verticalAlign: "middle", mr: 1 }} />
              {busDetails.origin} to {busDetails.destination}
            </Typography>
            <Divider />
          </Grid>

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

          {/* Seat Map Section */}
          {activeStep === 0 && (
            <Grid className="col-12">
              <Typography variant="h6" gutterBottom>
                Select Seats ({selectedSeats.length} selected)
              </Typography>
              <Grid container className="row">
                {busDetails.seats.map((seat) => (
                  <Grid key={seat.number}>
                    <SeatButton
                      variant="contained"
                      status={
                        selectedSeats.includes(seat.number)
                          ? "selected"
                          : seat.status
                      }
                      onClick={() => handleSeatSelect(seat)}
                      startIcon={<EventSeat />}
                    >
                      {seat.number}
                    </SeatButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Passenger Details */}
          {activeStep === 1 && (
            <Grid className="col-12">
              <Typography variant="h6" gutterBottom>
                Passenger Details
              </Typography>
              <Grid container className="row">
                {selectedSeats.map((seat) => (
                  <Grid className="col-12 col-sm-6" key={seat}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <EventSeat sx={{ mr: 1 }} /> Seat {seat}
                      </Typography>
                      <TextField
                        fullWidth
                        label="Full Name"
                        margin="normal"
                        required
                        onChange={(e) =>
                          handlePassengerDetails(seat, "name", e.target.value)
                        }
                      />
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        margin="normal"
                        required
                        onChange={(e) =>
                          handlePassengerDetails(seat, "age", e.target.value)
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Booking Summary */}
          {activeStep === 2 && (
            <Grid className="col-12">
              <Typography variant="h6" gutterBottom>
                Booking Summary
              </Typography>
              <Grid container className="">
                <Grid className="col-12 col-md-6" >
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Journey Details
                    </Typography>
                    <Divider />
                    <Typography sx={{ mt: 2 }}>
                      <strong>Route:</strong> {busDetails.origin} to{" "}
                      {busDetails.destination}
                    </Typography>
                    <Typography>
                      <strong>Departure:</strong> {busDetails.departure}
                    </Typography>
                    <Typography>
                      <strong>Arrival:</strong> {busDetails.arrival}
                    </Typography>
                    <Typography>
                      <strong>Bus:</strong> {busDetails.busNumber}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid className="col-12 col-md-6">
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Fare Details
                    </Typography>
                    <Divider />
                    <Grid container sx={{ mt: 2 }} className="row">
                      <Grid className="col-6">
                        <Typography>Seats Selected:</Typography>
                        <Typography>Total Price:</Typography>
                      </Grid>
                      <Grid className="col-6" textAlign="right">
                        <Typography>{selectedSeats.length}</Typography>
                        <Typography>
                          ₹{selectedSeats.length * busDetails.price}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Navigation Controls */}
          <Grid className="col-12" sx={{ mt: 3 }}>
            <Grid container justifyContent="space-between">
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={handleBooking}
                  disabled={bookingConfirmed}
                >
                  {bookingConfirmed ? "Booking Confirmed!" : "Confirm Booking"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  disabled={selectedSeats.length === 0}
                >
                  Continue
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Booking;
