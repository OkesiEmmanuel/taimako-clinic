'use client'

import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function HeroSection() {
  return (
    <section className="bg-blue-600 text-white min-h-[90vh] flex items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Compassionate Care, Trusted Expertise
        </h1>
        <p className="max-w-2xl mx-auto mb-6 text-lg text-blue-100">
          At Taimako Private Clinic & Maternity, we provide quality healthcare for families, women, and children.
        </p>
        <Button href="/appointments/new" label="Book an Appointment" />
      </motion.div>
    </section>
  )
}
