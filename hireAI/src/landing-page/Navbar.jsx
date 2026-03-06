import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav
            className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-[50px] py-[34px] bg-transparent"
            style={{ fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-[10px] cursor-pointer" onClick={() => window.location.href = '/'}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0H0V24H12C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0Z" fill="#000000" />
                </svg>
                <span className="text-[22px] font-[400] tracking-[-0.02em] text-[#000000]">
                    HireAI
                </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-[32px] text-[#111111] font-[400] text-[15.5px]">
                <a href="#tour" className="hover:opacity-60 transition-opacity">Product Tour</a>
                <a href="#platform" className="hover:opacity-60 transition-opacity">Platform</a>
                <a href="#customers" className="hover:opacity-60 transition-opacity">Customers</a>
                <a href="#about" className="hover:opacity-60 transition-opacity">About</a>
                <a href="#resources" className="hover:opacity-60 transition-opacity">Resources</a>
                <Link to="/login" className="hover:opacity-60 transition-opacity ml-[10px]">Log in</Link>
            </div>
        </nav>
    );
}
