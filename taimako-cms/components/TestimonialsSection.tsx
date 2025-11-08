const testimonials = [
  { name: 'Aisha M.', text: 'The doctors were kind and professional. My childbirth experience was amazing!' },
  { name: 'John K.', text: 'They provide excellent consultation and follow-up care. Highly recommended!' },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">What Our Patients Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-xl shadow-sm">
              <p className="text-gray-700 mb-4">“{t.text}”</p>
              <p className="font-semibold text-blue-600">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
