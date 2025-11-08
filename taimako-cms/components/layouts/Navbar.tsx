'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-md fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Taimako<span className="text-gray-800">Clinic</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 px-4">
          <Link href="/" className="text-black hover:text-blue-600">Home</Link>
          <Link href="/services" className="text-black hover:text-blue-600">Services</Link>
          <Link href="/about" className="text-black hover:text-blue-600">About</Link>
          <Link href="/contact" className="text-black hover:text-blue-600">Contact</Link>

          {/* Book Appointment */}
          <Link
            href="/appointments/new"
            className="bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition"
          >
            Book Appointment
          </Link>

          {/* Portal Access */}
          <Link
            href="/auth/login"
            className="border border-blue-700 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition"
          >
            Staff Portal
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden bg-white px-6 py-4 space-y-3"
        >
          <Link href="/" className="block hover:text-blue-600">Home</Link>
          <Link href="/services" className="block hover:text-blue-600">Services</Link>
          <Link href="/about" className="block hover:text-blue-600">About</Link>
          <Link href="/contact" className="block hover:text-blue-600">Contact</Link>
          <Link
            href="/appointments/new"
            className="block bg-blue-700 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Book Appointment
          </Link>
          <Link
            href="/auth/login"
            className="block border border-blue-700 text-blue-700 text-center px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition"
          >
            Staff Portal
          </Link>
        </motion.div>
      )}
    </motion.nav>
  )
}
