export default function Hero() {
    const Star = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FEA945" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    );

    return (
        <section
            className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 overflow-hidden"
            style={{
                backgroundColor: '#FAFAF9',
                backgroundImage: `
          radial-gradient(circle at 40% 15%, rgba(255, 218, 195, 0.8) 0%, rgba(255, 255, 255, 0) 45%),
          radial-gradient(circle at 55% 50%, rgba(255, 212, 191, 0.7) 0%, rgba(255, 255, 255, 0) 50%),
          radial-gradient(circle at 35% 65%, rgba(251, 222, 233, 0.6) 0%, rgba(255, 255, 255, 0) 50%),
          radial-gradient(circle at 75% 30%, rgba(255, 230, 234, 0.5) 0%, rgba(255, 255, 255, 0) 40%)
        `,
                fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif'
            }}
        >
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-[1100px] w-full mt-[-3rem]">

                {/* Main Heading */}
                <h1
                    className="text-[#363636] tracking-[-0.035em] font-[400] m-0 p-0"
                    style={{ fontSize: '5.5rem', lineHeight: '1.05' }}
                >
                    The AI application agent
                    <br className="max-sm:hidden" />
                    that boosts your career
                </h1>

                {/* Sub Heading */}
                <p
                    className="mt-8 mb-10 text-[#1a1a1a] font-[400]"
                    style={{ fontSize: '1.35rem', letterSpacing: '-0.01em' }}
                >
                    Tailor resumes in real time, like you would manually.
                </p>

                {/* CTA Button */}
                <button className="bg-[#050505] text-[#fcfcfc] px-9 py-[14px] rounded-full text-[15.5px] font-[500] hover:bg-[#1a1a1a] transition-colors">
                    Book a demo
                </button>

                {/* Bottom Social Proof */}
                <div className="flex items-center gap-12 mt-16">

                    {/* Logo 1 */}
                    <div className="flex items-center gap-[14px]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#989898]">
                            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
                        </svg>
                        <div className="flex gap-[4px]">
                            <Star /><Star /><Star /><Star /><Star />
                        </div>
                    </div>

                    {/* Logo 2 */}
                    <div className="flex items-center gap-[14px]">
                        {/* G2-like logo placeholder (Target/Circle) */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-[#989898]">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 10.9 13 11.5 13 12.5h-2c0-1.5.5-2.1 1.17-2.75l1.24-1.26c.37-.36.59-.86.59-1.49 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                        </svg>
                        <div className="flex gap-[4px]">
                            <Star /><Star /><Star /><Star /><Star />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
