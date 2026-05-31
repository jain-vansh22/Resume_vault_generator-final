"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TechBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 120;

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Generate Glowing Particle Texture (Canvas)
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createCircleTexture();

    // 4. Create Nodes (Points)
    const particleCount = 110;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const baseVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Position nodes inside a 3D bounding box
      positions[i * 3] = (Math.random() - 0.5) * 260;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 260;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;

      // Slow drift velocity
      const vx = (Math.random() - 0.5) * 0.15;
      const vy = (Math.random() - 0.5) * 0.15;
      const vz = (Math.random() - 0.5) * 0.15;
      velocities.push({ x: vx, y: vy, z: vz });
      baseVelocities.push({ x: vx, y: vy, z: vz });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle material config with glowing map
    const material = new THREE.PointsMaterial({
      color: 0x818cf8, // Default to neon indigo
      size: 5.0,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 5. Create Web Connections (Line Segments)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1, // Default to indigo-500
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // 6. Interactive Mouse Tracking
    const mouse3D = new THREE.Vector3(9999, 9999, 0); // start far away
    let cameraParallaxX = 0;
    let cameraParallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Camera parallax values
      cameraParallaxX = (event.clientX - window.innerWidth / 2) * 0.05;
      cameraParallaxY = (event.clientY - window.innerHeight / 2) * 0.05;

      // Map normalized device coordinates to 3D scene space at Z=0
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Project NDC to a plane at Z=0 based on camera properties
      const vFOV = (camera.fov * Math.PI) / 180;
      const planeHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const planeWidth = planeHeight * camera.aspect;

      mouse3D.x = (x * planeWidth) / 2;
      mouse3D.y = (y * planeHeight) / 2;
      mouse3D.z = 0;
    };

    const handleMouseLeave = () => {
      mouse3D.set(9999, 9999, 0); // Put mouse out of reach
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Window resizing handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Interpolate theme colors dynamically based on active HTML classes
      const isDark = document.documentElement.classList.contains("dark");
      const targetParticleColor = isDark ? 0x818cf8 : 0x2563eb; // Neon Indigo vs Electric Blue
      const targetLineColor = isDark ? 0x6366f1 : 0x8b5cf6;     // Indigo-500 vs Energetic Purple

      material.color.lerp(new THREE.Color(targetParticleColor), 0.08);
      lineMaterial.color.lerp(new THREE.Color(targetLineColor), 0.08);

      const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;
      const array = positionsAttr.array as Float32Array;

      // 7a. Particle position update & Mouse Repulsion Physics
      for (let i = 0; i < particleCount; i++) {
        const px = array[i * 3];
        const py = array[i * 3 + 1];
        const pz = array[i * 3 + 2];

        // Physics interaction with mouse
        const dx = px - mouse3D.x;
        const dy = py - mouse3D.y;
        const dz = pz - mouse3D.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const repulsionRadius = 65;
        if (dist < repulsionRadius) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          const pushStrength = 0.8;
          // Apply repulsion force away from cursor
          velocities[i].x += (dx / dist) * force * pushStrength;
          velocities[i].y += (dy / dist) * force * pushStrength;
        }

        // Return gently to base drift speed
        velocities[i].x += (baseVelocities[i].x - velocities[i].x) * 0.06;
        velocities[i].y += (baseVelocities[i].y - velocities[i].y) * 0.06;
        velocities[i].z += (baseVelocities[i].z - velocities[i].z) * 0.06;

        // Apply velocities
        array[i * 3] += velocities[i].x;
        array[i * 3 + 1] += velocities[i].y;
        array[i * 3 + 2] += velocities[i].z;

        // Bounding box bouncing logic
        if (Math.abs(array[i * 3]) > 140) velocities[i].x *= -1;
        if (Math.abs(array[i * 3 + 1]) > 140) velocities[i].y *= -1;
        if (Math.abs(array[i * 3 + 2]) > 100) velocities[i].z *= -1;
      }
      positionsAttr.needsUpdate = true;

      // 7b. Dynamic Web Connections (Inter-node webs + Mouse webs)
      const linePositions: number[] = [];
      const maxDistance = 45;
      const mouseWebRadius = 75;

      for (let i = 0; i < particleCount; i++) {
        const x1 = array[i * 3];
        const y1 = array[i * 3 + 1];
        const z1 = array[i * 3 + 2];

        // Draw connections between nodes
        for (let j = i + 1; j < particleCount; j++) {
          const x2 = array[j * 3];
          const y2 = array[j * 3 + 1];
          const z2 = array[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            linePositions.push(x1, y1, z1);
            linePositions.push(x2, y2, z2);
          }
        }

        // Draw dynamic web lines connecting cursor to nearby particles
        const mdx = x1 - mouse3D.x;
        const mdy = y1 - mouse3D.y;
        const mdz = z1 - mouse3D.z;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy + mdz * mdz);

        if (mdist < mouseWebRadius) {
          linePositions.push(x1, y1, z1);
          linePositions.push(mouse3D.x, mouse3D.y, mouse3D.z);
        }
      }

      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );

      // 7c. Smooth camera parallax follow
      targetParallaxX += (cameraParallaxX - targetParallaxX) * 0.05;
      targetParallaxY += (cameraParallaxY - targetParallaxY) * 0.05;

      camera.position.x = targetParallaxX;
      camera.position.y = -targetParallaxY;
      camera.lookAt(scene.position);

      // Gentle global rotation drift
      particles.rotation.y += 0.0005;
      lineMesh.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Component Unmount Garbage Collection
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-transparent transition-opacity duration-500" 
      style={{ opacity: 0.75 }}
    />
  );
}
