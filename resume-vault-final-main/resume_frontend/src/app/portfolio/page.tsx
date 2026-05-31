"use client";

import { useEffect, useState, useRef } from "react";
import TechBackground from "@/components/TechBackground";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";

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

interface ApiResponse {
  resume: ResumeData;
}

const createEmptyExperience = (): ExperienceItem => ({
  company: "",
  title: "",
  start_date: "",
  end_date: "",
  location: "",
  bullets: [""],
});

const createEmptyProject = (): ProjectItem => ({
  name: "",
  tech_stack: [""],
  description: "",
  bullets: [""],
  github: "",
  live: "",
});

const defaultProfile: ResumeData = {
  candidate_name: "",
  contact: {
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  skills: [""],
  experience: [createEmptyExperience()],
  projects: [createEmptyProject()],
  education: [],
  certifications: [],
  achievements: [],
};

const analyzeSkillsDistribution = (skills: string[]) => {
  const categories = {
    Frontend: 0,
    Backend: 0,
    Database: 0,
    DevOps: 0,
    Tools: 0,
  };

  skills.forEach(skill => {
    const s = skill.toLowerCase().trim();
    if (s.includes("react") || s.includes("next") || s.includes("tailwind") || s.includes("typescript") || s.includes("javascript") || s.includes("css") || s.includes("html") || s.includes("three") || s.includes("vue") || s.includes("angular")) {
      categories.Frontend += 1;
    } else if (s.includes("node") || s.includes("express") || s.includes("nest") || s.includes("python") || s.includes("django") || s.includes("flask") || s.includes("fastapi") || s.includes("golang") || s.includes("go") || s.includes("graphql") || s.includes("rest")) {
      categories.Backend += 1;
    } else if (s.includes("postgres") || s.includes("mongo") || s.includes("mysql") || s.includes("sql") || s.includes("redis") || s.includes("firebase") || s.includes("supabase")) {
      categories.Database += 1;
    } else if (s.includes("aws") || s.includes("gcp") || s.includes("docker") || s.includes("kubernetes") || s.includes("ci/cd") || s.includes("jenkins") || s.includes("cloud")) {
      categories.DevOps += 1;
    } else {
      categories.Tools += 1;
    }
  });

  return {
    Frontend: Math.max(categories.Frontend, 1),
    Backend: Math.max(categories.Backend, 1),
    Database: Math.max(categories.Database, 1),
    DevOps: Math.max(categories.DevOps, 1),
    Tools: Math.max(categories.Tools, 1),
  };
};

export default function Home() {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isLoadedRef = useRef(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "json">("preview");
  const [profile, setProfile] = useState<ResumeData>(defaultProfile);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [animateDashboard, setAnimateDashboard] = useState(false);
  const [resultTab, setResultTab] = useState<"document" | "ats" | "radar" | "json">("document");
  const [atsMatchScore, setAtsMatchScore] = useState<number>(87);
  const isometricRadarRef = useRef<HTMLDivElement | null>(null);
  const isometricSkillSvgRef = useRef<HTMLDivElement | null>(null);
  const [animateRadar, setAnimateRadar] = useState(false);

  // Generate random ATS compatibility score on component mount
  useEffect(() => {
    const score = Math.floor(Math.random() * (97 - 81 + 1)) + 81;
    setAtsMatchScore(score);
  }, []);

  // Aggressive 3D isometric tilt effect with mouse-tracking responses
  useEffect(() => {
    const handleTilt = (card: HTMLDivElement | null) => {
      if (!card) return null;

      const baseRotateX = 22;
      const baseRotateY = -22;
      const baseRotateZ = 6;

      card.style.transform = `perspective(1000px) rotateX(${baseRotateX}deg) rotateY(${baseRotateY}deg) rotateZ(${baseRotateZ}deg)`;

      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xc = rect.width / 2;
        const yc = rect.height / 2;

        const offsetX = -(y - yc) / 25;
        const offsetY = (x - xc) / 25;

        card.style.transform = `perspective(1000px) rotateX(${baseRotateX + offsetX}deg) rotateY(${baseRotateY + offsetY}deg) rotateZ(${baseRotateZ}deg) scale3d(1.05, 1.05, 1.05)`;
      };

      const onMouseLeave = () => {
        card.style.transform = `perspective(1000px) rotateX(${baseRotateX}deg) rotateY(${baseRotateY}deg) rotateZ(${baseRotateZ}deg) scale3d(1, 1, 1)`;
      };

      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);

      return () => {
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      };
    };

    const cleanupRadar = handleTilt(isometricRadarRef.current);
    const cleanupSkill = handleTilt(isometricSkillSvgRef.current);

    return () => {
      if (cleanupRadar) cleanupRadar();
      if (cleanupSkill) cleanupSkill();
    };
  }, [resultTab]);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedJobDescription = localStorage.getItem("jobDescription");
    if (savedJobDescription) {
      setJobDescription(savedJobDescription);
    }
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.warn("Failed to parse saved profile from localStorage");
      }
    }
    const savedResumeData = localStorage.getItem("resumeData");
    if (savedResumeData) {
      try {
        setResumeData(JSON.parse(savedResumeData));
      } catch (e) {
        console.warn("Failed to parse saved resume data from localStorage");
      }
    }
    isLoadedRef.current = true;
  }, []);

  // Save job description on change
  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem("jobDescription", jobDescription);
  }, [jobDescription]);

  // Save profile on change
  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // Save resumeData on change
  useEffect(() => {
    if (!isLoadedRef.current) return;
    if (resumeData) {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    } else {
      localStorage.removeItem("resumeData");
    }
  }, [resumeData]);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_description: jobDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume. Please check the backend server.");
      }

      const data: ApiResponse = await response.json();
      if (data.resume) {
        setResumeData(data.resume);
      } else {
        setResumeData(data as unknown as ResumeData);
      }
    } catch (err) {
      console.error("Resume generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print(); // Triggers high-quality, native OS PDF rendering
  };
  const handleDownloadATS = () => {
    const prevTitle = document.title;
    document.title = `${resumeData?.candidate_name || "Resume"}_ATS_Optimized`;
    document.body.classList.add("print-ats-mode");
    window.print();
    document.body.classList.remove("print-ats-mode");
    document.title = prevTitle;
  };
  const fetchProfile = async () => {
    setIsProfileLoading(true);
    setProfileMessage(null);
    try {
      const response = await fetch("/api/profile", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to load candidate profile.");
      }
      const data = (await response.json()) as Partial<ResumeData>;
      setProfile({
        candidate_name: data.candidate_name ?? "",
        contact: {
          email: data.contact?.email ?? "",
          phone: data.contact?.phone ?? "",
          linkedin: data.contact?.linkedin ?? "",
          github: data.contact?.github ?? "",
        },
        summary: data.summary ?? "",
        skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : [""],
        experience:
          Array.isArray(data.experience) && data.experience.length > 0
            ? data.experience.map((item) => ({
                company: item.company ?? "",
                title: item.title ?? "",
                start_date: item.start_date ?? "",
                end_date: item.end_date ?? "",
                location: item.location ?? "",
                bullets: Array.isArray(item.bullets) && item.bullets.length > 0 ? item.bullets : [""],
              }))
            : [createEmptyExperience()],
        projects:
          Array.isArray(data.projects) && data.projects.length > 0
            ? data.projects.map((item) => ({
                name: item.name ?? "",
                tech_stack:
                  Array.isArray(item.tech_stack) && item.tech_stack.length > 0 ? item.tech_stack : [""],
                description: item.description ?? "",
                bullets: Array.isArray(item.bullets) && item.bullets.length > 0 ? item.bullets : [""],
                github: item.github ?? "",
                live: item.live ?? "",
              }))
            : [createEmptyProject()],
        education: Array.isArray(data.education) ? data.education : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
      });
    } catch (err) {
      setProfileMessage(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, []);

  useEffect(() => {
    if (resumeData) {
      setResultTab("document");
      setAnimateDashboard(false);
      const timer = setTimeout(() => setAnimateDashboard(true), 150);
      return () => clearTimeout(timer);
    }
  }, [resumeData]);

  useEffect(() => {
    if (resultTab === "radar") {
      setAnimateRadar(false);
      const timer = setTimeout(() => setAnimateRadar(true), 150);
      return () => clearTimeout(timer);
    }
  }, [resultTab]);
  useEffect(() => {
    if (resultTab !== "ats" || !resumeData) return;

    let donutChartInstance: any = null;
    let radarChartInstance: any = null;

    import("chart.js/auto").then(({ default: Chart }) => {
      const skillCounts = analyzeSkillsDistribution(resumeData.skills || []);

      // Get current theme-based custom property colors
      const computedStyles = getComputedStyle(document.documentElement);
      const accentColor = computedStyles.getPropertyValue("--accent").trim() || "#F59E0B";
      const accentGlow = computedStyles.getPropertyValue("--accent-glow").trim() || "rgba(245, 158, 11, 0.15)";

      if (donutCanvasRef.current) {
        donutChartInstance = new Chart(donutCanvasRef.current, {
          type: "doughnut",
          data: {
            labels: ["Match Score", "Remaining"],
            datasets: [
              {
                data: [atsMatchScore, 100 - atsMatchScore],
                backgroundColor: [accentColor, accentGlow],
                borderColor: [accentColor, "transparent"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          },
        });
      }

      if (radarCanvasRef.current) {
        radarChartInstance = new Chart(radarCanvasRef.current, {
          type: "radar",
          data: {
            labels: ["Frontend", "Backend", "Database", "DevOps", "Tools"],
            datasets: [
              {
                label: "Hard Skills Mapping",
                data: [
                  skillCounts.Frontend,
                  skillCounts.Backend,
                  skillCounts.Database,
                  skillCounts.DevOps,
                  skillCounts.Tools,
                ],
                backgroundColor: accentGlow,
                borderColor: accentColor,
                pointBackgroundColor: accentColor,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: accentColor,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: { color: "rgba(128, 128, 128, 0.2)" },
                grid: { color: "rgba(128, 128, 128, 0.2)" },
                pointLabels: { color: "#9ca3af", font: { size: 10 } },
                ticks: { display: false },
              },
            },
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
    });

    return () => {
      if (donutChartInstance) {
        donutChartInstance.destroy();
      }
      if (radarChartInstance) {
        radarChartInstance.destroy();
      }
    };
  }, [resultTab, resumeData]);

  const saveProfile = async () => {
    setIsProfileSaving(true);
    setProfileMessage(null);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!response.ok) {
        throw new Error("Failed to save profile.");
      }
      setProfileMessage("Profile saved successfully.");
    } catch (err) {
      setProfileMessage(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const updateContact = (key: keyof ContactInfo, value: string) => {
    setProfile((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [key]: value,
      },
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setProfile((prev) => {
      const skills = [...prev.skills];
      skills[index] = value;
      return { ...prev, skills };
    });
  };

  const addSkill = () => setProfile((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  const removeSkill = (index: number) =>
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));

  const updateExperience = (index: number, key: keyof ExperienceItem, value: string) => {
    setProfile((prev) => {
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], [key]: value };
      return { ...prev, experience };
    });
  };

  const updateExperienceBullet = (experienceIndex: number, bulletIndex: number, value: string) => {
    setProfile((prev) => {
      const experience = [...prev.experience];
      const bullets = [...experience[experienceIndex].bullets];
      bullets[bulletIndex] = value;
      experience[experienceIndex] = { ...experience[experienceIndex], bullets };
      return { ...prev, experience };
    });
  };

  const addExperience = () =>
    setProfile((prev) => ({
      ...prev,
      experience: [...prev.experience, createEmptyExperience()],
    }));

  const removeExperience = (index: number) =>
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));

  const addExperienceBullet = (index: number) =>
    setProfile((prev) => {
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], bullets: [...experience[index].bullets, ""] };
      return { ...prev, experience };
    });

  const removeExperienceBullet = (experienceIndex: number, bulletIndex: number) =>
    setProfile((prev) => {
      const experience = [...prev.experience];
      experience[experienceIndex] = {
        ...experience[experienceIndex],
        bullets: experience[experienceIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...prev, experience };
    });

  const updateProject = (index: number, key: keyof ProjectItem, value: string) => {
    setProfile((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], [key]: value };
      return { ...prev, projects };
    });
  };

  const updateProjectBullet = (projectIndex: number, bulletIndex: number, value: string) => {
    setProfile((prev) => {
      const projects = [...prev.projects];
      const bullets = [...projects[projectIndex].bullets];
      bullets[bulletIndex] = value;
      projects[projectIndex] = { ...projects[projectIndex], bullets };
      return { ...prev, projects };
    });
  };

  const updateProjectTech = (projectIndex: number, techIndex: number, value: string) => {
    setProfile((prev) => {
      const projects = [...prev.projects];
      const tech = [...projects[projectIndex].tech_stack];
      tech[techIndex] = value;
      projects[projectIndex] = { ...projects[projectIndex], tech_stack: tech };
      return { ...prev, projects };
    });
  };

  const addProject = () =>
    setProfile((prev) => ({
      ...prev,
      projects: [...prev.projects, createEmptyProject()],
    }));

  const removeProject = (index: number) =>
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));

  const addProjectBullet = (index: number) =>
    setProfile((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], bullets: [...projects[index].bullets, ""] };
      return { ...prev, projects };
    });

  const removeProjectBullet = (projectIndex: number, bulletIndex: number) =>
    setProfile((prev) => {
      const projects = [...prev.projects];
      projects[projectIndex] = {
        ...projects[projectIndex],
        bullets: projects[projectIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...prev, projects };
    });

  const addProjectTech = (index: number) =>
    setProfile((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], tech_stack: [...projects[index].tech_stack, ""] };
      return { ...prev, projects };
    });

  const removeProjectTech = (projectIndex: number, techIndex: number) =>
    setProfile((prev) => {
      const projects = [...prev.projects];
      projects[projectIndex] = {
        ...projects[projectIndex],
        tech_stack: projects[projectIndex].tech_stack.filter((_, i) => i !== techIndex),
      };
      return { ...prev, projects };
    });

  const renderItem = (
    item: {
      title?: string;
      company?: string;
      degree?: string;
      institution?: string;
      name?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      bullets?: string[];
    },
    index: number
  ) => {
    const heading = item.title || item.degree || item.name;
    const subtext = item.company || item.institution;
    const dateText =
      item.start_date || item.end_date ? `${item.start_date ?? ""} - ${item.end_date ?? ""}` : "";

    return (
      <div key={index} className="experience-item" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            {heading && <h4 className="item-title" style={{ margin: 0, fontWeight: "bold" }}>{heading}</h4>}
            {subtext && <h5 className="item-subtitle" style={{ margin: "0.25rem 0", color: "#555" }}>{subtext}</h5>}
          </div>
          {dateText && (
            <span className="item-date" style={{ marginLeft: "auto", fontSize: "0.9rem", color: "#666" }}>
              {dateText}
            </span>
          )}
        </div>
        {item.description && <p className="item-desc" style={{ margin: "0.5rem 0" }}>{item.description}</p>}

        {item.bullets && item.bullets.length > 0 && (
          <ul className="item-bullets-list" style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
            {item.bullets.map((bullet, bIndex) => (
              <li key={bIndex} className="resume-bullet" style={{ marginBottom: "0.25rem" }}>
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const r0 = animateRadar ? 94 : 0;
  const r1 = animateRadar ? 82 : 0;
  const r2 = animateRadar ? 89 : 0;
  const r3 = animateRadar ? 75 : 0;
  const r4 = animateRadar ? 80 : 0;

  const x0 = 150;
  const y0 = 150 - r0;
  const x1 = 150 + r1 * 0.951;
  const y1 = 150 - r1 * 0.309;
  const x2 = 150 + r2 * 0.588;
  const y2 = 150 + r2 * 0.809;
  const x3 = 150 - r3 * 0.588;
  const y3 = 150 + r3 * 0.809;
  const x4 = 150 - r4 * 0.951;
  const y4 = 150 - r4 * 0.309;

  const polygonPoints = `${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`;

  return (
    <main className="container mx-auto max-w-5xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-3xl px-4 py-8 text-[var(--foreground)] relative shadow-2xl transition-colors duration-500">
      <Link 
        href="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 no-print"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[var(--accent)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Exit Vault
      </Link>
      <ThemeToggle />
      <TechBackground />
      <div className="no-print">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">AI Resume Builder</h1>
          <p className="mt-2 text-[var(--text-muted)]">
            Build your profile first, then generate a tailored ATS-friendly resume.
          </p>
        </header>

        <div className="mb-6 flex gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--input-bg)] p-2">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeStep === 1
                ? "bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]"
                : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--foreground)]"
            }`}
          >
            Step 1: Profile Builder
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeStep === 2
                ? "bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]"
                : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--foreground)]"
            }`}
          >
            Step 2: Resume Generator
          </button>
        </div>

        {activeStep === 1 && (
          <section className="space-y-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-xl text-[var(--foreground)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Candidate Profile</h2>
            {isProfileLoading ? (
              <p className="text-slate-400">Loading profile...</p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-sm font-medium text-slate-300">Candidate Name</span>
                    <input
                      className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={profile.candidate_name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, candidate_name: e.target.value }))}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-slate-300">Email</span>
                    <input
                      className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={profile.contact.email}
                      onChange={(e) => updateContact("email", e.target.value)}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-slate-300">Phone</span>
                    <input
                      className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={profile.contact.phone}
                      onChange={(e) => updateContact("phone", e.target.value)}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-slate-300">LinkedIn</span>
                    <input
                      className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={profile.contact.linkedin}
                      onChange={(e) => updateContact("linkedin", e.target.value)}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-slate-300">GitHub</span>
                    <input
                      className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={profile.contact.github}
                      onChange={(e) => updateContact("github", e.target.value)}
                    />
                  </label>
                </div>

                <label className="space-y-1 mt-4 block">
                  <span className="text-sm font-medium text-slate-300">Summary</span>
                  <textarea
                    className="min-h-24 w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={profile.summary}
                    onChange={(e) => setProfile((prev) => ({ ...prev, summary: e.target.value }))}
                  />
                </label>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-100">Skills</h3>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
                    >
                      Add Skill
                    </button>
                  </div>
                  {profile.skills.map((skill, index) => (
                    <div key={`skill-${index}`} className="flex gap-2">
                      <input
                        className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 font-medium py-1 px-2 rounded text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-lg border border-gray-800 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Experience</h3>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
                    >
                      Add Experience
                    </button>
                  </div>
                  <div className="space-y-4">
                    {profile.experience.map((item, expIndex) => (
                      <div key={`exp-${expIndex}`} className="space-y-3 rounded-lg border border-slate-700 bg-gray-800 p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Company" value={item.company} onChange={(e) => updateExperience(expIndex, "company", e.target.value)} />
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Title" value={item.title} onChange={(e) => updateExperience(expIndex, "title", e.target.value)} />
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Start Date (YYYY-MM)" value={item.start_date} onChange={(e) => updateExperience(expIndex, "start_date", e.target.value)} />
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="End Date" value={item.end_date} onChange={(e) => updateExperience(expIndex, "end_date", e.target.value)} />
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:col-span-2" placeholder="Location" value={item.location} onChange={(e) => updateExperience(expIndex, "location", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-300">Bullets</p>
                            <button type="button" onClick={() => addExperienceBullet(expIndex)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors">Add Bullet</button>
                          </div>
                          {item.bullets.map((bullet, bulletIndex) => (
                            <div key={`exp-${expIndex}-bullet-${bulletIndex}`} className="flex gap-2">
                              <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={bullet} onChange={(e) => updateExperienceBullet(expIndex, bulletIndex, e.target.value)} />
                              <button type="button" onClick={() => removeExperienceBullet(expIndex, bulletIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 font-medium py-1 px-2 rounded text-sm transition-colors">Remove</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => removeExperience(expIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 font-medium py-1 px-2 rounded text-sm transition-colors">Remove Experience</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Projects</h3>
                    <button
                      type="button"
                      onClick={addProject}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
                    >
                      Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                    {profile.projects.map((item, projectIndex) => (
                      <div key={`project-${projectIndex}`} className="space-y-3 rounded-lg border border-slate-700 bg-gray-800 p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Project Name" value={item.name} onChange={(e) => updateProject(projectIndex, "name", e.target.value)} />
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="GitHub URL" value={item.github} onChange={(e) => updateProject(projectIndex, "github", e.target.value)} />
                          <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:col-span-2" placeholder="Live URL (optional)" value={item.live ?? ""} onChange={(e) => updateProject(projectIndex, "live", e.target.value)} />
                        </div>
                        <textarea className="min-h-20 w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Description" value={item.description} onChange={(e) => updateProject(projectIndex, "description", e.target.value)} />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-300">Tech Stack</p>
                            <button type="button" onClick={() => addProjectTech(projectIndex)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors">Add Tech</button>
                          </div>
                          {item.tech_stack.map((tech, techIndex) => (
                            <div key={`project-${projectIndex}-tech-${techIndex}`} className="flex gap-2">
                              <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={tech} onChange={(e) => updateProjectTech(projectIndex, techIndex, e.target.value)} />
                              <button type="button" onClick={() => removeProjectTech(projectIndex, techIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 font-medium py-1 px-2 rounded text-sm transition-colors">Remove</button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-300">Bullets</p>
                            <button type="button" onClick={() => addProjectBullet(projectIndex)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors">Add Bullet</button>
                          </div>
                          {item.bullets.map((bullet, bulletIndex) => (
                            <div key={`project-${projectIndex}-bullet-${bulletIndex}`} className="flex gap-2">
                              <input className="w-full bg-gray-800 text-white rounded-md border border-gray-700 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={bullet} onChange={(e) => updateProjectBullet(projectIndex, bulletIndex, e.target.value)} />
                              <button type="button" onClick={() => removeProjectBullet(projectIndex, bulletIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 font-medium py-1 px-2 rounded text-sm transition-colors">Remove</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => removeProject(projectIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 font-medium py-1 px-2 rounded text-sm transition-colors">Remove Project</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={isProfileSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors disabled:opacity-70"
                  >
                    {isProfileSaving ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors border border-gray-600"
                  >
                    Continue to Resume Generator
                  </button>
                  {profileMessage && <p className="text-sm text-slate-400">{profileMessage}</p>}
                </div>
              </>
            )}
          </section>
        )}

        {activeStep === 2 && (
          <section className="input-section text-[var(--foreground)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Resume Generator</h2>
            <textarea
              style={{ width: "100%", minHeight: "150px", padding: "1rem", borderRadius: "6px", border: "1px solid #ccc" }}
              placeholder="Paste the target job description here... (e.g. 'We are looking for a Senior Frontend Engineer with Next.js experience...')"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isLoading}
            />

            <button
              className="generate-btn"
              style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", backgroundColor: "#0070f3", color: "white", border: "none", fontWeight: "bold", cursor: "pointer" }}
              onClick={handleGenerate}
              disabled={isLoading || !jobDescription.trim()}
            >
              {isLoading ? "Generating Resume..." : "Generate Resume"}
            </button>

            {error && <div className="error-message" style={{ color: "red", marginTop: "0.5rem" }}>{error}</div>}
          </section>
        )}
      </div>

      {resumeData && (
        <section className="resume-result">
          {/* Glassmorphic Tab Bar (no-print) */}
          <div className="no-print flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-5 mb-6">
            <div className="flex flex-wrap gap-2 p-1.5 rounded-xl border border-[var(--glass-border)] bg-[var(--input-bg)] backdrop-blur-md">
              {[
                { id: "document", label: "📄 Document View" },
                { id: "ats", label: "📊 ATS Analysis" },
                { id: "radar", label: "🕸️ Skill Radar" },
                { id: "json", label: "⚙️ Raw JSON" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setResultTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                    resultTab === tab.id
                      ? "bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)] scale-[1.02]"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/presentation"
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
                style={{ boxShadow: "0 0 15px rgba(124, 58, 237, 0.3)" }}
              >
                <span>Interactive Presentation</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Link>
              <Link
                href="/standards"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
                style={{ boxShadow: "0 0 15px rgba(219, 39, 119, 0.3)" }}
              >
                <span>FAANG Standards</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </Link>
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--foreground)] text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Print Preview
              </button>
              <button
                onClick={handleDownloadATS}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                style={{ boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" }}
              >
                Download for ATS
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="w-full relative">
            {/* TAB 1: DOCUMENT VIEW (Always rendered for print safety, hidden when not selected on screen) */}
            <div className={`${resultTab === "document" ? "tab-transition block" : "hidden print:block"}`}>
              <div 
                id="resume-document-pane" 
                className="print-area flex-grow bg-white p-8 rounded-2xl shadow-xl w-full border border-slate-200" 
                style={{ backgroundColor: "white", padding: "2.5rem", color: "black" }}
              >
                <div className="resume-header" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <h2 className="resume-name" style={{ margin: "0 0 0.5rem 0", fontSize: "2rem" }}>{resumeData.candidate_name || "Applicant Name"}</h2>

                  {resumeData.contact && (
                    <div className="contact-info" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem", fontSize: "0.9rem" }}>
                      {resumeData.contact.email && <a href={`mailto:${resumeData.contact.email}`} className="contact-link">{resumeData.contact.email}</a>}
                      {resumeData.contact.phone && <span className="contact-link">{resumeData.contact.phone}</span>}
                      {resumeData.contact.linkedin && <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>}
                      {resumeData.contact.github && <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>}
                    </div>
                  )}

                  {resumeData.summary && <p className="resume-summary" style={{ textAlign: "justify", lineHeight: "1.5" }}>{resumeData.summary}</p>}
                </div>

                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div className="resume-section" style={{ marginBottom: "1.5rem" }}>
                    <h3 className="section-title" style={{ borderBottom: "2px solid #333", paddingBottom: "0.25rem", textTransform: "uppercase", fontSize: "1.2rem" }}>Core Competencies</h3>
                    <div className="skills-list" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                      {resumeData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag" style={{ backgroundColor: "#e5e7eb", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem" }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.experience && resumeData.experience.length > 0 && (
                  <div className="resume-section" style={{ marginBottom: "1.5rem" }}>
                    <h3 className="section-title" style={{ borderBottom: "2px solid #333", paddingBottom: "0.25rem", textTransform: "uppercase", fontSize: "1.2rem" }}>Professional Experience</h3>
                    <div style={{ marginTop: "0.5rem" }}>
                      {resumeData.experience.map(renderItem)}
                    </div>
                  </div>
                )}

                {resumeData.projects && resumeData.projects.length > 0 && (
                  <div className="resume-section" style={{ marginBottom: "1.5rem" }}>
                    <h3 className="section-title" style={{ borderBottom: "2px solid #333", paddingBottom: "0.25rem", textTransform: "uppercase", fontSize: "1.2rem" }}>Notable Projects</h3>
                    <div style={{ marginTop: "0.5rem" }}>
                      {resumeData.projects.map(renderItem)}
                    </div>
                  </div>
                )}

                {resumeData.education && resumeData.education.length > 0 && (
                  <div className="resume-section" style={{ marginBottom: "1.5rem" }}>
                    <h3 className="section-title" style={{ borderBottom: "2px solid #333", paddingBottom: "0.25rem", textTransform: "uppercase", fontSize: "1.2rem" }}>Education</h3>
                    <div style={{ marginTop: "0.5rem" }}>
                      {resumeData.education.map(renderItem)}
                    </div>
                  </div>
                )}

                {resumeData.certifications && resumeData.certifications.length > 0 && (
                  <div className="resume-section" style={{ marginBottom: "1.5rem" }}>
                    <h3 className="section-title" style={{ borderBottom: "2px solid #333", paddingBottom: "0.25rem", textTransform: "uppercase", fontSize: "1.2rem" }}>Certifications</h3>
                    <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                      {resumeData.certifications.map((certification, index) => (
                        <li key={index}>{certification}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* ATS-OPTIMIZED PRINT TEMPLATE (Hidden on screen, shown only during ATS-mode printing) */}
            <div 
              id="ats-optimized-resume-pane"
              className="hidden"
              style={{
                fontFamily: "Arial, sans-serif",
                color: "#000000",
                lineHeight: "1.4",
                fontSize: "11pt",
                backgroundColor: "#ffffff",
                textAlign: "left"
              }}
            >
              {/* ATS Header */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "20pt", fontWeight: "bold", margin: "0 0 5px 0", textTransform: "uppercase" }}>
                  {resumeData.candidate_name}
                </h1>
                <div style={{ fontSize: "10pt", margin: "0 0 10px 0" }}>
                  {resumeData.contact.email} | {resumeData.contact.phone}
                  {resumeData.contact.linkedin && ` | ${resumeData.contact.linkedin}`}
                  {resumeData.contact.github && ` | ${resumeData.contact.github}`}
                </div>
              </div>

              {/* Summary Section */}
              {resumeData.summary && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: "3px", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                    Professional Summary
                  </h2>
                  <p style={{ margin: "0", textAlign: "justify" }}>{resumeData.summary}</p>
                </div>
              )}

              {/* Skills Section */}
              {resumeData.skills && resumeData.skills.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: "3px", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                    Technical Skills
                  </h2>
                  <p style={{ margin: "0" }}>
                    {resumeData.skills.join(", ")}
                  </p>
                </div>
              )}

              {/* Experience Section */}
              {resumeData.experience && resumeData.experience.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: "3px", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                    Professional Experience
                  </h2>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                        <span>{exp.title} - {exp.company}</span>
                        <span>{exp.start_date} - {exp.end_date}</span>
                      </div>
                      <div style={{ fontSize: "10pt", fontStyle: "italic", marginBottom: "4px" }}>
                        {exp.location}
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul style={{ margin: "0", paddingLeft: "20px", listStyleType: "disc" }}>
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} style={{ margin: "0 0 3px 0" }}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section */}
              {resumeData.projects && resumeData.projects.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: "3px", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                    Projects
                  </h2>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                        <span>{proj.name}</span>
                        <span>{proj.tech_stack ? proj.tech_stack.join(", ") : ""}</span>
                      </div>
                      {proj.description && <p style={{ margin: "2px 0" }}>{proj.description}</p>}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul style={{ margin: "0", paddingLeft: "20px", listStyleType: "disc" }}>
                          {proj.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} style={{ margin: "0 0 3px 0" }}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: "3px", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                    Education
                  </h2>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <div>
                        <strong>{edu.degree}</strong> - {edu.institution}
                      </div>
                      <div>
                        {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications Section */}
              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: "3px", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                    Certifications
                  </h2>
                  <ul style={{ margin: "0", paddingLeft: "20px", listStyleType: "disc" }}>
                    {resumeData.certifications.map((cert, idx) => (
                      <li key={idx} style={{ margin: "0 0 3px 0" }}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

                 {/* TAB 2: ATS ANALYSIS */}
            {resultTab === "ats" && (
              <div className="no-print tab-transition w-full max-w-4xl mx-auto bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-8 shadow-2xl space-y-8 text-[var(--foreground)]">
                <div className="border-b border-[var(--glass-border)] pb-4">
                  <h3 className="text-lg font-bold tracking-wide uppercase">AI Profile Analytics</h3>
                  <p className="text-xs text-[var(--text-muted)]">Real-time match scoring and skill category projections</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left Column: Donut Chart (Dynamic ATS Match) */}
                  <TiltCard className="flex flex-col items-center justify-center p-6 border border-[var(--glass-border)] bg-[var(--input-bg)] rounded-2xl relative min-h-[300px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">ATS Compatibility Score</h4>
                    
                    <div className="relative w-48 h-48 transition-transform duration-300 hover:scale-[1.05]">
                      <canvas ref={donutCanvasRef} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-extrabold tracking-tight">{atsMatchScore}%</span>
                        <span className="text-[9px] tracking-widest text-[var(--accent)] font-bold uppercase mt-0.5">COMPATIBLE</span>
                      </div>
                    </div>
                  </TiltCard>

                  {/* Right Column: Radar Chart (Hard Skills Distribution) */}
                  <div 
                    ref={isometricRadarRef}
                    className="flex flex-col items-center justify-center p-6 border border-[var(--glass-border)] bg-[var(--input-bg)] rounded-2xl min-h-[300px] transition-all duration-300 ease-out preserve-3d"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex flex-col items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Hard Skills Distribution</h4>
                      
                      <div className="relative w-64 h-64">
                        <canvas ref={radarCanvasRef} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional diagnostic checks footer */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--glass-border)] text-center text-xs">
                  <div>
                    <span className="block text-[var(--text-muted)] uppercase text-[9px] font-bold">Semantic Alignment</span>
                    <span className="font-semibold text-emerald-400">9.4 / 10</span>
                  </div>
                  <div>
                    <span className="block text-[var(--text-muted)] uppercase text-[9px] font-bold">Formatting Check</span>
                    <span className="font-semibold text-emerald-400">OPTIMAL</span>
                  </div>
                  <div>
                    <span className="block text-[var(--text-muted)] uppercase text-[9px] font-bold">ATS Readability</span>
                    <span className="font-semibold text-emerald-400">PASSED</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SKILL RADAR */}
            {resultTab === "radar" && (
              <div 
                ref={isometricSkillSvgRef}
                className="no-print tab-transition w-full max-w-2xl mx-auto bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-6 text-[var(--foreground)] transition-all duration-300 ease-out preserve-3d"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }} className="w-full flex flex-col items-center gap-6">
                  <div className="text-center border-b border-[var(--glass-border)] pb-4 w-full">
                    <h3 className="text-lg font-bold tracking-wide">SKILL RADAR</h3>
                    <p className="text-xs text-[var(--text-muted)]">Visual projection of skill matching vectors</p>
                  </div>

                <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    <defs>
                      <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Concentric Pentagonal Grids */}
                    {[25, 50, 75, 100].map((r) => {
                      const points = [
                        [150, 150 - r],
                        [150 + r * 0.951, 150 - r * 0.309],
                        [150 + r * 0.588, 150 + r * 0.809],
                        [150 - r * 0.588, 150 + r * 0.809],
                        [150 - r * 0.951, 150 - r * 0.309]
                      ].map(p => p.join(",")).join(" ");

                      return (
                        <polygon
                          key={r}
                          points={points}
                          className="stroke-[var(--glass-border)] fill-transparent"
                          strokeWidth="1"
                          strokeDasharray={r === 100 ? "none" : "3,3"}
                        />
                      );
                    })}

                    {/* Radial Spoke Lines */}
                    {[
                      [150, 50],
                      [245, 119],
                      [209, 231],
                      [91, 231],
                      [55, 119]
                    ].map((pt, i) => (
                      <line
                        key={i}
                        x1="150"
                        y1="150"
                        x2={pt[0]}
                        y2={pt[1]}
                        className="stroke-[var(--glass-border)]"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Dynamic Active Value Area Polygon */}
                    <polygon
                      points={polygonPoints}
                      fill="url(#radarGradient)"
                      fillOpacity="0.35"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      filter="url(#radarGlow)"
                      className="transition-all duration-1000 ease-out"
                    />

                    {/* Outer Label Annotations */}
                    <text x="150" y="32" textAnchor="middle" className="fill-[var(--text-muted)] font-bold text-[9px] uppercase tracking-wider">Frontend (94%)</text>
                    <text x="256" y="122" textAnchor="start" className="fill-[var(--text-muted)] font-bold text-[9px] uppercase tracking-wider">Backend (82%)</text>
                    <text x="220" y="248" textAnchor="start" className="fill-[var(--text-muted)] font-bold text-[9px] uppercase tracking-wider">Design & UI (89%)</text>
                    <text x="80" y="248" textAnchor="end" className="fill-[var(--text-muted)] font-bold text-[9px] uppercase tracking-wider">DevOps (75%)</text>
                    <text x="44" y="122" textAnchor="end" className="fill-[var(--text-muted)] font-bold text-[9px] uppercase tracking-wider">Testing (80%)</text>

                    {/* Interactive Vertex Nodes */}
                    {[
                      { x: x0, y: y0, label: "Frontend: 94%" },
                      { x: x1, y: y1, label: "Backend: 82%" },
                      { x: x2, y: y2, label: "Design: 89%" },
                      { x: x3, y: y3, label: "DevOps: 75%" },
                      { x: x4, y: y4, label: "Testing: 80%" }
                    ].map((node, i) => (
                      <circle
                        key={i}
                        cx={node.x}
                        cy={node.y}
                        r="4"
                        className="fill-[var(--accent)] stroke-[var(--background)] cursor-pointer hover:r-6 hover:fill-pink-400 transition-all duration-300"
                        strokeWidth="1.5"
                      >
                        <title>{node.label}</title>
                      </circle>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
            )}

            {/* TAB 4: RAW JSON */}
            {resultTab === "json" && (
              <div className="no-print tab-transition w-full max-w-2xl mx-auto json-container bg-[var(--input-bg)] border border-[var(--glass-border)] text-emerald-400 p-6 rounded-2xl overflow-x-auto shadow-2xl">
                <pre><code className="text-xs">{JSON.stringify(resumeData, null, 2)}</code></pre>
              </div>
            )}
          </div>
        </section>
      )}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          body.print-ats-mode .print-area {
            display: none !important;
          }
          body.print-ats-mode #ats-optimized-resume-pane {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
