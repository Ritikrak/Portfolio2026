"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SkillGroup } from "@/data/portfolio";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import styles from "./SkillsSection.module.scss";

type SkillsSectionProps = {
  groups: SkillGroup[];
};

export default function SkillsSection({ groups }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeGroupId, setActiveGroupId] = useState(groups[0].id);
  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0];
  const prefersReducedMotion = useReducedMotion();

  useScrollAnimations(sectionRef);

  return (
    <section
      aria-labelledby="skills-title"
      className={styles.section}
      data-scroll-reveal
      id="skills"
      ref={sectionRef}
    >
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>02 / Skills</p>
        <h2 id="skills-title">Skills &amp; practice</h2>
        <p className={styles.introCopy}>
          Development technologies, computer science foundations, areas being
          explored, and language proficiency.
        </p>
      </div>

      <div className={styles.skillPanel}>
        <div className={styles.groupList} role="group" aria-label="Skill groups">
          {groups.map((group, index) => (
            <motion.button
              aria-pressed={group.id === activeGroupId}
              className={styles.groupButton}
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              type="button"
              whileHover={prefersReducedMotion ? undefined : { x: 4 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <span className={styles.groupIndex}>
                0{index + 1}
              </span>
              <span>{group.label}</span>
              <span className={styles.groupMarker} aria-hidden="true">
                ↗
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            aria-label={`${activeGroup.label} skills`}
            className={styles.skillList}
            key={activeGroup.id}
            role="region"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.22,
              ease: "easeOut",
            }}
          >
            {activeGroup.items.map((skill, index) => (
              <div className={styles.skillItem} key={`${skill}-${index}`}>
                <span>{skill}</span>
                <span className={styles.skillNumber}>0{index + 1}</span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
