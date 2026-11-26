"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function useSmoothScroll() {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const lenis = new Lenis({
        anchors: true,
        autoRaf: false,
      });
      const updateScrollTrigger = () => ScrollTrigger.update();
      const updateLenis = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", updateScrollTrigger);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(updateLenis);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    },
    { dependencies: [], revertOnUpdate: true },
  );
}
