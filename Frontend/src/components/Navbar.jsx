import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useAuthContext } from '../context/AuthContext';
import logo from '../assets/24-hours.png';

const Navbar = ({ onGetLocation, onCheckDelivery, onLogout }) => {
  const { user } = useAuthContext(); 
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const menus = {
    ROLES_ADMIN: [
      { name: "Add Store", link: "/add" },
      { name: "Home", link: "/" },
    ],
    ROLES_USER: [{ name: "Home", link: "/" }],
  };

  const isUser = user && user.roles.includes('ROLES_USER'); 
  const isEditPage = location.pathname.startsWith('/edit'); // Check if on Edit page
  const isAddPage = location.pathname === '/add'; // Check if on Add page

  return (
    <nav className="navbar my-2 bg-gradient-to-r from-orange-300 via-green-300 to-red-300 p-2 rounded-lg flex justify-between items-center mx-0">
      <div className="flex items-center">
        <img src={logo} alt="24 Hours" className="w-16 h-16 mr-2" />
        <h1 className="text-xl text-indigo-800 font-bold">Store Delivery Zone Checker</h1>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        {/* You can add more menu items here if needed */}
      </div>

      <div className="navbar-end flex items-center">
      <ul className="menu menu-horizontal px-1">
  {isAddPage ? (
    <li>
      <a 
        className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
        href="/"
      >
        Home
      </a>
    </li>
  ) : 
  (

    user &&
    menus[user.roles[0]]
      .filter(menuItem => menuItem.name !== "Home") 
      .map((menuItem) => (
        <li key={menuItem.name}>
          <a className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm" href={menuItem.link}>{menuItem.name}</a>
        </li>
      ))
  )}
</ul>

        {user ? (
          <>
            {isUser && (
              <>
                <button
                  className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
                  onClick={onGetLocation}
                >
                  Get My Location
                </button>
                <button
                  className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
                  onClick={onCheckDelivery}
                >
                  Check Delivery Availability
                </button>
              </>
            )}
            {!isEditPage && !isAddPage && ( // Remove Logout button when on Edit or Add page
              <button
                className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            )}
          </>
        ) : location.pathname === '/login' ? (
          <>
            <button 
              className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
              onClick={() => navigate('/register')} 
            >
              Register
            </button>
            <button 
              className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
              onClick={() => navigate('/')} 
            >
              Home
            </button>
          </>
        ) : location.pathname === '/register' ? (
          <>
            <button 
              className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
              onClick={() => navigate('/login')} 
            >
              Login
            </button>
            <button 
              className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
              onClick={() => navigate('/')} 
            >
              Home
            </button>
          </>
        ) : (
          <>
            <button 
              className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
              onClick={() => navigate('/login')} 
            >
              Login
            </button>
            <button 
              className="btn btn-primary bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:scale-105 transition-transform duration-300 mx-1 text-sm"
              onClick={() => navigate('/register')} 
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
