"use client";

import { Pause, Play } from "lucide-react";
import { useHeroMotionPreference } from "@/providers/MotionProvider";
import styles from "./MotionToggle.module.scss";

export default function MotionToggle() {
  const { heroMotionEnabled, toggleMotion } = useHeroMotionPreference();

  return (
    <button
      aria-label={`Turn motion ${heroMotionEnabled ? "off" : "on"}`}
      aria-pressed={heroMotionEnabled}
      className={styles.toggle}
      onClick={toggleMotion}
      type="button"
    >
      {heroMotionEnabled ? (
        <Pause size={11} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Play size={11} strokeWidth={1.8} aria-hidden="true" />
      )}
      <span>Motion {heroMotionEnabled ? "On" : "Off"}</span>
    </button>
  );
}
