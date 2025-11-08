export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-blue-600 text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="mb-6 text-blue-100">
          Ready to book an appointment or have questions? Contact us today!
        </p>
        <a
          href="mailto:info@taimakoclinic.com"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-semibold"
        >
          info@taimakoclinic.com
        </a>
      </div>
    </section>
  )
}
