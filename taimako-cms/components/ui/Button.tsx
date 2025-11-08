'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Button({
  href,
  label,

}: {
  href: string
  label: string

}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold shadow hover:bg-blue-100 transition"
      >
        {label}

      </Link>
    </motion.div>
  )
}
