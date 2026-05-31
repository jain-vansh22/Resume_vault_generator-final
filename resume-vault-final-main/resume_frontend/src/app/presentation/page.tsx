"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import TechBackground from "@/components/TechBackground";

interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

interface ExperienceItem {
  company: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  bullets: string[];
}

interface ProjectItem {
  name: string;
  tech_stack: string[];
  description: string;
  bullets: string[];
  github: string;
  live?: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

interface ResumeData {
  candidate_name: string;
  contact: ContactInfo;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: string[];
  achievements: string[];
}

const defaultProfile: ResumeData = {
  candidate_name: "Alex Mercer",
  contact: {
    email: "alex.mercer@vault-tech.io",
    phone: "+1 (555) 019-2834",
    linkedin: "linkedin.com/in/alex-mercer",
    github: "github.com/alex-mercer",
  },
  summary: "Highly skilled Software Engineer specialized in developing high-performance web applications and distributed database architectures. Adept at full-stack integration, system optimization, and implementing modern technical architectures.",
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL", "Three.js", "PostgreSQL", "AWS", "Docker"],
  experience: [
    {
      company: "Vault Tech Solutions",
      title: "Senior Full-Stack Engineer",
      start_date: "2023-01",
      end_date: "Present",
      location: "San Francisco, CA",
      bullets: [
        "Led the migration of a legacy platform to Next.js and Tailwind CSS, improving load speed by 42%.",
        "Architected high-throughput microservices using TypeScript and Node.js, servicing over 10M daily requests.",
        "Orchestrated robust CI/CD pipelines deploying Docker containers to AWS ECS cluster instances."
      ]
    },
    {
      company: "Innovate Labs",
      title: "Software Developer",
      start_date: "2022-06",
      end_date: "2022-12",
      location: "Boston, MA",
      bullets: [
        "Collaborated with product designers to construct responsive front-end dashboard modules using React.",
        "Reduced database fetch latency by 20% by refactoring PostgreSQL indexes and query paths."
      ]
    }
  ],
  projects: [
    {
      name: "Secure Decentralized File Vault",
      tech_stack: ["TypeScript", "Next.js", "Tailwind CSS", "Web3", "IPFS"],
      description: "A secure, client-side encrypted vault utilizing decentralized storage systems for file versioning.",
      bullets: [
        "Designed responsive custom user interfaces with Tailwind CSS and backdrop-blur glassmorphic accents.",
        "Integrated state management syncing vault logs across multiple open browser contexts."
      ],
      github: "github.com/vault/decentralized-vault",
      live: "vault-tech.io/vault"
    },
    {
      name: "Real-time Telemetry Dashboard",
      tech_stack: ["React", "Node.js", "WebSockets", "Chart.js"],
      description: "Live analytics system visualizing server workloads and memory maps dynamically.",
      bullets: [
        "Implemented real-time WebSocket communication layer to handle rapid telemetry updates.",
        "Optimized layout responsiveness supporting low-power screen configurations."
      ],
      github: "github.com/vault/telemetry-dash"
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "B.S. in Computer Science",
      year: "2022"
    }
  ],
  certifications: ["AWS Certified Solutions Architect", "Certified ScrumMaster (CSM)"],
  achievements: []
};

function ScrollSection({ children, id, className = "" }: { children: React.ReactNode; id: string; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      id={id}
      ref={sectionRef}
      className={`min-h-screen flex flex-col justify-center py-20 px-6 md:px-12 transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function PresentationPage() {
  const [profile, setProfile] = useState<ResumeData>(defaultProfile);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data && data.candidate_name) {
            setProfile(data as ResumeData);
          }
        }
      } catch (err) {
        console.warn("Failed to load saved profile, using fallback default profile.");
      }
    };
    void loadProfile();

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeSections = [
    { id: "hero", show: true, label: "Hero" },
    { id: "skills", show: profile.skills && profile.skills.length > 0 && profile.skills.some(s => s && s.trim() !== ""), label: "Skills" },
    { id: "experience", show: profile.experience && profile.experience.length > 0 && profile.experience.some(e => e.company && e.company.trim() !== ""), label: "Experience" },
    { id: "projects", show: profile.projects && profile.projects.length > 0 && profile.projects.some(p => p.name && p.name.trim() !== ""), label: "Projects" },
    { id: "education", show: profile.education && profile.education.length > 0 && profile.education.some(edu => edu.institution && edu.institution.trim() !== ""), label: "Education" },
  ].filter(s => s.show);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-x-hidden selection:bg-[var(--accent)] selection:text-white transition-colors duration-500">
      <ThemeToggle />
      <TechBackground />

      {/* Scrollytelling Top Progress Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link 
          href="/portfolio" 
          className="flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[var(--accent)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Return to Vault
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
          Dynamic Scrollytelling Presentation
        </span>
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-500 transition-all duration-75" style={{ width: `${scrollProgress}%` }} />
      </nav>

      {/* Floating Section Index Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full p-2 backdrop-blur-md">
        {activeSections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" })}
            className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)] hover:bg-[var(--accent)] transition-all duration-300"
            title={`Go to ${sec.label}`}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        
        {/* Section 1: Hero Section (Name & Summary) */}
        <ScrollSection id="hero" className="items-center text-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full border border-[var(--glass-border)] bg-[var(--accent-glow)] text-[var(--accent)] text-xs font-bold uppercase tracking-wider">
              Secure Profile Node
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--foreground)] via-[var(--accent)] to-purple-500 bg-clip-text text-transparent pb-2 uppercase">
              {profile.candidate_name}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-[var(--text-muted)]">
              <span>{profile.contact.email}</span>
              <span>•</span>
              <span>{profile.contact.phone}</span>
              {profile.contact.linkedin && (
                <>
                  <span>•</span>
                  <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition">
                    LinkedIn
                  </a>
                </>
              )}
              {profile.contact.github && (
                <>
                  <span>•</span>
                  <a href={`https://${profile.contact.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition">
                    GitHub
                  </a>
                </>
              )}
            </div>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-muted)] leading-relaxed font-light text-justify md:text-center pt-4">
              {profile.summary}
            </p>
            <div className="pt-8 animate-bounce">
              <button onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })} className="text-[var(--accent)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollSection>

        {/* Section 2: Technical Skills Grid */}
        {activeSections.some(s => s.id === "skills") && (
          <ScrollSection id="skills">
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-bold">Capabilities Mapping</span>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase mt-1">Core Competencies</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profile.skills.filter(s => s && s.trim() !== "").map((skill, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 text-center shadow-lg backdrop-blur-md hover:scale-[1.03] transition-all duration-300"
                  style={{
                    animationDelay: `${idx * 100}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-sm font-semibold tracking-wide block group-hover:text-[var(--accent)] transition-colors duration-300">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>
        )}

        {/* Section 3: Professional Journey (Experience) */}
        {activeSections.some(s => s.id === "experience") && (
          <ScrollSection id="experience">
          <div className="space-y-12 relative">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-bold">Career Progression</span>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase mt-1">Professional Journey</h2>
            </div>

            {/* Glowing Vertical Timeline Laser Line */}
            <div className="absolute left-4 md:left-1/2 top-32 bottom-4 w-[2px] bg-gradient-to-b from-[var(--accent)] via-purple-500 to-transparent shadow-[0_0_8px_var(--accent-glow)]" />

            <div className="space-y-12">
              {profile.experience
                .filter(e => e && ((e.title && e.title.trim() !== "") || (e.company && e.company.trim() !== "")))
                .map((exp, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-stretch md:justify-between relative ${
                    idx % 2 === 0 ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Intersection Node */}
                  <div className="absolute left-[9px] md:left-1/2 md:-translate-x-1/2 top-4 w-4 h-4 rounded-full border-2 border-[var(--accent)] bg-[var(--background)] z-10 shadow-[0_0_8px_var(--accent-glow)]" />

                  {/* Experience Card */}
                  <div className="w-full md:w-[45%] ml-10 md:ml-0 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-shadow duration-300">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)]">{exp.start_date} — {exp.end_date}</span>
                    <h3 className="text-lg font-bold mt-1 text-[var(--foreground)]">{exp.title}</h3>
                    <h4 className="text-xs text-[var(--text-muted)] font-medium mb-3">{exp.company} | {exp.location}</h4>
                    
                    <ul className="space-y-2 text-xs text-[var(--text-muted)] leading-relaxed">
                      {exp.bullets
                        .filter(b => b && b.trim() !== "")
                        .map((bullet, bIdx) => (
                        <li key={bIdx} className="flex gap-2">
                          <span className="text-[var(--accent)]">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Empty Spacer Column for Desktop */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>
        )}

        {/* Section 4: Project Deck Showcases */}
        {activeSections.some(s => s.id === "projects") && (
          <ScrollSection id="projects">
          <div className="space-y-12">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-bold">Engineering Portfolio</span>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase mt-1">Interactive Showcases</h2>
            </div>

            <div className="space-y-8">
              {profile.projects
                .filter(p => p && p.name && p.name.trim() !== "")
                .map((proj, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-xl backdrop-blur-xl hover:shadow-[0_0_30px_var(--accent-glow)] transition-all duration-500 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">{proj.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.tech_stack
                          .filter(t => t && t.trim() !== "")
                          .map((tech, tIdx) => (
                          <span key={tIdx} className="px-2.5 py-0.5 rounded-full border border-[var(--glass-border)] bg-[var(--input-bg)] text-[var(--accent)] text-[10px] font-bold tracking-wide">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs font-mono">
                      {proj.github && (
                        <a href={`https://${proj.github}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg border border-[var(--glass-border)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-300">
                          Code
                        </a>
                      )}
                      {proj.live && (
                        <a href={`https://${proj.live}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition">
                          Live
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{proj.description}</p>

                  <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                    {proj.bullets
                      .filter(b => b && b.trim() !== "")
                      .map((bullet, bIdx) => (
                      <li key={bIdx} className="flex gap-2.5">
                        <span className="text-[var(--accent)] font-semibold">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>
        )}

        {/* Section 5: Credentials & Education */}
        {activeSections.some(s => s.id === "education") && (
          <ScrollSection id="education" className="items-center text-center">
          <div className="space-y-12 w-full">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-bold">Academic Verification</span>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase mt-1">Education & Certifications</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              {/* Education Column */}
              <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-lg backdrop-blur-md">
                <h3 className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-4 border-b border-[var(--glass-border)] pb-2">Academic Degree</h3>
                {profile.education
                  .filter(edu => edu && ((edu.degree && edu.degree.trim() !== "") || (edu.institution && edu.institution.trim() !== "")))
                  .map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-lg font-bold text-[var(--foreground)]">{edu.degree}</h4>
                    <p className="text-sm text-[var(--text-muted)]">{edu.institution}</p>
                    <span className="inline-block text-xs font-semibold text-[var(--text-muted)] bg-[var(--input-bg)] px-2 py-0.5 rounded border border-[var(--glass-border)] mt-2">Class of {edu.year}</span>
                  </div>
                ))}
              </div>

              {/* Certifications Column */}
              <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-lg backdrop-blur-md">
                <h3 className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-4 border-b border-[var(--glass-border)] pb-2">Credentials</h3>
                <ul className="space-y-3">
                  {profile.certifications
                    .filter(c => c && c.trim() !== "")
                    .map((cert, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110.5 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0113.5 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>


          </div>
        </ScrollSection>
        )}

        {/* Universal Footer Return Button */}
        <div className="pt-12 pb-20 text-center no-print">
          <Link 
            href="/portfolio" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white font-semibold text-sm tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Return to Portfolio Vault
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
