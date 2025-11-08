'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: '24/7 Emergency',
    desc: 'Always here to help during medical emergencies.',
  },
  {
    title: 'Qualified Staff',
    desc: 'Professional doctors, nurses, and support staff.',
  },
  {
    title: 'Modern Facilities',
    desc: 'State-of-the-art equipment for diagnostics & maternity.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-8 mb-20">
      {features.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md text-center"
        >
          <h3 className="font-semibold text-lg text-blue-700 mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600">{item.desc}</p>
        </motion.div>
      ))}
    </section>
  )
}
