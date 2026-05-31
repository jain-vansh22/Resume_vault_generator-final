"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import TechBackground from "@/components/TechBackground";
import TiltCard from "@/components/TiltCard";

interface CompanyDetail {
  name: string;
  domain: string;
  letter: string;
  color: string;
  glow: string;
  tagline: string;
  focus: string[];
  formula: string;
  description: string;
  logo: string;
  logoBg: string;
  wireframe: {
    sections: {
      title: string;
      content: string;
      glow?: boolean;
    }[];
  };
}

const companies: CompanyDetail[] = [
  {
    name: "Google",
    domain: "google.com",
    letter: "G",
    color: "#4285F4",
    glow: "rgba(66, 133, 244, 0.4)",
    tagline: "Algorithmic Precision & Scale",
    focus: ["Data Structures & Algorithms", "Systems Programming (C++, Go, Java)", "Quantitative Scale Metrics"],
    formula: "Google XYZ Formula: 'Accomplished [X] as measured by [Y], by doing [Z]'",
    description: "Google looks for deep computer science fundamentals, clear systems ownership, and measurable impact using quantitative metrics.",
    logo: "/logos/google.jpg",
    logoBg: "#000000",
    wireframe: {
      sections: [
        { title: "HEADER & CS FOUNDATIONS", content: "Name | Contact | GitHub | Education: BS/MS Computer Science" },
        { title: "TECHNICAL EXPERTISE", content: "Languages: C++, Go, Java, Python | Systems: Distributed Systems, MapReduce, gRPC", glow: true },
        { title: "QUANTITATIVE IMPACT PROJECTS", content: "• Optimized database query layer (Z), reducing service latency by 32% (Y) across 4M active user connections (X).\n• Re-architected log processing daemon (Z), preventing 99.9% of memory leaks (Y) on 500+ container nodes (X)." }
      ]
    }
  },
  {
    name: "Meta",
    domain: "meta.com",
    letter: "M",
    color: "#0668E1",
    glow: "rgba(6, 104, 225, 0.4)",
    tagline: "Product Speed & End-to-End Ownership",
    focus: ["Web/Mobile Velocity", "Full-Stack Scale (React, Relay, Hack)", "Open Source Contributions"],
    formula: "Velocity Metric: 'Shipped [Feature] to [Scale] within [Aggressive Timeline]'",
    description: "Meta values engineering speed, product-minded thinking, and cross-functional capacity to build applications from scratch.",
    logo: "/logos/meta.jpg",
    logoBg: "#000000",
    wireframe: {
      sections: [
        { title: "HEADER & HIGH VELOCITY BIO", content: "Name | Email | Portfolio | GitHub" },
        { title: "CORE SKILLS", content: "React, Relay, React Native, Rust, PHP/Hack, GraphQL, System Design", glow: true },
        { title: "PRODUCT SHIPPED & METRICS", content: "• Designed and deployed real-time newsfeed recommendation engine, boosting daily active session duration by 18%.\n• Rewrote legacy client state framework, reducing initial application bundle payload weight by 245KB." }
      ]
    }
  },
  {
    name: "Apple",
    domain: "apple.com",
    letter: "A",
    color: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.4)",
    tagline: "Meticulous Craftsmanship & Hardware Integration",
    focus: ["System Level Coding (Swift, C, Rust)", "Hardware/Software Co-Design", "Security & User Privacy"],
    formula: "Craftsmanship Focus: 'Architected [Secure Component] with [Zero Leakage/Maximum Efficiency]'",
    description: "Apple values design aesthetics, meticulous attention to system memory management, performance craftsmanship, and security.",
    logo: "/logos/apple.jpg",
    logoBg: "#FFFFFF",
    wireframe: {
      sections: [
        { title: "HEADER & BIO", content: "Name | Mobile | Location | Technical Specialization" },
        { title: "LOW-LEVEL CAPABILITIES", content: "Swift, Objective-C, Assembly, C, Metal API, CoreAudio, Embedded Systems", glow: true },
        { title: "SYSTEM ARCHITECTURE", content: "• Implemented system-level cryptographic routines on customized secure enclave processor core, ensuring zero side-channel leakage.\n• Refined image processing engine pipeline via Metal shaders, securing smooth 120Hz frame rates." }
      ]
    }
  },
  {
    name: "Amazon",
    domain: "amazon.com",
    letter: "a",
    color: "#FF9900",
    glow: "rgba(255, 153, 0, 0.4)",
    tagline: "Ownership, Leadership, & Cloud Autonomy",
    focus: ["AWS Native Architecture", "Microservice Reliability", "Amazon Leadership Principles"],
    formula: "Leadership Focus: 'Owned [Service Domain] at [Scale] to Optimize [Cost / Operation Efficiency]'",
    description: "Amazon evaluates applicants heavily on their Leadership Principles (Ownership, Customer Obsession) and ability to deploy scalable AWS systems.",
    logo: "/logos/amazon.jpg",
    logoBg: "#FFFFFF",
    wireframe: {
      sections: [
        { title: "HEADER & LEADERSHIP BIO", content: "Name | Contact | AWS Certifications | Domain ownership statement" },
        { title: "CLOUD STACK", content: "Java, Node.js, AWS (DynamoDB, ECS, Lambda, CloudFront), Terraform", glow: true },
        { title: "OWNERSHIP & OPERATIONAL EXCELLENCE", content: "• Audited legacy EC2 server fleet and migrated to serverless ECS Fargate, cutting operational overhead costs by $140K/year.\n• Managed cross-team deployment of unified API gateway, scaling to sustain 45,000 requests per second." }
      ]
    }
  },
  {
    name: "Netflix",
    domain: "netflix.com",
    letter: "N",
    color: "#E50914",
    glow: "rgba(229, 9, 20, 0.4)",
    tagline: "Autonomous Execution & Chaos Engineering",
    focus: ["Chaos Engineering & Fault Tolerance", "Media Streaming Protocols (HLS, DASH)", "High Autonomy (Freedom & Responsibility)"],
    formula: "Fault Tolerance Formula: 'Engineered [Resilient Service] to handle [Failure Scenario] with [Zero Customer Interruption]'",
    description: "Netflix screens for strong product-centric developers who thrive in low-process environments and write highly resilient code.",
    logo: "/logos/netflix.jpg",
    logoBg: "#000000",
    wireframe: {
      sections: [
        { title: "HEADER & HIGH AUTONOMY BIO", content: "Name | Email | Specialized systems engineering portfolio link" },
        { title: "RESILIENCY STACK", content: "Java, Spring Cloud, Node.js, WebRTC, RxJS, Chaos Kong, Docker, Kubernetes", glow: true },
        { title: "CHAOS & RESILIENCE SYSTEMS", content: "• Configured Chaos Monkey instances to test service group failovers, maintaining 99.999% availability during region blackouts.\n• Developed custom video transcoding filter algorithms, reducing packet loss artifacting by 14% on networks under 1.5Mbps." }
      ]
    }
  }
];

