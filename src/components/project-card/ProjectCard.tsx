"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectEntry } from "@/data/portfolio";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import styles from "./ProjectCard.module.scss";

type ProjectCardProps = {
  project: ProjectEntry;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  useScrollAnimations(cardRef);

  return (
    <article className={styles.card} data-scroll-reveal ref={cardRef}>
      <div className={styles.cardTop}>
        <span className={styles.projectIndex}>0{index + 1}</span>
        <span>{project.category}</span>
        {project.year && (
          <span className={styles.projectYear}>{project.year}</span>
        )}
      </div>

      <figure
        className={`${styles.visual} ${
          project.imageAspectRatio === "wide"
            ? styles.visualWide
            : project.imageAspectRatio === "screen"
              ? styles.visualScreen
              : project.imageAspectRatio === "document"
                ? styles.visualDocument
                : ""
        }`}
        data-image-mask
        data-parallax
      >
        <Image
          alt={project.imageAlt}
          className={styles.image}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 45vw, 42vw"
          src={project.image}
        />
        {project.isPlaceholderImage && (
          <figcaption className={styles.imageNote}>
            <span>Image placeholder</span>
            <span>Replace with project artwork</span>
          </figcaption>
        )}
      </figure>

      <div className={styles.cardInfo}>
        <div className={styles.projectCopy}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>

        <div className={styles.cardBottom}>
          <ul className={styles.technologies} aria-label="Project technologies">
            {project.technologies.map((technology, technologyIndex) => (
              <li key={`${technology}-${technologyIndex}`}>{technology}</li>
            ))}
          </ul>
          {project.href && project.linkLabel && (
            <motion.a
              aria-label={`${project.linkLabel} for ${project.title}`}
              className={styles.projectLink}
              href={project.href}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
            >
              {project.linkLabel}
              <ArrowUpRight size={14} strokeWidth={1.6} />
            </motion.a>
          )}
        </div>
      </div>
    </article>
  );
}
