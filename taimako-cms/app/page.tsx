
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import FeaturesSection from "../components/landing/FeatureSection";
import Footer from "../components/landing/Footer";
import HeroSection from "../components/landing/HeroSection";
import ServicesSection from "../components/ServicesSection";
import TestimonialsSection from "../components/TestimonialsSection";


export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
