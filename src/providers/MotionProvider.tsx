"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";

type MotionPreference = {
  heroMotionEnabled: boolean;
  toggleMotion: () => void;
};

const MotionPreferenceContext = createContext<MotionPreference | null>(null);

export default function MotionProvider({ children }: { children: ReactNode }) {
  const [heroMotionEnabled, setHeroMotionEnabled] = useState(true);
  const [userChoice, setUserChoice] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      if (!userChoice) setHeroMotionEnabled(!preference.matches);
    };

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, [userChoice]);

  const toggleMotion = () => {
    setUserChoice(true);
    setHeroMotionEnabled((enabled) => !enabled);
  };

  return (
    <MotionPreferenceContext.Provider
      value={{ heroMotionEnabled, toggleMotion }}
    >
      <MotionConfig
        reducedMotion={heroMotionEnabled ? "never" : "always"}
        transition={{ duration: 0.25 }}
      >
        {children}
      </MotionConfig>
    </MotionPreferenceContext.Provider>
  );
}

export function useHeroMotionPreference() {
  const preference = useContext(MotionPreferenceContext);
  if (!preference) {
    throw new Error(
      "useHeroMotionPreference must be used within MotionProvider.",
    );
  }
  return preference;
}
