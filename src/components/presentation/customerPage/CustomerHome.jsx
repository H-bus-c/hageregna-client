import React from "react";
import { Container, Typography, Grid, Grow } from "@mui/material";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";

const AnimatedPaper = styled(Paper)(({ theme }) => {
  return {
    transition: "all 0.6s ease-in-out",
    "&:hover": {
      boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.9)",
    },
  };
});
const CustomerHome = () => {
  return (
    <div>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: (theme) => theme.palette.common.white,
            textAlign: "center",
            mb: 6,
            fontWeight: 700,
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              background: (theme) => theme.palette.primary.main,
              margin: "20px auto",
              borderRadius: "2px",
            },
          }}
        >
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              icon: "🚌",
              title: "10,000+ Routes",
              text: "Connect to destinations across the country",
            },
            {
              icon: "💺",
              title: "Comfortable Seats",
              text: "Enjoy your journey with premium seating",
            },
            {
              icon: "🛡️",
              title: "Safe Travel",
              text: "Your safety is our top priority",
            },
            {
              icon: "🎫",
              title: "Easy Booking",
              text: "Quick and hassle-free reservation process",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ mb: 5 }}>
              <Grow in timeout={(index + 1) * 300}>
                <AnimatedPaper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    height: "100%",
                    cursor: "pointer",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      mb: 2,
                      transition: "all 0.3s ease",
                      // animation: `${floatAnimation} 4s ease-in-out infinite`,
                    }}
                    className="feature-icon"
                  >
                    {feature.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {feature.text}
                  </Typography>
                </AnimatedPaper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default CustomerHome;
