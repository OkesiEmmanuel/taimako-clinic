const services = [
  { title: 'General Consultation', desc: 'Comprehensive health evaluations and treatments.' },
  { title: 'Maternity Care', desc: 'Safe and professional pregnancy and delivery services.' },
  { title: 'Laboratory Tests', desc: 'Accurate diagnostics with modern equipment.' },
  { title: 'Child Health', desc: 'Expert pediatric care for infants and children.' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50 mb-3">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <div key={i} className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
