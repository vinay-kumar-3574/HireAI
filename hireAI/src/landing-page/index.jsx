import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import ContactUs from './ContactUs';
import Footer from './Footer';

/**
 * Main Landing Page Component
 * Containing all the sections as requested.
 */
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900">
            <Navbar />
            <Hero />
            <Features />
            <Testimonials />
            <ContactUs />
            <Footer />
        </div>
    );
}
