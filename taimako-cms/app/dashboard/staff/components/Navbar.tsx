'use client';

import { useState } from 'react';
import { FiBell, FiUser, FiMenu } from 'react-icons/fi';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FiMenu size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-700">Staff Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-gray-100 relative">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
          <FiUser size={20} />
          <span className="hidden md:inline-block font-medium text-gray-700">John Doe</span>
        </div>
      </div>
    </header>
  );
}
