import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Fab, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useLocalStorage } from "usehooks-ts";
import "./HeaderNav.css";

interface menu {
  id: number;
  linkName: string;
  link: string;
}

const pages = [
  { id: 0, linkName: "Home", link: "/s/dashboard" },
  { id: 1, linkName: "Profile", link: "/s/profile" },
  { id: 2, linkName: "History", link: "/s/history" },
];
// give each setting appropriate links to refer to here
const settings = [{ id: 0, linkName: "Logout", link: "/login" }];

const theme = createTheme({
  palette: {
    secondary: {
      main: "#d27619",
    },
  },
});

export const HeaderNav = () => {
  //@ts-ignore
  const [session, setSession] = useLocalStorage("session", true);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  {
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // navigate function
  const handleUserClick = (menu: menu) => {
    if (menu.linkName === "Logout") {
      setSession(false);
    }
    navigate(menu.link);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters className="navbar">
            <Fab
              variant="extended"
              color="secondary"
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              onClick={() => navigate("/s/lobby")}
            >
              <SportsEsportsIcon
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                // href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Lobby
              </Typography>
            </Fab>

            {/* content to show when screen size is xs */}
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{
                  "& .MuiBox-root": {
                    flexGrow: 0,
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.id} onClick={() => handleUserClick(page)}>
                    <Typography textAlign="center">{page.linkName}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Fab
              variant="extended"
              color="secondary"
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              onClick={() => navigate("/s/lobby")}
            >
              <SportsEsportsIcon
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                // href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Lobby
              </Typography>
            </Fab>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.id}
                  onClick={() => handleUserClick(page)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  <Typography>{page.linkName}</Typography>
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.id}
                    onClick={() => handleUserClick(setting)} // use bind to pass args to event handlers from component
                  >
                    {/* How to give the correct links?  */}
                    <Typography textAlign="center">
                      {setting.linkName}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};
