import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NotebookPen, User, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors duration-200 ${
      isActive
        ? "text-purple-600 bg-purple-50"
        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <NotebookPen className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                NoteFlow
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/notes" className={navLinkClass}>
                  Notes
                </NavLink>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 focus:outline-none"
                >
                  {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 py-2">
                    <p className="px-4 py-2 text-sm text-gray-600 border-b">
                      Hello, {user?.username || user?.email}
                    </p>
                    <NavLink
                      to="/notes"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <NotebookPen size={16} /> Notes
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors duration-200"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors duration-200 ${
                      isActive
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`
                  }
                >
                  <LogIn size={16} />
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`
                  }
                >
                  <UserPlus size={16} />
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-purple-600 p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>

              {isAuthenticated && (
                <NavLink
                  to="/notes"
                  className={navLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notes
                </NavLink>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={16} /> Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="bg-purple-600 hover:bg-purple-700 text-white w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus size={16} /> Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;