export default function ContactUs() {
    return (
        <section id="contact" className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-medium text-gray-900 tracking-tight sm:text-4xl mb-6">
                    Ready to scale your career?
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                    Join thousands of applicants who are automating their job hunt and bypassing ATS filters with precision.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-6 py-4 w-full sm:w-80 border border-gray-200 rounded-full focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />
                    <button className="bg-black text-white px-8 py-4 rounded-full font-medium w-full sm:w-auto hover:bg-gray-800 transition">
                        Get early access
                    </button>
                </div>
            </div>
        </section>
    );
}
