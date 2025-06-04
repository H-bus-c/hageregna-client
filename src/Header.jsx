import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Slide,
  useScrollTrigger,
  useMediaQuery,
  Typography,
  Button,
  Box,Collapse
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Close,
  ArrowBackOutlined,
  ArrowDropDown,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { fetchBusType } from "./services/API";
import { styled, keyframes, createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const AnimatedAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(
    45deg,
    ${theme.palette.primary.main},
    ${theme.palette.secondary.main},
    ${theme.palette.success.main}
  )`,
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 12s ease infinite`,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255,255,255,0.05)",
}));

const NavButton = styled(Button)(({ theme, active, isMobile }) => ({
  color: active ? "aqua" : theme.palette.common.white,
  fontSize: "1rem",
  fontWeight: active ? 600 : 500,
  position: "relative",
  marginLeft: "-15px",
  marginRight: "-15px",
  "&:hover": {
    "&::after": {
      color: theme.palette.common.white,
      width: "100%",
      bottom: 0,
      height: "2px",
      background: active
      ? `aqua`
      : isMobile
      ? "transparent"
      : theme.palette.common.white,
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: active ? isMobile?"255px":"100%" : 0,
    height: "2px",
    background: active
      ? `aqua`
      : isMobile
      ? "transparent"
      : theme.palette.common.white,
    transition: "width 0.4s ease",
  },
}));

const Logo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  animation: `${float} 5s ease-in-out infinite`,
  "& span": {
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "1px",
  },
}));

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [busTypes, setBusTypes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElReport, setAnchorElReport] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [openCitySubmenu, setOpenCitySubmenu] = useState(false);
  const [openReportSubmenu, setOpenReportSubmenu] = useState(false);
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isUnderMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    const data = localStorage?.getItem("sharedData");
    if (data) localStorage.removeItem("sharedData");
    setProfileAnchorEl(null);
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuReportOpen = (event) => {
    setAnchorElReport(event.currentTarget);
  };

  const handleMenuReportClose = () => {
    setAnchorElReport(null);
  };
  const checkUserData = localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token"))
    : null;

  useEffect(() => {
    const fetchData = async () => {
      const [busType] = await Promise.all([fetchBusType()]);
      setBusTypes(busType);
    };
    fetchData();
  }, []);

  const navHomeItems = [
    { label: "Home", href: "/" },
    { label: "My Booking", href: "/booking" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const navLoginItems = [
    { label: "Routes", href: "/route", role: "23" },
    { label: "Departure Time", href: "/bus_departure_time", role: "23" },
    { label: "Booking Schedule", href: "/", role: "45" },
    { label: "Booking List", href: "/report/booking_list", role: "4" },
    { label: "Passenger Booking", href: "/booking", role: "4" },
    { label: "Passenger List", href: "/passenger_check_list", role: "5" },
    { label: "City", href: "/city/1", role: "23" },
    { label: "Bus", href: "/bus", role: "23" },
    { label: "Bus Type", href: "/bus_type", role: "1" },
    { label: "User", href: "/user", role: "123" },
    { label: "Report", href: "/report", role: "23" },
  ];
  return (
    <HideOnScroll>
      <AnimatedAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {isMobile && mobileMenuOpen && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  background: `linear-gradient( 45deg,${theme.palette.primary.main},${theme.palette.secondary.main},${theme.palette.success.main})`,
                  boxShadow: 3,
                  borderRadius: 1,
                  marginLeft: "-25px",
                  paddingRight: "20px",
                  height: "100vh",
                  width: "250px",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1300,
                  color: "white",
                }}
              >
                {checkUserData
                  ? navLoginItems.map((item) => {
                      if (!item.role.includes(`${checkUserData.roleId}`))
                        return null;

                      if (item.label === "City") {
                        return (
                          <>
                            {" "}
                            <Box key="city" textAlign="center">
                              <NavButton
                                onClick={() =>
                                  setOpenCitySubmenu(!openCitySubmenu)
                                }
                                active={
                                  location.pathname === item.href ||
                                  location.pathname === "/city/2" ||
                                  location.pathname === "/city/3"
                                    ? 1
                                    : 0
                                }
                                isMobile={true}
                                endIcon={<ArrowDropDown />}
                              >
                                City
                              </NavButton>
                              <Collapse in={openCitySubmenu}>
                                <Box sx={{ pl: 2 }}>
                                  <NavButton
                                    fullWidth
                                    onClick={() => {
                                      navigate("/city/1");
                                      setMobileMenuOpen(false);
                                      setOpenCitySubmenu(false);
                                    }}
                                    
                                  >
                                    City
                                  </NavButton>
                                  <NavButton
                                    fullWidth
                                    onClick={() => {
                                      navigate("/city/2");
                                      setMobileMenuOpen(false);
                                      setOpenCitySubmenu(false);
                                    }}
                                   
                                  >
                                    Zone
                                  </NavButton>
                                  <NavButton
                                    fullWidth
                                    onClick={() => {
                                      navigate("/city/3");
                                      setMobileMenuOpen(false);
                                      setOpenCitySubmenu(false);
                                    }}
                                  
                                  >
                                    Region
                                  </NavButton>
                                </Box>
                              </Collapse>
                            </Box>
                            {!(
                              location.pathname === item.href ||
                              location.pathname === "/city/2" ||
                              location.pathname === "/city/3"
                            ) && (
                              <div
                                style={{
                                  border: "solid 1px white",
                                  marginRight: "-15px",
                                }}
                              ></div>
                            )}
                          </>
                        );
                      }

                      if (item.label === "Report") {
                        return (
                          <>
                            {" "}
                            <Box key="report" textAlign="center">
                              <NavButton
                                onClick={() =>
                                  setOpenReportSubmenu(!openReportSubmenu)
                                }
                                active={
                                  location.pathname ==="/report/passenger_list" ||
                                  location.pathname === "/report/booking_list"
                                    ? 1
                                    : 0
                                }
                                isMobile={true}
                                endIcon={<ArrowDropDown />}
                              >
                                Report
                              </NavButton>
                              <Collapse in={openReportSubmenu}>
                                <Box sx={{ pl: 2 }}>
                                  <NavButton
                                    fullWidth
                                    onClick={() => {
                                      navigate("/report/passenger_list");
                                      setMobileMenuOpen(false);
                                      setOpenReportSubmenu(false);
                                    }}
                                  >
                                    Passenger List
                                  </NavButton>
                                  <NavButton
                                    fullWidth
                                    onClick={() => {
                                      navigate("/report/booking_list");
                                      setMobileMenuOpen(false);
                                      setOpenReportSubmenu(false);
                                    }}
                                  >
                                    Booking Data
                                  </NavButton>
                                </Box>
                              </Collapse>
                            </Box>
                            {!(
                              location.pathname === "/report/passenger_list" ||
                              location.pathname === "/report/booking_list"
                            ) && (
                              <div
                                style={{
                                  border: "solid 1px white",
                                  marginRight: "-15px",
                                }}
                              ></div>
                            )}
                          </>
                        );
                      }

                      return (
                        <>
                          <NavButton
                            key={item.label}
                            onClick={() => {
                              navigate(item.href);
                              setMobileMenuOpen(false);
                            }}
                            active={location.pathname === item.href ? 1 : 0}
                            isMobile={true}
                          >
                            {item.label}
                          </NavButton>{" "}
                          {!(location.pathname === item.href) && (
                            <div style={{ border: "solid 1px white",marginRight:"-15px" }}></div>
                          )}
                        </>
                      );
                    })
                  : navHomeItems.map((item) => (
                      <>
                        {" "}
                        <NavButton
                          key={item.label}
                          onClick={() => {
                            navigate(item.href);
                            setMobileMenuOpen(false);
                          }}
                          active={location.pathname === item.href ? 1 : 0}
                          isMobile={true}
                        >
                          {item.label}
                        </NavButton>
                        {!(location.pathname === item.href) && <div style={{border: "solid 1px white",marginRight:"-15px"}}></div>}
                      </>
                    ))}
              </Box>
            )}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <Close /> : <MenuIcon />}
              </IconButton>
            )}
            <Logo>
              <img
                src="/images/bus2.svg"
                alt="Bus"
                style={{ width: "80px", height: "auto", marginLeft: "-10px" }}
              />
              {(!checkUserData || isMobile || !isTablet) && (
                <Typography variant={isUnderMobile ? "h6" : "h5"}>
                  {checkUserData
                    ? checkUserData.roleId === 1
                      ? "Hageregna Bus"
                      : busTypes.find((b) => b.userId === checkUserData.admin)?.name
                    : "Hageregna Bus"}
                </Typography>
              )}
            </Logo>

            {!isMobile && (
              <Box sx={{ display: "flex", gap: "2rem" }}>
                {!checkUserData
                  ? navHomeItems.map((item) => (
                      <NavButton
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        active={location.pathname === item.href ? 1 : 0}
                      >
                        {item.label}
                      </NavButton>
                    ))
                  : navLoginItems.map((item) => {
                      if (!item.role.includes(`${checkUserData.roleId}`))
                        return null;

                      if (item.label === "City") {
                        return (
                          <Box key={item.label}>
                            <NavButton
                              active={
                                location.pathname.startsWith("/city") ? 1 : 0
                              }
                              aria-controls="city-menu"
                              aria-haspopup="true"
                              onClick={handleMenuOpen}
                            >
                              {item.label}
                              {item.label === "City" ? <ArrowDropDown /> : ""}
                            </NavButton>
                            <Menu
                              id="city-menu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <MenuItem
                                onClick={() => {
                                  navigate("/city/1");
                                  handleMenuClose();
                                }}
                              >
                                City
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  navigate("/city/2");
                                  handleMenuClose();
                                }}
                              >
                                Zone
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  navigate("/city/3");
                                  handleMenuClose();
                                }}
                              >
                                Region
                              </MenuItem>
                            </Menu>
                          </Box>
                        );
                      }
                      if (item.label === "Report") {
                        return (
                          <Box key={item.label}>
                            <NavButton
                              active={
                                location.pathname.startsWith("/report") ? 1 : 0
                              }
                              aria-controls="report-menu"
                              aria-haspopup="true"
                              onClick={handleMenuReportOpen}
                            >
                              {item.label}
                              {item.label === "Report" ? <ArrowDropDown /> : ""}
                            </NavButton>
                            <Menu
                              id="report-menu"
                              anchorEl={anchorElReport}
                              open={Boolean(anchorElReport)}
                              onClose={handleMenuReportClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <MenuItem
                                onClick={() => {
                                  navigate("/report/passenger_list");
                                  handleMenuClose();
                                }}
                              >
                                Passenger List
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  navigate("/report/booking_list");
                                  handleMenuClose();
                                }}
                              >
                                Booking Data
                              </MenuItem>
                            </Menu>
                          </Box>
                        );
                      }

                      return (
                        <NavButton
                          key={item.label}
                          onClick={() => navigate(item.href)}
                          active={location.pathname === item.href ? 1 : 0}
                        >
                          {item.label}
                        </NavButton>
                      );
                    })}
              </Box>
            )}

            {checkUserData ? (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 2 }}
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  open={isProfileMenuOpen}
                  onClose={handleProfileMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleProfileMenuClose();
                    }}
                  >
                    Profile
                  </MenuItem>
                  {/* <MenuItem
                    onClick={() => {
                      navigate("/settings");
                      handleProfileMenuClose();
                    }}
                  >
                    Settings
                  </MenuItem> */}
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 2 }}
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  open={isProfileMenuOpen}
                  onClose={handleProfileMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={() => {
                      //navigate("/login");
                      handleProfileMenuClose();
                    }}
                  >
                    Register
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/login");
                      handleProfileMenuClose();
                    }}
                  >
                    Login
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </Container>
      </AnimatedAppBar>
    </HideOnScroll>
  );
};

export default Header;


