'use client'

import { Provider } from "react-redux"
import store from "./Redux/store"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Providers=({children}:{children:React.ReactNode})=>{
    return(
        <Provider store={store}>
            {children}
     <ToastContainer position="top-right" autoClose={3000} />

        </Provider>
    )

}

export default Providers;