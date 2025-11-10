'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm flex justify-between items-center px-6 py-3"
    >
      <h2 className="text-lg font-semibold text-gray-800">Welcome to Taimako Clinic</h2>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 hover:text-blue-600">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://ui-avatars.com/api/?name=Taimako+Admin"
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </motion.header>
  );
}
