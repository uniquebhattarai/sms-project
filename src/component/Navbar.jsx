import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import logo from '../assets/finalLogo.png';
import toast from 'react-hot-toast';

export default function Navbar({setIsLoggedIn}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  function logoutHandler(event){
    event.preventDefault();
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    toast.success('logged out', {
      duration: 3000,
      position: 'top-right',
    });
    navigate('/');
  }

  return (
    <>
      <div className="relative z-50 flex h-14 items-center justify-between border-b border-blue-700 bg-secondary px-4 text-white">
  
  {/* Left side: Hamburger + Logo */}
  <div className="flex items-center gap-4">
    <button onClick={toggleMenu} className="p-2 focus:outline-none hover:cursor-pointer">
      <RxHamburgerMenu className="w-6 h-6" />
    </button>
    <Link to="/Dashboard">
      <img src={logo} width={60} height={20} loading="lazy" alt="logo" />
    </Link>
  </div>

  {/* Right side: Logout Button */}
  <div className="flex items-center">
    <button onClick={logoutHandler} className="rounded px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-800 hover:cursor-pointer">
      Logout
    </button>
  </div>
</div>


      {/* Side Mini Drawer (like YouTube) */}
      {isMenuOpen && (
        <div className="fixed left-0 top-14 z-40 w-44 rounded-sm bg-secondary text-white shadow-md border-r border-blue-700">
          <ul className="flex flex-col text-sm">
            <li className="hover:bg-blue-900 px-4 py-2 transition-all duration-200">
              <Link to="/attendance">Attendance</Link>
            </li>
            <li className="hover:bg-blue-900 px-4 py-2 transition-all duration-200">
              <Link to="/assignment">Assignment</Link>
            </li>
            <li className="hover:bg-blue-900 px-4 py-2 transition-all duration-200">
              <Link to="/assignment">option 3</Link>
            </li>
            <li className="hover:bg-blue-900 px-4 py-2 transition-all duration-200">
              <Link to="/assignment">option 4</Link>
            </li>
            <li className="hover:bg-blue-900 px-4 py-2 transition-all duration-200">
              <Link to="/assignment">option 5</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
