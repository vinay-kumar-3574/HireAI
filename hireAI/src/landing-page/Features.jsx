export default function Features() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-medium text-gray-900 tracking-tight sm:text-4xl">
                    Everything you need to land the job
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    HireAI analyzes the job description while you browse and instantly suggests the perfect resume modifications.
                </p>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-2xl flex flex-col items-start text-left">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Instant Extension</h3>
                        <p className="text-gray-600">Scan job portals like LinkedIn & Indeed in real time to extract requirements instantly.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-2xl flex flex-col items-start text-left">
                        <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">AI Resume Editor</h3>
                        <p className="text-gray-600">Accept or reject AI suggestions inline, getting a side-by-side view of your ATS improvement.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-2xl flex flex-col items-start text-left">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">ATS Score Engine</h3>
                        <p className="text-gray-600">See your exact match score increase as you bridge the skill gap in real time.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
