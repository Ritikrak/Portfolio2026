"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import styles from "./SiteHeader.module.scss";

const navigation = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
];

type SiteHeaderProps = {
  name: string;
  linkedinUrl: string;
};

export default function SiteHeader({ name, linkedinUrl }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (prefersReducedMotion || menuOpen || current < 80) {
      setHeaderHidden(false);
      return;
    }

    if (current > previous + 3) setHeaderHidden(true);
    else if (current < previous - 3) setHeaderHidden(false);
  });

  return (
    <motion.header
      className={styles.header}
      initial={false}
      animate={{
        y: headerHidden ? -120 : 0,
        opacity: headerHidden ? 0 : 1,
      }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: "easeOut" }}
      style={{ x: "-50%" }}
      onFocusCapture={() => setHeaderHidden(false)}
    >
      <a className={styles.wordmark} href="#top" aria-label={`${name}, home`}>
        <span className={styles.wordmarkName}>{name}</span>
      </a>

      <div className={styles.desktopActions}>
        <nav className={styles.navigation} aria-label="Main navigation">
          {navigation.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
        <motion.a
          className={styles.talkLink}
          href={linkedinUrl}
          rel="noopener noreferrer"
          target="_blank"
          whileHover={{ y: -2, scale: 1.025 }}
          whileTap={{ scale: 0.97 }}
        >
          Let&apos;s Connect <ArrowUpRight size={14} strokeWidth={1.7} />
        </motion.a>
      </div>

      <motion.button
        className={styles.menuButton}
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? "mobile-navigation" : undefined}
        ref={menuButtonRef}
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
        whileTap={{ scale: 0.92 }}
      >
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </motion.button>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className={styles.mobileNavigation}
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }
            }}
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </a>
            ))}
            <a
              href={linkedinUrl}
              onClick={() => setMenuOpen(false)}
              rel="noopener noreferrer"
              target="_blank"
            >
              Let&apos;s Connect
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
