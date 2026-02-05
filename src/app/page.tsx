"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "our mission", href: "#mission" },
  { label: "stats", href: "#stats" },
  { label: "what we do", href: "#services" },
  { label: "", href: "#join" },
  { label: "team", href: "#team" },
];

const teamMembers = [
  { name: "Jeremiah Hohn", role: "President" },
  { name: "Nate Estrada", role: "Vice President" },
  { name: "Ebenezer Zergabachew", role: "Senior Advisor" },
  { name: "Andrew Kim", role: "Director of Technology & Data" },
  { name: "Jaik Tom", role: "Creative Lead" },
  { name: "Nicholas Vo", role: "Media and Partnerships Lead" },
  { name: "Ahmed Shousha", role: "Senior Tech and Innovation Coordinator" },
  { name: "Vincent Nottoli", role: "Senior Program Coordinator" },
  { name: "Fiona Birnie", role: "Program Coordinator" },
  { name: "Carter Foster", role: "Tech and Innovation Coordinator" },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Custom hook for scroll-based fade
function useScrollFade(threshold = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(windowHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const sectionHeight = rect.height;
      
      // When scrolling down, fade out as section goes off top
      if (rect.top < 0) {
        const scrolledPast = Math.abs(rect.top);
        const fadeStart = sectionHeight * threshold;
        const fadeProgress = Math.min(1, scrolledPast / fadeStart);
        setOpacity(1 - fadeProgress);
      } else {
        setOpacity(1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { ref, opacity };
}

export default function Home() {
  const heroFade = useScrollFade(0.4);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [itemPositions, setItemPositions] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Map images to each service item
  const serviceImages = [
    "/eclubwebp/DSC_1930.webp",
    "/eclubwebp/DSC_2025.webp",
    "/eclubwebp/DSC_2036.webp",
    "/eclubwebp/DSC_2046.webp",
    "/eclubwebp/DSC_2691.webp",
  ];

  // Calculate item positions relative to section
  useEffect(() => {
    const updatePositions = () => {
      if (!sectionRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.scrollY;
      const positions = itemRefs.current.map((ref) => {
        if (!ref) return 0;
        const rect = ref.getBoundingClientRect();
        const itemCenter = rect.top + window.scrollY + rect.height / 2 - sectionTop;
        return itemCenter;
      });
      setItemPositions(positions);
    };

    // Initial calculation
    const timeoutId = setTimeout(updatePositions, 100);
    
    // Update on resize and scroll
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, []);

  // Recalculate positions when hovering
  useEffect(() => {
    if (hoveredIndex !== null) {
      const updatePositions = () => {
        if (!sectionRef.current) return;
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const sectionTop = sectionRect.top + window.scrollY;
        const positions = itemRefs.current.map((ref) => {
          if (!ref) return 0;
          const rect = ref.getBoundingClientRect();
          const itemCenter = rect.top + window.scrollY + rect.height / 2 - sectionTop;
          return itemCenter;
        });
        setItemPositions(positions);
      };
      // Small delay to ensure DOM has updated
      const timeoutId = setTimeout(updatePositions, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [hoveredIndex]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="bg-background text-foreground">
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-foreground/50"
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-72 bg-background shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Close button */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-6 right-6 text-foreground hover:text-accent transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Nav items */}
          <div className="flex flex-col pt-20 px-8 gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="font-[family-name:var(--font-serif)] text-xl text-foreground hover:text-accent transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
          
          {/* Logo at bottom */}
          <div className="absolute bottom-8 left-8 flex items-center gap-2">
            <Image src="/logo.svg" alt="VTEC Logo" width={24} height={32} className="brightness-0" />
            <span className="text-foreground/50 text-xs">×</span>
            <Image src="/vtlogo.svg" alt="VT Logo" width={32} height={32} />
          </div>
        </div>
      </div>

      {/* Navbar - Not sticky, stays at top */}
      <nav className="absolute top-0 left-0 right-0 z-50 h-16 sm:h-20 animate-[fadeIn_1s_ease-out_0.2s_both]">
        {/* Logo - Top Left, absolute position */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2">
          <div className="flex items-center">
            <div className="inline-block">
              <Image
                src="/logo.svg"
                alt="VTEC Logo"
                width={32}
                height={43}
                className="w-6 sm:w-8 h-auto brightness-0"
              />
            </div>
            <div className="hidden sm:flex items-center whitespace-nowrap inline-block ml-3" style={{ transform: 'translateY(-2px)' }}>
              <svg 
                className="w-5 h-5 text-foreground inline-block mx-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <Image
                src="/vtlogo.svg"
                alt="VT Logo"
                width={40}
                height={40}
                className="h-6 w-auto inline-block"
              />
            </div>
          </div>
        </div>
        
        {/* Mobile hamburger button */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 lg:hidden text-foreground hover:text-accent transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Desktop nav */}
        <div className="max-w-7xl mx-auto px-8 h-full hidden lg:flex items-center justify-center">
          <div className="flex items-center justify-between w-full max-w-3xl">
            {navItems.map((item, index) => {
              const glows = [
                '3px 2px 20px rgba(255, 180, 100, 0.25), -2px 4px 25px rgba(255, 190, 120, 0.18), 0 0 35px rgba(255, 200, 140, 0.1)',
                '-2px 3px 22px rgba(255, 180, 100, 0.22), 4px -2px 28px rgba(255, 190, 120, 0.15), 0 0 32px rgba(255, 200, 140, 0.08)',
                '2px -3px 24px rgba(255, 180, 100, 0.24), -3px 2px 26px rgba(255, 190, 120, 0.16), 0 0 30px rgba(255, 200, 140, 0.09)',
                '-3px -2px 21px rgba(255, 180, 100, 0.2), 2px 3px 27px rgba(255, 190, 120, 0.14), 0 0 34px rgba(255, 200, 140, 0.08)',
                '4px 3px 23px rgba(255, 180, 100, 0.23), -2px -3px 29px rgba(255, 190, 120, 0.15), 0 0 31px rgba(255, 200, 140, 0.07)',
              ];
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-[family-name:var(--font-serif)] text-base hover:text-accent transition-colors duration-200 underline underline-offset-4 decoration-accent decoration-2"
                  style={{ 
                    textShadow: glows[index % glows.length]
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* SVG Filter for Fisheye Effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="fisheye">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
            <feDisplacementMap in="blur" in2="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Hero Section */}
      <section
        ref={heroFade.ref as React.RefObject<HTMLElement>}
        id="hero"
        className="h-screen relative overflow-hidden"
        style={{ 
          opacity: heroFade.opacity, 
          transition: 'opacity 0.1s ease-out',
          perspective: '1000px',
        }}
      >
        {/* Background Image - Zoomed to fit with fisheye effect */}
        <div 
          className="absolute inset-[-2%] bg-cover bg-center bg-no-repeat transition-opacity duration-100"
          style={{
            backgroundImage: `url('/efecto.png')`,
            opacity: heroFade.opacity,
            transform: 'scale(1.04)',
            borderRadius: '5%',
          }}
        />
        
        {/* Breathing orange gradient glow - center */}
        <div 
          className="absolute left-1/2 top-1/2 w-[90vh] h-[90vh] pointer-events-none z-[6] animate-[breathe_3s_ease-in-out_infinite]"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 136, 29, 0.75) 0%, rgba(255, 136, 29, 0.5) 25%, rgba(255, 136, 29, 0.25) 50%, transparent 70%)',
            filter: 'blur(50px)',
            borderRadius: '50%',
          }}
        />
        
        {/* Fig 01 Label - Bottom right of center logo (hidden on mobile) */}
        <div className="absolute bottom-[25%] right-[30%] z-20 translate-y-[40px] -translate-x-[55px] animate-[fadeIn_1s_ease-out_0.8s_both] hidden md:block">
          <span className="font-[family-name:var(--font-serif)] text-sm text-foreground">fig 01.</span>
        </div>
        
        {/* Vertical Text - Right Edge */}
        <div className="absolute right-0 top-0 bottom-0 z-10 h-screen animate-[fadeInSimple_1.2s_ease-out_0.4s_both] hidden md:block">
          <p 
            className="font-[family-name:var(--font-serif)] tracking-tighter text-foreground/20 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', fontSize: 'calc(100vh / 8)', lineHeight: 1, height: '100vh', textShadow: '0 0 25px rgba(255, 136, 29, 0.15), 0 0 50px rgba(255, 136, 29, 0.08), 0 0 75px rgba(255, 136, 29, 0.04)' }}
          >
            Hokies Innovate.
          </p>
        </div>

        {/* Layout Container - Bottom aligned */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end pb-6 md:pb-8 lg:pb-10 pl-4 md:pl-6 lg:pl-8 pr-8 md:pr-12 lg:pr-16">
          <div className="text-left animate-[fadeIn_1s_ease-out_0.6s_both]">
            <h1 className="font-serif text-[1.1rem] sm:text-[1.4rem] md:text-[2.1rem] lg:text-[2.8rem] xl:text-[3.8rem] tracking-tight leading-[0.85] mb-4" style={{ textShadow: '0 0 30px rgba(255, 136, 29, 0.4), 0 0 60px rgba(255, 136, 29, 0.2), 0 0 90px rgba(255, 136, 29, 0.1)' }}>
              <a href="https://www.vt.edu/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-200">virginia tech</a><span className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl relative -top-2 sm:-top-3 md:-top-5 lg:-top-7 xl:-top-9 inline-block">™</span>
            </h1>
            <h1 className="font-['Lincoln_MITRE'] text-[2rem] sm:text-[2.8rem] md:text-[4.2rem] lg:text-[5.5rem] xl:text-[7.5rem] tracking-[-0.1em] leading-[0.85] text-accent flex items-center">
              Entrepreneurship Club
              <span className="hidden sm:flex flex-col items-center gap-2 ml-7 md:ml-11" style={{ opacity: 0.75 }}>
                <a 
                  href="https://www.instagram.com/eclub.vt/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative text-foreground hover:scale-110 transition-all duration-300 ease-out group"
                >
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255, 136, 29, 0.5) 0%, rgba(255, 136, 29, 0) 70%)', transform: 'scale(2.5)', filter: 'blur(8px)' }} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 relative z-10" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/vteclub/posts/?feedView=all" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative text-foreground hover:scale-110 transition-all duration-300 ease-out group"
                >
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255, 136, 29, 0.5) 0%, rgba(255, 136, 29, 0) 70%)', transform: 'scale(2.5)', filter: 'blur(8px)' }} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 relative z-10" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                  </svg>
                </a>
              </span>
          </h1>
          </div>
        </div>
        
      </section>

      {/* Mission Statement */}
      <section
        id="mission"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 bg-foreground text-background relative overflow-hidden"
      >
        {/* Decorative vertical text (hidden on mobile) */}
        <div className="absolute left-4 top-0 bottom-0 items-center hidden lg:flex">
          <p className="font-[family-name:var(--font-serif)] text-background/10 whitespace-nowrap" style={{ writingMode: 'vertical-rl', fontSize: '12vh', letterSpacing: '-0.05em' }}>
            mission
          </p>
        </div>
        
        <div className="max-w-3xl ml-16 md:ml-24">
          <p className="font-[family-name:var(--font-serif)] text-sm tracking-widest text-background/50 mb-6">01 — our purpose</p>
          
          <h2 className="font-['Lincoln_MITRE'] text-3xl md:text-4xl lg:text-5xl tracking-tight text-accent mb-12" style={{ textShadow: '0 0 40px rgba(255, 136, 29, 0.3)' }}>
            Empowering Innovators.
          </h2>
          
          <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl leading-relaxed text-background/80">
            We empower the next generation of innovators at Virginia Tech by fostering a community of creative problem-solvers, providing resources for startup development, and connecting students with industry leaders.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="w-16 h-[1px] bg-accent" />
            <span className="font-[family-name:var(--font-serif)] text-xs text-background/40">est. 2019</span>
          </div>
        </div>
        
        {/* Scroll arrow */}
        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent hover:translate-y-1 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* Stats */}
      <section
        id="stats"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <p className="font-[family-name:var(--font-serif)] text-sm tracking-widest text-foreground/50 mb-6">02 — by the numbers</p>
          
          <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl tracking-tight mb-20">
            Real <span className="underline underline-offset-4 decoration-accent decoration-2">impact</span>, measured.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { value: "$9k", label: "provided to student entrepreneurs", num: "01" },
              { value: "5O+", label: "concepts built into products", num: "02" },
              { value: "7", label: "startups generating revenue", num: "03" },
            ].map((stat, index) => (
              <div key={index} className="border-l border-foreground/20 pl-6 py-4">
                <span className="font-[family-name:var(--font-serif)] text-xs text-foreground/30 block mb-4">fig {stat.num}.</span>
                <div className="relative inline-block">
                  {/* Circular glow behind number */}
                  <div 
                    className="absolute pointer-events-none"
                    style={{
                      width: '120px',
                      height: '120px',
                      left: index === 0 ? '50%' : '30%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'radial-gradient(circle, rgba(255, 136, 29, 0.2) 0%, rgba(255, 136, 29, 0) 70%)',
                      filter: 'blur(15px)',
                      borderRadius: '50%',
                    }}
                  />
                  <p className="text-5xl md:text-6xl lg:text-7xl tracking-tight text-accent mb-4 relative z-10" style={{ textShadow: '0 0 30px rgba(255, 136, 29, 0.2)' }}>
                    <span className="font-['Lincoln_MITRE']">{stat.value.replace('+', '')}</span>
                    {stat.value.includes('+') && <span className="font-[family-name:var(--font-serif)]">+</span>}
                  </p>
                </div>
                <p className="font-[family-name:var(--font-serif)] text-sm text-foreground/60 leading-relaxed">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll arrow */}
        <a href="#services" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent hover:translate-y-1 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* What We Do */}
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        id="services"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 bg-foreground text-background relative overflow-hidden"
      >
        {/* Hover Image Display */}
        {hoveredIndex !== null && (
          <div 
            className={`absolute pointer-events-none z-0 hidden md:block ${
              // Items 0, 3, 5 (indices 0, 2, 4) on LEFT; Items 2, 4 (indices 1, 3) on RIGHT
              hoveredIndex === 0 || hoveredIndex === 2 || hoveredIndex === 4
                ? 'left-2 md:left-4 lg:left-8'
                : 'right-4 md:right-8 lg:right-16'
            }`}
            style={{
              width: 'min(calc((100vw - 56rem) / 2 - 4rem), 280px)',
              maxWidth: '280px',
              // Align image center with list item center
              top: itemPositions[hoveredIndex] !== undefined 
                ? `${itemPositions[hoveredIndex]}px`
                : '50%',
              transform: 'translateY(-50%)',
              // Horizontal positioning adjustments
              ...(hoveredIndex === 0 && { left: '1rem' }), // Item 1: move more to the right
              ...(hoveredIndex === 4 && { left: '1rem' }), // Item 5: move more to the right
              ...(hoveredIndex === 1 && { right: '2rem' }), // Item 2: move more to the right
              ...(hoveredIndex === 3 && { right: '2rem' }), // Item 4: move more to the right
            }}
          >
            <div 
              className="relative w-full"
              style={{
                aspectRatio: '4/3',
                animation: 'fadeInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              }}
            >
              <Image
                src={serviceImages[hoveredIndex]}
                alt={[
                  { num: "01", text: "workshops & skill-building sessions" },
                  { num: "02", text: "startup pitch competitions" },
                  { num: "03", text: "networking with industry leaders" },
                  { num: "04", text: "mentorship programs" },
                  { num: "05", text: "access to funding opportunities" },
                ][hoveredIndex].text}
                fill
                className="object-cover rounded-lg"
                style={{
                  filter: 'brightness(0.95) contrast(1.05)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 80px rgba(255, 136, 29, 0.2)',
                }}
              />
              {/* Gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-lg" />
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <p className="font-[family-name:var(--font-serif)] text-sm tracking-widest text-background/50 mb-6">03 — what we do</p>
          
          <h2 className="font-['Lincoln_MITRE'] text-3xl md:text-4xl lg:text-5xl tracking-tight text-accent mb-16" style={{ textShadow: '0 0 40px rgba(255, 136, 29, 0.3)' }}>
            Building Builders.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { num: "01", text: "workshops & skill-building sessions" },
              { num: "02", text: "startup pitch competitions" },
              { num: "03", text: "networking with industry leaders" },
              { num: "04", text: "mentorship programs" },
              { num: "05", text: "access to funding opportunities" },
              { num: "06", text: "buildathons" },
            ].map((item, index) => (
              <div
                key={index}
                ref={(el) => { itemRefs.current[index] = el; }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group flex items-start gap-4 py-4 border-b border-background/10 hover:border-accent transition-all duration-300 cursor-pointer"
              >
                <span className="font-[family-name:var(--font-serif)] text-xs text-background/30 mt-1 group-hover:text-accent transition-colors duration-300">{item.num}</span>
                <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-background/80 group-hover:text-background group-hover:translate-x-2 transition-all duration-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll arrow */}
        <a href="#join" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent hover:translate-y-1 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* CTA - Become a Member */}
      <section
        id="join"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 bg-accent text-background relative overflow-hidden"
      >
        {/* Large decorative text (hidden on mobile) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
          <p className="font-['Lincoln_MITRE'] text-[20vw] leading-none tracking-tighter">
            JOIN
          </p>
        </div>
        
        <div className="max-w-2xl relative z-10">
          <p className="font-[family-name:var(--font-serif)] text-sm tracking-widest text-background/60 mb-6">04 — join us</p>
          
          <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8 leading-tight">
            Ready to build<br/>something <span className="underline underline-offset-4 decoration-background decoration-2">great</span>?
          </h2>
          
          <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl leading-relaxed text-background/80 mb-12 max-w-lg">
            Become a member and unlock exclusive access to events, resources, and a vibrant community of innovators.
          </p>
          
          <a
            href="mailto:eclubvt@gmail.com"
            className="inline-flex items-center gap-3 font-[family-name:var(--font-serif)] text-base px-8 py-4 bg-background text-accent hover:bg-background/90 transition-all duration-300"
          >
            get started
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
        
        {/* Scroll arrow */}
        <a href="#team" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground hover:translate-y-1 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* Team */}
      <section
        id="team"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 relative"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <p className="font-[family-name:var(--font-serif)] text-sm tracking-widest text-foreground/50 mb-6">05 — the team</p>
              <h2 className="font-['Lincoln_MITRE'] text-3xl md:text-4xl lg:text-5xl tracking-tight text-accent" style={{ textShadow: '0 0 40px rgba(255, 136, 29, 0.3)' }}>
                Meet the Builders.
              </h2>
            </div>
            <p className="font-[family-name:var(--font-serif)] text-sm text-foreground/50 mt-4 md:mt-0">{teamMembers.length} members</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group py-6 border-t border-foreground/10 hover:border-accent transition-colors duration-300"
              >
                <span className="font-[family-name:var(--font-serif)] text-xs text-foreground/30 block mb-3">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-base font-medium mb-1 group-hover:text-accent transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="font-[family-name:var(--font-serif)] text-xs text-foreground/50">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Back to top arrow */}
        <a href="#hero" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-accent hover:-translate-y-1 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="font-[family-name:var(--font-serif)] text-xs">back to top</span>
        </a>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-20 px-8 md:px-16 lg:px-24 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Logo & Tagline */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/logo.svg"
                  alt="VTEC Logo"
                  width={32}
                  height={43}
                  className="w-8 h-auto brightness-0 invert"
                />
                <span className="font-[family-name:var(--font-serif)] text-xs text-background/40">×</span>
                <Image
                  src="/vtlogo.svg"
                  alt="VT Logo"
                  width={40}
                  height={40}
                  className="h-5 w-auto invert"
                />
              </div>
              <p className="font-[family-name:var(--font-serif)] text-sm text-background/60 max-w-xs">
                The official launchpad for Hokie innovation. Building the next generation of founders.
              </p>
            </div>
            
            {/* Links */}
            <div className="md:col-span-3">
              <p className="font-[family-name:var(--font-serif)] text-xs text-background/40 mb-4 tracking-widest">connect</p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/company/vteclub/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-serif)] text-sm text-background/70 hover:text-accent transition-colors duration-200"
                >
                  linkedin
          </a>
          <a
                  href="https://www.instagram.com/eclub.vt/"
            target="_blank"
            rel="noopener noreferrer"
                  className="font-[family-name:var(--font-serif)] text-sm text-background/70 hover:text-accent transition-colors duration-200"
                >
                  instagram
                </a>
              </div>
            </div>
            
            {/* Contact */}
            <div className="md:col-span-4">
              <p className="font-[family-name:var(--font-serif)] text-xs text-background/40 mb-4 tracking-widest">contact</p>
              <a href="mailto:eclubvt@gmail.com" className="font-[family-name:var(--font-serif)] text-sm text-background/70 hover:text-accent transition-colors duration-200">
                eclubvt@gmail.com
              </a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-[family-name:var(--font-serif)] text-xs text-background/40">
              © 2026 Virginia Tech Entrepreneurship Club
            </p>
            <p className="font-[family-name:var(--font-serif)] text-xs text-background/40">
              Blacksburg, VA
            </p>
          </div>
        </div>
      </footer>
      </main>
  );
}
