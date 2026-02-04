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
  const missionFade = useScrollFade(0.3);
  const statsFade = useScrollFade(0.3);
  const servicesFade = useScrollFade(0.3);
  const joinFade = useScrollFade(0.3);
  const teamFade = useScrollFade(0.3);

  return (
    <main className="bg-background text-foreground">
      {/* Navbar - Not sticky, stays at top */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        {/* Logo - Top Left, absolute position */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <Image
            src="/logo.svg"
            alt="VTEC Logo"
            width={32}
            height={43}
            className="w-8 h-auto brightness-0"
          />
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
                  className="font-[family-name:var(--font-serif)] text-base hover:text-accent transition-colors duration-200 underline underline-offset-4 decoration-accent/40 decoration-1"
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
        
        {/* Fig 01 Label - Bottom right of center logo */}
        <div className="absolute bottom-[25%] right-[30%] z-20 translate-y-[50px] -translate-x-[50px]">
          <span className="font-[family-name:var(--font-serif)] text-sm text-foreground">fig 01.</span>
        </div>
        
        {/* Scrolling Sideways Text - Right Edge */}
        <div className="absolute right-0 top-0 h-[200vh] z-10 overflow-hidden flex justify-end">
          <p 
            className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground whitespace-nowrap animate-[scroll-vertical_30s_linear_infinite]"
            style={{ writingMode: 'vertical-lr', transform: 'scaleX(-1)' }}
          >
            Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here. Startups Start Here.
          </p>
        </div>

        {/* Layout Container - Bottom aligned */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end pb-8 md:pb-10 lg:pb-12 px-8 md:px-12 lg:px-16">
          <div className="text-left">
            <h1 className="font-[family-name:var(--font-serif)] text-[1.1rem] sm:text-[1.4rem] md:text-[1.8rem] lg:text-[2.2rem] xl:text-[2.6rem] tracking-widest leading-[1] text-foreground/70 ml-0" style={{ textShadow: '2px 1px 20px rgba(255, 180, 100, 0.15), -1px 2px 25px rgba(255, 190, 120, 0.1), 0 0 30px rgba(255, 200, 140, 0.08)' }}>
              Virginia Tech <span className="underline underline-offset-4 decoration-accent/40 decoration-1" style={{ textShadow: '3px 8px 35px rgba(255, 135, 29, 0.35), -2px 12px 45px rgba(255, 135, 29, 0.25), 0 6px 55px rgba(255, 135, 29, 0.2), 0 -8px 40px rgba(255, 135, 29, 0.18)' }}>Entrepreneurship</span> Club.
            </h1>
            <p className="font-[family-name:var(--font-serif)] text-base leading-relaxed text-foreground/60 mt-5 ml-0" style={{ textShadow: '2px 1px 20px rgba(255, 180, 100, 0.25), -1px 3px 28px rgba(255, 190, 120, 0.18), 0 0 35px rgba(255, 200, 140, 0.12)' }}>
              The official launchpad for Hokie innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section
        ref={missionFade.ref as React.RefObject<HTMLElement>}
        id="mission"
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-foreground text-background"
        style={{ opacity: missionFade.opacity, transition: 'opacity 0.1s ease-out' }}
      >
        <div className="max-w-4xl text-center">
          <h2 className="font-[family-name:var(--font-therma)] text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase mb-16">
            Our Mission
          </h2>
          
          <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl lg:text-3xl leading-relaxed">
            We empower the next generation of innovators at Virginia Tech by fostering a community of creative problem-solvers, providing resources for startup development, and connecting students with industry leaders.
          </p>
          
          <div className="mt-16 w-24 h-[2px] bg-accent mx-auto" />
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsFade.ref as React.RefObject<HTMLElement>}
        id="stats"
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
        style={{ opacity: statsFade.opacity, transition: 'opacity 0.1s ease-out' }}
      >
        <div className="max-w-6xl w-full">
          <h2 className="font-[family-name:var(--font-therma)] text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase mb-20 text-center">
            By The Numbers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <p className="font-[family-name:var(--font-therma)] text-5xl md:text-6xl tracking-tight text-accent">
                $9,000+
              </p>
              <p className="font-[family-name:var(--font-serif)] text-lg mt-4 text-foreground/70">
                provided to student entrepreneurs
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <p className="font-[family-name:var(--font-therma)] text-5xl md:text-6xl tracking-tight text-accent">
                50+
              </p>
              <p className="font-[family-name:var(--font-serif)] text-lg mt-4 text-foreground/70">
                concepts built into products
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="font-[family-name:var(--font-therma)] text-5xl md:text-6xl tracking-tight text-accent">
                7+
              </p>
              <p className="font-[family-name:var(--font-serif)] text-lg mt-4 text-foreground/70">
                startups that have raised capital, exited, or are currently generating revenue
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section
        ref={servicesFade.ref as React.RefObject<HTMLElement>}
        id="services"
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-foreground text-background"
        style={{ opacity: servicesFade.opacity, transition: 'opacity 0.1s ease-out' }}
      >
        <div className="max-w-4xl w-full">
          <h2 className="font-[family-name:var(--font-therma)] text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase mb-20 text-center">
            What We Do
          </h2>
          
          <div className="space-y-8">
            {[
              { emoji: "🎓", text: "workshops & skill-building sessions" },
              { emoji: "🎯", text: "startup pitch competitions" },
              { emoji: "🤝", text: "networking events with industry leaders" },
              { emoji: "👥", text: "mentorship programs" },
              { emoji: "💰", text: "access to funding opportunities" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-6 border-l-2 border-accent pl-8 py-4 hover:bg-background/5 transition-colors duration-300"
              >
                <span className="text-4xl">{item.emoji}</span>
                <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Become a Member */}
      <section
        ref={joinFade.ref as React.RefObject<HTMLElement>}
        id="join"
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-accent text-background"
        style={{ opacity: joinFade.opacity, transition: 'opacity 0.1s ease-out' }}
      >
        <div className="max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-therma)] text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase mb-8">
            Become a Member
          </h2>
          
          <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl leading-relaxed mb-12">
            Become a member of the Entrepreneurship Club and unlock exclusive access to events, resources, and a vibrant community of innovators.
          </p>
          
          <a
            href="mailto:vtec@vt.edu"
            className="inline-block font-[family-name:var(--font-serif)] text-lg px-12 py-5 border-2 border-background hover:bg-background hover:text-accent transition-all duration-300"
          >
            get started
          </a>
        </div>
      </section>

      {/* Team */}
      <section
        ref={teamFade.ref as React.RefObject<HTMLElement>}
        id="team"
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
        style={{ opacity: teamFade.opacity, transition: 'opacity 0.1s ease-out' }}
      >
        <div className="max-w-6xl w-full">
          <h2 className="font-[family-name:var(--font-therma)] text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase mb-20 text-center">
            Meet the Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group border border-foreground/20 p-6 hover:border-accent hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <div className="w-16 h-16 mb-4 bg-foreground text-background group-hover:bg-accent flex items-center justify-center transition-colors duration-300">
                  <span className="font-[family-name:var(--font-serif)] text-xl font-bold">{getInitials(member.name)}</span>
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold">
                  {member.name}
                </h3>
                <p className="font-[family-name:var(--font-serif)] text-sm mt-1 opacity-70">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-foreground/10 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <Image
                src="/logo.svg"
                alt="VTEC Logo"
                width={48}
                height={65}
                className="w-12 h-auto brightness-0 invert"
              />
              <p className="font-[family-name:var(--font-serif)] text-lg">
                The official launchpad for Hokie innovation.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              {["twitter", "linkedin", "instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-[family-name:var(--font-serif)] text-sm hover:text-accent transition-colors duration-200"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-background/10 text-center">
            <p className="font-[family-name:var(--font-serif)] text-xs text-background/50">
              © 2026 Virginia Tech Entrepreneurship Club. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </main>
  );
}