export default function StandardsPage() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const selectedCompany = companies[selectedIdx];

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-x-hidden selection:bg-[var(--accent)] selection:text-white transition-colors duration-500 py-16 px-4">
      <ThemeToggle />
      <TechBackground />

      <div className="container mx-auto max-w-5xl relative z-10">
        
        {/* Header and Back navigation */}
        <header className="mb-12 relative flex flex-col items-center text-center">
          <Link 
            href="/portfolio" 
            className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[var(--accent)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Vault
          </Link>

          <span className="inline-block px-3 py-1 rounded-full border border-[var(--glass-border)] bg-[var(--accent-glow)] text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-3">
            Elite Alignment Standards
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase bg-gradient-to-r from-[var(--foreground)] via-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            FAANG / MAANG Resume Templates
          </h1>
          <p className="mt-2 text-[var(--text-muted)] max-w-xl text-sm leading-relaxed">
            Click on a company node to project their ideal architectural resume wireframe, core technical focus domains, and metric templates.
          </p>
        </header>

        {/* 3D Company Node Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
          {companies.map((comp, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={comp.name}
                onClick={() => setSelectedIdx(idx)}
                className="text-left w-full focus:outline-none"
              >
                <TiltCard 
                  className={`w-full p-6 border rounded-2xl bg-[var(--glass-bg)] backdrop-blur-md transition-all duration-300 relative group cursor-pointer ${
                    isSelected 
                      ? "border-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]" 
                      : "border-[var(--glass-border)] hover:border-gray-500"
                  }`}
                >
                  {/* Floating light ray accent */}
                  <div 
                    className="absolute -top-12 -left-12 w-24 h-24 rounded-full filter blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    style={{ backgroundColor: comp.color }}
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <div 
                      className="w-16 h-16 flex items-center justify-center mb-3 rounded-2xl p-2 border shadow-inner transition-all duration-300 overflow-hidden"
                      style={{ 
                        backgroundColor: comp.logoBg,
                        borderColor: comp.logoBg === '#FFFFFF' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <img 
                        src={comp.logo} 
                        alt={`${comp.name} Logo`} 
                        className="w-12 h-12 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest block text-[var(--foreground)] mt-1">
                      {comp.name}
                    </span>
                  </div>
                </TiltCard>
              </button>
            );
          })}
        </div>

        {/* Interactive Holographic Wireframe Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Requirements & Guidelines */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="space-y-6">
              <div className="border-b border-[var(--glass-border)] pb-4">
                <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-widest block">
                  Evaluation Strategy
                </span>
                <h2 className="text-2xl font-extrabold uppercase mt-1">
                  {selectedCompany.name} Target Criteria
                </h2>
                <p className="text-xs text-[var(--accent)] font-semibold mt-1 tracking-wide italic">
                  {selectedCompany.tagline}
                </p>
              </div>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {selectedCompany.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Primary Tech Vectors:
                </h4>
                <ul className="space-y-2">
                  {selectedCompany.focus.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedCompany.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--input-bg)] p-4 shadow-inner">
                <span className="text-[9px] font-mono font-bold text-yellow-500 uppercase tracking-widest block mb-1">
                  Key Bullet Formula
                </span>
                <p className="text-xs text-[var(--foreground)] font-mono leading-relaxed">
                  {selectedCompany.formula}
                </p>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[var(--text-muted)] pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
              <span>MODULE: STANDARDS_V1</span>
              <span>NODE STATUS: SECURE</span>
            </div>
          </div>

          {/* Right Column: Holographic Document Wireframe */}
          <div className="lg:col-span-7 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient holographic scans line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60 animate-pulse" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: selectedCompany.color }} />
                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    Holographic Resume Blueprint
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
                  {selectedCompany.name}_format.wire
                </span>
              </div>

              {/* Wireframe Body Container */}
              <div className="space-y-4 font-mono text-xs">
                {selectedCompany.wireframe.sections.map((sec, i) => (
                  <div 
                    key={i} 
                    className={`rounded-xl border p-4 transition-all duration-300 ${
                      sec.glow 
                        ? "border-[var(--accent)] bg-[var(--accent-glow)]/10 shadow-[0_0_15px_var(--accent-glow)]" 
                        : "border-[var(--glass-border)] bg-[var(--input-bg)]"
                    }`}
                  >
                    <span 
                      className="text-[9px] font-bold uppercase tracking-widest block mb-2"
                      style={{ color: sec.glow ? "var(--accent)" : "var(--text-muted)" }}
                    >
                      {sec.title}
                    </span>
                    <p className="text-[11px] text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-4 border-t border-[var(--glass-border)]">
              <span>PERSPECTIVE: GRID_AUTO</span>
              <span>RENDERED: COMPLETED</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
