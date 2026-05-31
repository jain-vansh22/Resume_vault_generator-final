"use client";

import React, { useRef, useEffect } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xc = rect.width / 2;
      const yc = rect.height / 2;

      // Calculate tilt angles (max 15 degrees)
      const rotateX = -(y - yc) / 8;
      const rotateY = (x - xc) / 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Glare effect
      const glare = card.querySelector(".tilt-glare") as HTMLDivElement;
      if (glare) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.15) 0%, transparent 65%)`;
        glare.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      const glare = card.querySelector(".tilt-glare") as HTMLDivElement;
      if (glare) {
        glare.style.opacity = "0";
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-all duration-300 ease-out select-none preserve-3d ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glare overlay */}
      <div 
        className="tilt-glare absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-300" 
        style={{ mixBlendMode: "overlay" }}
      />
      {/* Content wrapper with translateZ to create physical depth separation */}
      <div className="relative z-0" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
