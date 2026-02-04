"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "mission", href: "#mission" },
  { label: "stats", href: "#stats" },
  { label: "what we do", href: "#services" },
  { label: "join", href: "#join" },
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

  return (
    <main className="bg-background text-foreground">
      {/* Navbar - Not sticky, stays at top */}
      <nav className="absolute top-0 left-0 right-0 z-50 animate-[fadeIn_1s_ease-out_0.2s_both]">
        {/* Logo - Top Left, absolute position */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <div className="flex items-center">
            <div className="inline-block">
              <Image
                src="/logo.svg"
                alt="VTEC Logo"
                width={32}
                height={43}
                className="w-8 h-auto brightness-0"
              />
            </div>
            <div className="flex items-center whitespace-nowrap inline-block ml-3" style={{ transform: 'translateY(-2px)' }}>
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
        
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-center">
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
        
        {/* Fisheye lens vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.03) 70%, rgba(0, 0, 0, 0.08) 85%, rgba(0, 0, 0, 0.15) 95%, rgba(0, 0, 0, 0.22) 100%)',
            boxShadow: 'inset 0 0 120px 40px rgba(0, 0, 0, 0.06)',
          }}
        />
        
        {/* Breathing orange gradient glow - center */}
        <div 
          className="absolute left-1/2 top-1/2 w-[90vh] h-[90vh] pointer-events-none z-[6] animate-[breathe_3s_ease-in-out_infinite,fadeInSimple_1.5s_ease-out_0.5s_both]"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 136, 29, 0.35) 0%, rgba(255, 136, 29, 0.2) 30%, rgba(255, 136, 29, 0.07) 55%, transparent 75%)',
            filter: 'blur(50px)',
            borderRadius: '50%',
            transform: 'translate(-50%, calc(-50% - 20px))',
          }}
        />
        
        {/* Fig 01 Label - Bottom right of center logo */}
        <div className="absolute bottom-[25%] right-[30%] z-20 translate-y-[50px] -translate-x-[50px] animate-[fadeIn_1s_ease-out_0.8s_both]">
          <span className="font-[family-name:var(--font-serif)] text-sm text-foreground">fig 01.</span>
        </div>
        
        {/* Vertical Text - Right Edge */}
        <div className="absolute right-0 top-0 bottom-0 z-10 h-screen animate-[fadeInSimple_1.2s_ease-out_0.4s_both]">
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
              virginia tech<span className="text-2xl relative -top-9 inline-block">™</span>
            </h1>
            <h1 className="font-['Lincoln_MITRE'] text-[2rem] sm:text-[2.8rem] md:text-[4.2rem] lg:text-[5.5rem] xl:text-[7.5rem] tracking-[-0.1em] leading-[0.85] text-accent">
              Entrepreneurship Club
          </h1>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section
        id="mission"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 bg-foreground text-background relative overflow-hidden"
      >
        {/* Decorative vertical text */}
        <div className="absolute left-4 top-0 bottom-0 flex items-center">
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
      </section>

      {/* Stats */}
      <section
        id="stats"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 relative"
      >
        <div className="max-w-5xl mx-auto w-full">
          <p className="font-[family-name:var(--font-serif)] text-sm tracking-widest text-foreground/50 mb-6">02 — by the numbers</p>
          
          <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl tracking-tight mb-20">
            Real <span className="underline underline-offset-4 decoration-accent decoration-2">impact</span>, measured.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { value: "$9k+", label: "provided to student entrepreneurs", num: "01" },
              { value: "5O+", label: "concepts built into products", num: "02" },
              { value: "7+", label: "startups generating revenue", num: "03" },
            ].map((stat, index) => (
              <div key={index} className="border-l border-foreground/20 pl-6 py-4">
                <span className="font-[family-name:var(--font-serif)] text-xs text-foreground/30 block mb-4">fig {stat.num}.</span>
                <p className="font-['Lincoln_MITRE'] text-5xl md:text-6xl lg:text-7xl tracking-tight text-accent mb-4" style={{ textShadow: '0 0 30px rgba(255, 136, 29, 0.2)' }}>
                  {stat.value}
                </p>
                <p className="font-[family-name:var(--font-serif)] text-sm text-foreground/60 leading-relaxed">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section
        id="services"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 bg-foreground text-background relative"
      >
        <div className="max-w-4xl mx-auto w-full">
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
            ].map((item, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 py-4 border-b border-background/10 hover:border-accent transition-colors duration-300"
              >
                <span className="font-[family-name:var(--font-serif)] text-xs text-background/30 mt-1">{item.num}</span>
                <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-background/80 group-hover:text-background transition-colors duration-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Become a Member */}
      <section
        id="join"
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 bg-accent text-background relative overflow-hidden"
      >
        {/* Large decorative text */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
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
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 md:px-16 lg:px-24 bg-foreground text-background">
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
