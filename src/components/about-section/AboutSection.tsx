"use client";

import { useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import ParticleWave from "@/components/particle-wave/ParticleWave";
import { useHeroMotionPreference } from "@/providers/MotionProvider";
import styles from "./AboutSection.module.scss";

type AboutSectionProps = {
  description: string;
  paragraphs: string[];
};

type OrbParticle = {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

const quantize = (value: number) => Math.round(value * 1000) / 1000;

function createConstellationParticles() {
  const particles: OrbParticle[] = [];
  const divisions = 44;
  const midpoint = divisions / 2;

  for (let row = 0; row <= divisions; row += 1) {
    for (let column = 0; column <= divisions; column += 1) {
      const x = (column - midpoint) / midpoint;
      const y = (row - midpoint) / midpoint;
      const distance = x * x + y * y;
      if (distance > 1) continue;

      const depth = Math.sqrt(1 - distance);
      particles.push({
        id: row * (divisions + 1) + column,
        x: quantize(200 + x * 170),
        y: quantize(200 + y * 170),
        radius: quantize(0.45 + depth * 0.65),
        opacity: quantize(0.15 + depth * 0.7),
      });
    }
  }

  return particles;
}

const focusParticlePatterns: { visual: string; particles: OrbParticle[] }[] = [
  { visual: "Structure", particles: [] },
  { visual: "Ripples", particles: [] },
  { visual: "Constellation", particles: createConstellationParticles() },
];

const staticOutlineSizes = [40, 80, 120, 160, 200];
const orbitAngles = [-46, 42, 90];

function StaticFocusArtwork({
  mode,
}: {
  mode: "structure" | "ripples" | "constellation";
}) {
  return (
    <svg
      aria-hidden="true"
      className={styles.staticArtwork}
      viewBox="0 0 400 400"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1"
      >
        {mode === "constellation" ? (
          <>
            {orbitAngles.map((angle) => (
              <ellipse
                cx="200"
                cy="200"
                key={angle}
                rx="104"
                ry="56"
                transform={`rotate(${angle} 200 200)`}
              />
            ))}
            <ellipse
              cx="200"
              cy="200"
              rx="19"
              ry="10"
              transform="rotate(-46 200 200)"
            />
          </>
        ) : (
          staticOutlineSizes.map((size) =>
            mode === "structure" ? (
              <rect
                height={size}
                key={size}
                width={size}
                x={(400 - size) / 2}
                y={(400 - size) / 2}
              />
            ) : (
              <circle cx="200" cy="200" key={size} r={size / 2} />
            ),
          )
        )}
      </g>
    </svg>
  );
}

export default function AboutSection({
  description,
  paragraphs,
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { heroMotionEnabled } = useHeroMotionPreference();
  const motionEnabled = heroMotionEnabled;
  const focusAreas = [
    {
      label: "Build",
      title: "Full-stack, Android, and machine-learning projects",
      copy: description,
      ...focusParticlePatterns[0],
    },
    {
      label: "Secure",
      title: "Computer Science & Cybersecurity",
      copy: paragraphs[0],
      ...focusParticlePatterns[1],
    },
    {
      label: "Explore AI",
      title: "Artificial Intelligence and modern tools",
      copy: paragraphs[1],
      ...focusParticlePatterns[2],
    },
  ];
  const activeArea = focusAreas[activeIndex];
  const renderParticle = (particle: OrbParticle) => (
    <circle
      cx={particle.x}
      cy={particle.y}
      fill="currentColor"
      key={particle.id}
      opacity={particle.opacity}
      r={particle.radius}
    />
  );

  const handleOrbPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    const orb = event.currentTarget;
    const bounds = orb.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    orb.style.setProperty("--pointer-x", `${x}px`);
    orb.style.setProperty("--pointer-y", `${y}px`);
  };

  const resetOrbPointer = (event: PointerEvent<HTMLDivElement>) => {
    const orb = event.currentTarget;
    orb.style.setProperty("--pointer-x", "50%");
    orb.style.setProperty("--pointer-y", "50%");
  };

  useScrollAnimations(sectionRef, motionEnabled);

  return (
    <section
      aria-labelledby="about-title"
      className={styles.section}
      data-scroll-reveal
      id="about"
      ref={sectionRef}
    >
      <header className={styles.sectionHeader}>
        <p className={styles.eyebrow}>Three disciplines. One perspective.</p>
        <span className={styles.sectionCount}>01 / 05</span>
      </header>

      <div className={styles.layout}>
        <div className={styles.visualColumn}>
          <div
            aria-label={`${activeArea.visual} particle illustration`}
            className={styles.orb}
            onPointerLeave={resetOrbPointer}
            onPointerMove={handleOrbPointerMove}
            role="img"
          >
            <AnimatePresence initial={false} mode="wait">
              {activeIndex < 2 && motionEnabled ? (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.particleWaveLayer}
                  exit={{ opacity: 0, scale: 1.035 }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  key={activeArea.visual}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                >
                  <ParticleWave
                    mode={activeIndex === 0 ? "structure" : "ripples"}
                  />
                </motion.div>
              ) : !motionEnabled ? (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.particleWaveLayer}
                  exit={{ opacity: 0, scale: 1.035 }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  key={`static-${activeArea.visual}`}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                >
                  <StaticFocusArtwork
                    mode={
                      activeIndex === 0
                        ? "structure"
                        : activeIndex === 1
                          ? "ripples"
                          : "constellation"
                    }
                  />
                </motion.div>
              ) : (
                <motion.svg
                  animate={{ opacity: 1, scale: 1 }}
                  aria-hidden="true"
                  className={styles.particleSvg}
                  exit={{ opacity: 0, scale: 1.035 }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  key={activeArea.visual}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                  viewBox="0 0 400 400"
                >
                  <g
                    className={
                      motionEnabled ? styles.constellationParticles : undefined
                    }
                  >
                    {activeArea.particles.map(renderParticle)}
                  </g>
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
          <p className={styles.orbCaption}>{activeArea.visual}</p>

          <div
            aria-label="Areas of focus"
            className={styles.focusChoices}
            role="group"
          >
            {focusAreas.map((area, index) => (
              <button
                aria-pressed={activeIndex === index}
                className={
                  activeIndex === index
                    ? `${styles.focusChoice} ${styles.activeFocusChoice}`
                    : styles.focusChoice
                }
                key={area.label}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                {area.label}
                <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={styles.practiceNote}>
            <h3>Practice compounds.</h3>
            <p>{paragraphs[2]}</p>
            <p className={styles.belief}>{paragraphs[3]}</p>
            <a href="#work">
              Explore my work
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.storyColumn}>
          <h2 id="about-title">
            Technology is a starting point.
            <br />
            <em>Build with purpose.</em>
          </h2>
          <p className={styles.storyLead}>
            I connect curiosity, strong fundamentals, and hands-on engineering
            to make useful things.
          </p>
          <div
            aria-live="polite"
            className={styles.focusDetail}
            id="about-focus-panel"
          >
            <p className={styles.focusHeading}>{activeArea.title}</p>
            <p>{activeArea.copy}</p>
          </div>
          <a className={styles.storyLink} href="#education">
            Read my story
            <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
          </a>
          <p className={styles.signature}>
            Engineering mind. Security first. Always learning.
          </p>
        </div>
      </div>
    </section>
  );
}
