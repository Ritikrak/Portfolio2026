"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import ThreePortrait from "@/components/three-portrait/ThreePortrait";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import { useHeroMotionPreference } from "@/providers/MotionProvider";
import styles from "./CinematicHero.module.scss";

type CinematicHeroProps = {
  name: string;
  tagline: string;
  heroDescriptor: string;
};

export default function CinematicHero({
  name,
  tagline,
  heroDescriptor,
}: CinematicHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { heroMotionEnabled } = useHeroMotionPreference();
  useScrollAnimations(heroRef, heroMotionEnabled);
  const [firstName, ...remainingName] = name.trim().split(/\s+/);
  const lastName = remainingName.join(" ");

  useEffect(() => {
    const hero = heroRef.current;
    if (
      !hero ||
      !heroMotionEnabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let context: ReturnType<typeof gsap.context> | undefined;
    const frame = window.requestAnimationFrame(() => {
      context = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            delay: 0.12,
          })
          .fromTo(
            "[data-hero-portrait]",
            { opacity: 0, scale: 1.045, y: 18 },
            { opacity: 1, scale: 1, y: 0, duration: 1.25 },
          )
          .fromTo(
            "[data-hero-name]",
            { yPercent: 112, rotateX: -10 },
            {
              yPercent: 0,
              rotateX: 0,
              duration: 1.05,
              stagger: 0.13,
            },
            "-=0.72",
          );
      }, hero);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      context?.revert();
    };
  }, [heroMotionEnabled]);

  return (
    <section
      className={styles.hero}
      id="top"
      aria-labelledby="hero-title"
      ref={heroRef}
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.topline}>
        <span>Based in India&nbsp; · &nbsp;{heroDescriptor}</span>
      </div>

      <div
        className={styles.portraitFrame}
        data-hero-portrait
        data-parallax
      >
        <ThreePortrait
          src="/images/profile-cutout.png"
          alt={`Black-and-white portrait of ${name}`}
          width={768}
          height={768}
        />
      </div>
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.heroContent}>
        <h1 className={styles.title} id="hero-title">
          <span className={`${styles.titleClip} ${styles.titleItalic}`}>
            <span data-hero-name>{firstName}</span>
          </span>
          {lastName && (
            <span className={`${styles.titleClip} ${styles.titleItalic}`}>
              <span data-hero-name>{lastName}</span>
            </span>
          )}
        </h1>
        <p className={styles.expertise}>{tagline}</p>
        <div className={styles.heroDetails}>
          <div className={styles.actions}>
            <motion.a
              className={styles.primaryAction}
              href="#work"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore my work <ArrowDown size={15} strokeWidth={1.7} />
            </motion.a>
            <motion.a
              className={styles.secondaryAction}
              href="#contact"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              Start a conversation <ArrowUpRight size={15} strokeWidth={1.7} />
            </motion.a>
          </div>
        </div>
      </div>

      <div className={styles.bottomline}>
        <a className={styles.explorationLink} href="#work">
          An ongoing exploration
          <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
