"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import styles from "./ContactSection.module.scss";

type ContactLink = {
  label: string;
  href: string;
  external: boolean;
};

type ContactSectionProps = {
  name: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeUrl?: string;
  instagramUrl?: string;
  resumeUrl?: string;
  location: string;
  copyrightYear: string;
};

export default function ContactSection({
  name,
  email,
  githubUrl,
  linkedinUrl,
  leetcodeUrl,
  instagramUrl,
  resumeUrl,
  location,
  copyrightYear,
}: ContactSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const links: ContactLink[] = [];

  useScrollAnimations(sectionRef);

  if (email) {
    links.push({
      label: "Email",
      href: `mailto:${email}`,
      external: false,
    });
  }
  if (githubUrl) {
    links.push({
      label: "GitHub",
      href: githubUrl,
      external: true,
    });
  }
  if (linkedinUrl) {
    links.push({
      label: "LinkedIn",
      href: linkedinUrl,
      external: true,
    });
  }
  if (leetcodeUrl) {
    links.push({
      label: "LeetCode",
      href: leetcodeUrl,
      external: true,
    });
  }
  if (instagramUrl) {
    links.push({
      label: "Instagram",
      href: instagramUrl,
      external: true,
    });
  }
  if (resumeUrl) {
    links.push({
      label: "Resume",
      href: resumeUrl,
      external: true,
    });
  }

  return (
    <>
      <section
        aria-labelledby="contact-title"
        className={styles.section}
        data-scroll-reveal
        id="contact"
        ref={sectionRef}
      >
        <p className={styles.eyebrow}>Contact / Let&apos;s connect</p>

        <div className={styles.contactHeading}>
          <h2 id="contact-title" className={styles.title}>
            Have something
            <br />
            <em>interesting in mind?</em>
          </h2>
          {email && (
            <motion.a
              aria-label={`Let's talk with ${name}`}
              className={styles.cta}
              href={`mailto:${email}?subject=Portfolio%20inquiry`}
              tabIndex={0}
              whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <span>Let&apos;s talk</span>
              <span className={styles.ctaIcon} aria-hidden="true">
                <ArrowUpRight size={20} strokeWidth={1.5} />
              </span>
            </motion.a>
          )}
        </div>

      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a className={styles.footerBrand} href="#top">
            {name}.
          </a>
          <nav aria-label="Footer profile links" className={styles.footerLinks}>
            {links
              .filter(({ external }) => external)
              .map(({ label, href }) => (
                <a
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {label}
                  <ArrowUpRight
                    className={styles.externalIcon}
                    size={12}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>
              ))}
          </nav>
          <a
            aria-label="Back to top"
            className={styles.backToTop}
            href="#top"
          >
            <ArrowUp size={18} strokeWidth={1.4} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.footerBottom}>
          <span className={styles.copyright}>
            © {copyrightYear} {name}
          </span>
          <span className={styles.footerNote}>
            Built with intent. Always evolving.
          </span>
          <span className={styles.footerLocation}>
            {location}
            <ArrowUpRight size={11} strokeWidth={1.5} aria-hidden="true" />
            The world
          </span>
        </div>
      </footer>
    </>
  );
}
