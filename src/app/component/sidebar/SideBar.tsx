'use client'
import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined';
import AddCards from "../addcards/AddCards";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Redux/cards.Type";
import Loader from "../reusableComponents/Loader";

const drawerWidth = 240;
const DashBordIcon=[
  {label:'Board',icon:<ArticleOutlinedIcon/>},
  {label:'Table',icon:<TableChartOutlinedIcon/>},
  {label:'Calendar',icon:<CalendarMonthOutlinedIcon/>},
  {label:'Timeline',icon:<ViewTimelineOutlinedIcon/>}
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const {loading}=useSelector((state:RootState)=>state.board);
  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (th) => th.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            My Board
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar />
        <Box sx={{ display: "flex", justifyContent: open ? "flex-end" : "center" }}>
          <IconButton onClick={toggleDrawer}>
            {open
              ? theme.direction === "rtl"
                ? <ChevronRightIcon />
                : <ChevronLeftIcon />
              : theme.direction === "rtl"
              ? <ChevronLeftIcon />
              : <ChevronRightIcon />}
          </IconButton>
        </Box>

        <Divider />
        <List>
          {DashBordIcon.map((text, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: open ? "initial" : "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    mr: open ? 3 : "auto",
                  }}
                >
                  {text.icon}
                </ListItemIcon>
                <ListItemText
                  primary={text.label}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <AddCards />
       
      </Box>
    </Box>
  );
}
