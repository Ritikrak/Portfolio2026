"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TextReveal.module.scss";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  text: string;
  accentWord?: string;
  className?: string;
};

export default function TextReveal({
  text,
  accentWord,
  className,
}: TextRevealProps) {
  const revealRef = useRef<HTMLSpanElement>(null);
  const words = text.trim().split(/\s+/);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const revealElement = revealRef.current;
    if (
      !revealElement ||
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let context: ReturnType<typeof gsap.context> | undefined;
    const frame = window.requestAnimationFrame(() => {
      context = gsap.context(() => {
        const wordTargets = gsap.utils.toArray<HTMLElement>(
          "[data-text-word]",
          revealElement,
        );

        gsap.fromTo(
          wordTargets,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.055,
            ease: "power3.out",
            scrollTrigger: {
              trigger: revealElement,
              start: "top 88%",
              once: true,
            },
          },
        );
      }, revealElement);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      context?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <span
      className={`${styles.reveal} ${className ?? ""}`}
      ref={revealRef}
    >
      {words.map((word, index) => (
        <span className={styles.wordClip} key={`${word}-${index}`}>
          <span
            className={`${styles.word} ${word === accentWord ? styles.accent : ""}`}
            data-text-word
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
