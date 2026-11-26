"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ExperienceEntry } from "@/data/portfolio";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import styles from "./ExperienceTimeline.module.scss";

gsap.registerPlugin(ScrollTrigger);

type ExperienceTimelineProps = {
  entries: ExperienceEntry[];
};

export default function ExperienceTimeline({
  entries,
}: ExperienceTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimations(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let context: ReturnType<typeof gsap.context> | undefined;
    const frame = window.requestAnimationFrame(() => {
      context = gsap.context(() => {
        const progressLine = section.querySelector<HTMLElement>(
          "[data-timeline-progress]",
        );

        if (progressLine) {
          gsap.fromTo(
            progressLine,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "bottom 75%",
                scrub: 0.6,
              },
            },
          );
        }
      }, section);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      context?.revert();
    };
  }, []);

  return (
    <section
      aria-labelledby="experience-title"
      className={styles.section}
      data-scroll-reveal
      id="experience"
      ref={sectionRef}
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>04 / Experience</p>
          <h2 id="experience-title">A considered practice.</h2>
        </div>
        <p className={styles.headingNote}>
          Selected internships and engineering work, listed chronologically.
        </p>
      </div>

      <div className={styles.timeline}>
        <span className={styles.timelineTrack} aria-hidden="true" />
        <span
          className={styles.timelineProgress}
          aria-hidden="true"
          data-timeline-progress
        />
        <ol className={styles.timelineEntries}>
          {entries.map((entry) => (
            <li className={styles.timelineItem} data-scroll-reveal key={entry.id}>
              <div className={styles.period}>{entry.period}</div>
              <div className={styles.entryContent}>
                <span className={styles.timelineDot} aria-hidden="true" />
                <div className={styles.entryTitle}>
                  <h3>{entry.role}</h3>
                  <span>{entry.organization}</span>
                </div>
                <p>{entry.description}</p>
                {entry.location && (
                  <span className={styles.location}>{entry.location}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
