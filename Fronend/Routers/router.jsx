import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../src/App";
import Login from "../Page/Login";
import Register from "../Page/Register";
import AddStore from "../Page/Add";
import Edit from "../Page/Edit";
const router = createBrowserRouter(
    [{
        path:"/",
        element:<Layout/>,
        children:[{
            path:"/",
            element:<App/>,
        },
        {
        path:"/login",
        element:<Login/>
        },
        {path:"/register",
        element:<Register/>
        },
        {path:"/Add",
            element:<AddStore/> 
        },
        {path:"/Edit/:id",
            element:<Edit/> 
        }
    ]
    }]
);
export default router