import { Outlet } from "react-router-dom";
import {AuthProvider} from "../context/AuthContext"

const Layout = () => {
  return (
    <div>
      
      <AuthProvider>
      <div className="h-screen">
        <Outlet />
      </div>
    </AuthProvider>
    </div>
    
  );
};
export default Layout;