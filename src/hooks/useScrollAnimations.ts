"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations(
  rootRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (
      !enabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    let context: ReturnType<typeof gsap.context> | undefined;
    const frame = window.requestAnimationFrame(() => {
      context = gsap.context(() => {
        const revealTargets = [
          ...(root.matches("[data-scroll-reveal]") ? [root] : []),
          ...root.querySelectorAll<HTMLElement>("[data-scroll-reveal]"),
        ];

        revealTargets.forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.fromTo(
            element,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
        });

        root.querySelectorAll<HTMLElement>("[data-image-mask]").forEach((element) => {
          gsap.fromTo(
            element,
            { clipPath: "inset(10% 6% 10% 6%)", scale: 1.04 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                end: "top 48%",
                scrub: 0.65,
              },
            },
          );
        });
      }, root);
    });

    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleRefresh);

    return () => {
      window.removeEventListener("load", handleRefresh);
      window.cancelAnimationFrame(frame);
      context?.revert();
    };
  }, [rootRef, enabled]);
}
