"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TechBackground from "@/components/TechBackground";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [decryptStatus, setDecryptStatus] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Decryption terminal log simulator messages
  const decryptionLogs = [
    "CONNECTING TO SECURE VAULT PARTITION...",
    "ESTABLISHING SECURE HANDSHAKE WITH PORTAL...",
    "CREWAI INTERFACE HANDLER: INITIALIZED",
    "DECRYPTING PROFILE KEYSPACE [AES-256]...",
    "DECRYPTION COMPLETED // VALIDATING ACCESS TICKET...",
    "ACCESS GRANTED // SYNCHRONIZING AGENT CONTEXT...",
  ];

  // Mouse move tracker for interactive glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Card 3D tilt hover effect handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normX = x / rect.width;
    const normY = y / rect.height;
    
    // Max 12 degrees rotation
    const rotateY = normX * 12;
    const rotateX = -normY * 12;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out",
    });
  };

  const handleCardMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out, box-shadow 0.5s ease-out",
    });
  };

  // Handle Form Submission / Decryption animation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsFormSubmitted(true);
    setIsDecrypting(true);
    setDecryptProgress(0);
    setDecryptStatus("INITIALIZING SECURE PROTOCOLS...");
    setLogs([]);

    // Sequential simulation of high-tech decryption process
    let currentStep = 0;
    const totalSteps = decryptionLogs.length;

    const interval = setInterval(() => {
      if (currentStep < totalSteps) {
        const nextLog = decryptionLogs[currentStep];
        setLogs((prev) => [...prev, `> ${nextLog}`]);
        setDecryptStatus(nextLog);
        setDecryptProgress(Math.min(((currentStep + 1) / totalSteps) * 100, 95));
        currentStep++;
      } else {
        clearInterval(interval);
        setDecryptProgress(100);
        setDecryptStatus("VAULT OPENED! REDIRECTING...");
        
        // Final transition delay for maximum UI visual impact
        setTimeout(() => {
          router.push("/portfolio");
        }, 800);
      }
    }, 450);
  };

  return (
    <main 
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--background)] px-4 font-sans text-[var(--foreground)] transition-colors duration-500"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, var(--bg-gradient-1) 0%, var(--background) 100%)"
      }}
    >
      <ThemeToggle />
      <TechBackground />
      
      {/* Dynamic Cursor Light Glow */}
      <div 
        className="pointer-events-none absolute rounded-full opacity-30 blur-[120px] transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x - 200}px`,
          top: `${mousePos.y - 200}px`,
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 100%)",
        }}
      />

      {/* Cyber Grid Background overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Ambient background particles/circles */}
      <div className="absolute top-[20%] left-[15%] h-72 w-72 rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] h-80 w-80 rounded-full bg-indigo-600/10 dark:bg-indigo-600/5 blur-[90px] pointer-events-none" />

      <section className="relative z-10 w-full max-w-[460px]">
        {/* Glassmorphism Vault Card with 3D Tilt Hover */}
        <div 
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
          style={{
            ...tiltStyle,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px var(--accent-glow), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Card subtle lighting edge effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 via-transparent to-purple-500/5 pointer-events-none" />

          {/* Holographic Header */}
          <header className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]">
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 animate-ping rounded-2xl border border-[var(--accent)]/20 opacity-30" />
              {/* Security Shield icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="h-8 w-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold tracking-widest text-[var(--foreground)] uppercase bg-gradient-to-r from-[var(--foreground)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-sm">
              Resume Vault
            </h1>
            <p className="mt-1.5 text-xs font-semibold tracking-widest text-[var(--accent)]/80 uppercase">
              DECRYPTION PORTAL
            </p>
          </header>

          {/* Decryption Loading Interface */}
          {isDecrypting ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs tracking-wider text-[var(--accent)]">
                  <span className="font-mono">{decryptStatus}</span>
                  <span className="font-mono font-bold">{Math.round(decryptProgress)}%</span>
                </div>
                {/* Progress bar container */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--input-bg)] border border-[var(--glass-border)]">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-purple-500 to-pink-500 shadow-[0_0_8px_var(--accent-glow)] transition-all duration-300 ease-out"
                    style={{ width: `${decryptProgress}%` }}
                  />
                </div>
              </div>

              {/* simulated terminal output logs */}
              <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--input-bg)] p-4 font-mono text-[10px] leading-relaxed text-[var(--foreground)]/80 shadow-inner">
                <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2 mb-2">
                  <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">TERMINAL OUTPUT</span>
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                </div>
                <div className="h-[90px] overflow-y-auto space-y-1.5">
                  {logs.map((log, index) => (
                    <div key={index} className="whitespace-nowrap overflow-hidden text-ellipsis animate-[fadeIn_0.2s_ease-out_forwards]">
                      {log}
                    </div>
                  ))}
                  <div className="text-[10px] text-[var(--accent)] animate-pulse font-bold">
                    &gt; _
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/portfolio")}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition"
                  id="bypass-decryption-btn"
                >
                  Skip and Enter Immediately
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase" htmlFor="email-input">
                  Vault Identifier (Email)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]/70">
                    {/* Mail SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="agent@resume-vault.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--input-bg)] py-3 pl-11 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/40 outline-none transition duration-300 focus:border-[var(--accent)]/50 focus:bg-[var(--input-bg)] focus:shadow-[0_0_15px_var(--accent-glow)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase" htmlFor="password-input">
                    Decryption Key (Password)
                  </label>
                  <a href="#" className="text-[10px] font-semibold text-[var(--accent)] hover:opacity-80 transition">
                    Forgot Key?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]/70">
                    {/* Key SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--input-bg)] py-3 pl-11 pr-12 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/40 outline-none transition duration-300 focus:border-[var(--accent)]/50 focus:bg-[var(--input-bg)] focus:shadow-[0_0_15px_var(--accent-glow)]"
                  />
                  <button
                    type="button"
                    id="show-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--text-muted)] hover:text-[var(--foreground)] transition"
                  >
                    {showPassword ? (
                      /* Eye Slash SVG */
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      /* Eye SVG */
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Enter Vault Glowing Button */}
              <button
                id="enter-vault-btn"
                type="submit"
                className="group relative mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 py-3.5 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  boxShadow: "0 0 20px var(--accent-glow)"
                }}
              >
                {/* Button inner glow and highlight layers */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" />
                <span className="absolute inset-px rounded-[11px] bg-gradient-to-r from-[var(--accent)]/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition duration-300 blur-[2px]" />
                
                <span className="relative flex items-center gap-2">
                  ENTER VAULT
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </button>
            </form>
          )}

          {/* Divider and high-tech status badges */}
          <div className="mt-8 border-t border-[var(--glass-border)] pt-6 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] tracking-wider text-[var(--text-muted)] font-mono">
              <span>STATUS: SECURED</span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                AES-256 ACTIVE
              </span>
            </div>
            <div className="text-center text-[10px] tracking-wide text-[var(--text-muted)]/70 font-mono">
              SYSTEM CONTEXT: CREWAI_AGENT_01 // SECURE_BUILDER
            </div>
          </div>
        </div>
      </section>

      {/* Styled JSX/CSS Injector for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      ` }} />
    </main>
  );
}