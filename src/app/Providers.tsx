'use client'

import { Provider } from "react-redux"
import store from "./Redux/store"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from "@mui/material/Box";
import Sidebar from "./component/sidebar/SideBar";
import { usePathname } from "next/navigation";
const Providers=({children}:{children:React.ReactNode})=>{
  const location=usePathname();
   const hideSidebar=['/login','/signup','/'];
   const showSidebar=!hideSidebar.includes(location);
    return(
        <Provider store={store}>
            <Box sx={{ display: "flex" }}>
             {showSidebar && <Sidebar/>}
          <Box component="main" sx={{zIndex:'1', flexGrow:1,padding:'12px',marginTop:"4.5rem"}}>
            {children}
          </Box>
        </Box>
     <ToastContainer position="top-right" autoClose={3000} />
        </Provider>
    )

}

export default Providers;