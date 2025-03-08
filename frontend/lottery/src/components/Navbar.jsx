import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Layers, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white">
              <Layers className="w-6 h-6" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              LOTTO LOTTERY
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {["Dashboard", "Lotteries", "Transactions", "Winners"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side Elements */}
          <div className="flex items-center space-x-4">

            <div className="flex-shrink-0">
              <ConnectButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50 py-3 space-y-2 text-center">
          {["Dashboard", "Lotteries", "Transactions", "Winners"].map((item) => (
            <a
              key={item}
              href="#"
              className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
            >
              {item}
            </a>
          ))}
          <div className="block sm:hidden px-4">
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
