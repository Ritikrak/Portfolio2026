"use client";

import { useCallback, useRef, type ReactNode } from "react";
import useScrollAnimations from "@/hooks/useScrollAnimations";

type ScrollRevealProps = {
  as: "div" | "section";
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
};

export default function ScrollReveal({
  as: Element,
  children,
  className,
  id,
  "aria-labelledby": ariaLabelledBy,
}: ScrollRevealProps) {
  const revealRef = useRef<HTMLElement>(null);
  const setRevealElement = useCallback((element: HTMLElement | null) => {
    revealRef.current = element;
  }, []);
  useScrollAnimations(revealRef);

  return (
    <Element
      aria-labelledby={ariaLabelledBy}
      className={className}
      data-scroll-reveal
      id={id}
      ref={setRevealElement}
    >
      {children}
    </Element>
  );
}
