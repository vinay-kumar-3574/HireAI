export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-6 h-6 bg-gray-900 rounded-[4px] rotate-12" />
                    <span className="text-2xl font-semibold tracking-tight text-gray-900">HireAI</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 max-w-lg text-center">
                    The intelligent layer on top of your job hunt. Generate tailored resumes and cover letters in real time from anywhere you browse.
                </p>
                <div className="flex gap-6 text-sm text-gray-500">
                    <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900">Terms of Service</a>
                    <a href="#" className="hover:text-gray-900">Changelog</a>
                </div>
                <p className="mt-12 text-sm text-gray-400">© {new Date().getFullYear()} HireAI Inc. All rights reserved.</p>
            </div>
        </footer>
    );
}
