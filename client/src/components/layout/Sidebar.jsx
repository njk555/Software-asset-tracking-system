import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HandymanIcon from "@mui/icons-material/Handyman";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 250;

const menus = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Assets",
    icon: <InventoryIcon />,
    path: "/assets",
  },
  {
    text: "Categories",
    icon: <CategoryIcon />,
    path: "/categories",
  },
  {
    text: "Locations",
    icon: <LocationOnIcon />,
    path: "/locations",
  },
  {
    text: "Departments",
    icon: <ApartmentIcon />,
    path: "/departments",
  },
  {
    text: "Employees",
    icon: <PeopleIcon />,
    path: "/employees",
  },
  {
    text: "Vendors",
    icon: <BusinessIcon />,
    path: "/vendors",
  },
  {
  text: "Purchase Orders",
  icon: <ShoppingCartIcon />,
  path: "/purchase-orders",
},
{
  text: "Purchase Requests",
  icon: <AssignmentIcon />,
  path: "/purchase-requests",
},
{
  text: "Invoices",
  icon: <ReceiptLongIcon />,
  path: "/invoices",
},
{
  text: "AMC Management",
  icon: <HandymanIcon />,
  path: "/amc",
},
{
    text: "Helpdesk",
    icon: <ConfirmationNumberIcon />,
    path: "/helpdesk",
}
];

function Sidebar() {

  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        
  {menus.map((item) => (
    
    <ListItemButton
      key={item.text}
      component={Link}
      to={item.path}
      selected={location.pathname === item.path}
    >
      <ListItemIcon>
        {item.icon}
      </ListItemIcon>

      <ListItemText primary={item.text} />
    </ListItemButton>
    
  ))}
  
</List>

    </Drawer>
  );
}

export default Sidebar;
