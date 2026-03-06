export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-[#fbfdfc]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-medium text-gray-900 tracking-tight sm:text-4xl mb-16">
                    Loved by successful candidates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left">
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                ))}
                            </div>
                            <p className="text-gray-700 italic mb-6">"HireAI completely changed how I apply for jobs. The extension read the description and tailored my resume perfectly. I got interviews in days."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Alex Hunter</p>
                                    <p className="text-xs text-gray-500">Software Engineer at TechCorp</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
