import React, { useState } from "react";
import { TextField, Button, Typography, IconButton } from "@mui/material";
import { Email, Lock, ArrowBack, Facebook, Google } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../Header";
import Alerts from "./presentation/alert/Alerts";
import axios from "axios";

// Styled Components
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
`;

const AuthCard = styled.div`
  background: rgba(0, 0, 0, 1);
  padding: 2rem;
  border-radius: 20px;
  margin-left:5px;
  margin-right:5px;
  width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  margin-top: -30px;
`;

const FloatingIcon = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginForm = ({ switchView, setOpen, setMessage, setType }) => {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .required("Required")
        .min(4, "Password must be at least 4 characters")
        .max(16, "Password must be less than or equal to 16 characters"),
    }),
    onSubmit: async (values) => {
      try {
        const login = await axios.post("https://hageregna-server.onrender.com/login", values);
        if (login.data.Login) {
          setMessage(login.data.message);
          setType("success");
          setOpen(true);
          window.localStorage.setItem("token", login.data.token);
          setTimeout(() => {
            return window.location.replace(login.data.path);
          }, 1000);
        } else {
          setMessage(login.data.error);
          setType("error");
          setOpen(true);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <FloatingIcon>
        <Lock sx={{ fontSize: 60, color: "white" }} />
      </FloatingIcon>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          size="small"
          type="email"
          variant="outlined"
          label={<span style={{ fontSize: 24, color: "white" }}>Email</span>}
          name="email"
          InputProps={{
            startAdornment: <Email sx={{ color: "white", mr: 1 }} />,
          }}
          sx={{
            mb: 2,

            background: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": {
                borderColor: "rgba(207, 49, 255, 0.9)",
              },
            },
          }}
          {...formik.getFieldProps("email")}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          fullWidth
          variant="outlined"
          label={<span style={{ fontSize: 24, color: "white" }}>Password</span>}
          size="small"
          type="password"
          name="password"
          InputProps={{
            startAdornment: <Lock sx={{ color: "white", mr: 1 }} />,
          }}
          sx={{
            mb: 2,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": {
                borderColor: "rgba(207, 49, 255, 0.9)",
              },
            },
          }}
          {...formik.getFieldProps("password")}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: 2,
            py: 1.5,
            background:
              "linear-gradient(45deg,rgb(3, 11, 124) 30%, #21CBF3 90%)",
            fontSize: "1.1rem",
          }}
        >
          Login
        </Button>
      </form>

      <Typography
        sx={{
          textAlign: "center",
          mt: 2,
          color: "white",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={() => switchView("forgot")}
      >
        Forgot Password?
      </Typography>
    </>
  );
};

const ForgotPasswordForm = ({ switchView, setOpen, setMessage, setType }) => {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Password reset requested for:", values.email);
      switchView("login");
    },
  });

  return (
    <>
      <IconButton sx={{ color: "white" }} onClick={() => switchView("login")}>
        <ArrowBack />
      </IconButton>

      <FloatingIcon>
        <Email sx={{ fontSize: 40, color: "white" }} />
      </FloatingIcon>

      <Typography
        variant="h5"
        sx={{ textAlign: "center", mb: 2, color: "white" }}
      >
        Reset Your Password
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          size="small"
          type="email"
          variant="outlined"
          label={<span style={{ fontSize: 24, color: "white" }}>Email</span>}
          name="email"
          InputProps={{
            startAdornment: <Email sx={{ color: "white", mr: 1 }} />,
          }}
          sx={{
            mb: 2,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": {
                borderColor: "rgba(207, 49, 255, 0.9)",
              },
            },
          }}
          {...formik.getFieldProps("email")}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: 2,
            py: 1.5,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            fontSize: "1.1rem",
          }}
        >
          Reset Password
        </Button>
      </form>
    </>
  );
};

const LogIn = () => {
  const [currentView, setCurrentView] = useState("login");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState();
  return (
    <div>
      <Header />
      <div
        style={{
          overflowX: "hidden",
          backgroundImage: "url(/images/bus4.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Alerts open={open} setOpen={setOpen} message={message} type={type} />
        <AuthContainer>
          <AuthCard>
            {currentView === "login" ? (
              <LoginForm
                switchView={setCurrentView}
                setOpen={setOpen}
                setMessage={setMessage}
                setType={setType}
              />
            ) : (
              <ForgotPasswordForm
                switchView={setCurrentView}
                setOpen={setOpen}
                setMessage={setMessage}
                setType={setType}
              />
            )}
          </AuthCard>
        </AuthContainer>
      </div>
    </div>
  );
};

export default LogIn;
