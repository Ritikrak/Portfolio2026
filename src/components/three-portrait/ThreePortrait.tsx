"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroMotionPreference } from "@/providers/MotionProvider";
import { portraitFragmentShader, portraitVertexShader } from "@/shaders/portrait";
import styles from "./ThreePortrait.module.scss";

gsap.registerPlugin(ScrollTrigger);

type ThreePortraitProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function ThreePortrait({
  src,
  alt,
  width,
  height,
}: ThreePortraitProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { heroMotionEnabled } = useHeroMotionPreference();

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const reducedMotion =
      !heroMotionEnabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile =
      window.matchMedia("(max-width: 700px)").matches ||
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency < 4);

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        depth: false,
        powerPreference: isMobile ? "low-power" : "high-performance",
        stencil: false,
      });
    } catch (error) {
      console.error(
        "WebGL portrait unavailable; showing the static image fallback.",
        error,
      );
      return;
    }

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      isMobile ? 1.2 : 1.6,
    );
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = styles.canvas;
    renderer.domElement.setAttribute("aria-hidden", "true");
    frame.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const uniforms = {
      uImage: { value: null as THREE.Texture | null },
      uImageResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(-2, -2) },
      uGrain: { value: isMobile ? 0.022 : 0.035 },
      uParticleAmount: { value: isMobile ? 0.55 : 0.8 },
      uZoom: { value: isMobile ? 1.08 : 1.28 },
      uImageCenterY: { value: isMobile ? 0.53 : 0.57 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: portraitVertexShader,
      fragmentShader: portraitFragmentShader,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const resize = () => {
      const { width: frameWidth, height: frameHeight } =
        frame.getBoundingClientRect();
      if (!frameWidth || !frameHeight) return;

      renderer.setSize(frameWidth, frameHeight, false);
      uniforms.uResolution.value.set(frameWidth, frameHeight);
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(frame);
    if (!resizeObserver) window.addEventListener("resize", resize);
    resize();

    let textureReady = false;
    let contextLost = false;
    let isVisible = typeof IntersectionObserver === "undefined";
    const renderPortrait = (time: number) => {
      if (!reducedMotion) uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
    };

    let visibilityObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      visibilityObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
        if (!textureReady || contextLost) return;

        if (isVisible && reducedMotion) {
          renderer.render(scene, camera);
        } else if (isVisible) {
          renderer.setAnimationLoop(renderPortrait);
        } else {
          renderer.setAnimationLoop(null);
        }
      });
      visibilityObserver.observe(frame);
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = frame.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      uniforms.uMouse.value.set(
        (event.clientX - bounds.left) / bounds.width,
        1 - (event.clientY - bounds.top) / bounds.height,
      );
    };
    const handlePointerLeave = () => uniforms.uMouse.value.set(-2, -2);
    const dispersionTween = reducedMotion
      ? null
      : gsap.to(uniforms.uScroll, {
          value: 1,
          ease: "none",
          scrollTrigger: {
            trigger: frame.closest<HTMLElement>("#top") ?? frame,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      renderer.setAnimationLoop(null);
      frame.classList.remove(styles.ready);
      console.error(
        "WebGL portrait context lost; showing the static image fallback.",
      );
    };

    if (!reducedMotion) {
      frame.addEventListener("pointermove", handlePointerMove, { passive: true });
      frame.addEventListener("pointerleave", handlePointerLeave);
    }
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);

    let disposed = false;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      src,
      (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose();
          return;
        }

        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.generateMipmaps = !isMobile;
        uniforms.uImage.value = loadedTexture;
        uniforms.uImageResolution.value.set(
          loadedTexture.image.width,
          loadedTexture.image.height,
        );
        resize();
        textureReady = true;

        if (isVisible && reducedMotion) {
          renderer.render(scene, camera);
        } else if (isVisible) {
          renderer.setAnimationLoop(renderPortrait);
        } else {
          renderer.render(scene, camera);
        }

        frame.classList.add(styles.ready);
      },
      undefined,
      (error) => {
        if (!disposed) {
          console.error(
            `Could not load WebGL portrait texture at "${src}"; showing the static image fallback.`,
            error,
          );
        }
      },
    );

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      dispersionTween?.scrollTrigger?.kill();
      dispersionTween?.kill();
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener("resize", resize);
      if (!reducedMotion) {
        frame.removeEventListener("pointermove", handlePointerMove);
        frame.removeEventListener("pointerleave", handlePointerLeave);
      }
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        handleContextLost,
      );
      frame.classList.remove(styles.ready);
      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [height, heroMotionEnabled, src, width]);

  return (
    <div className={styles.frame} ref={frameRef}>
      <Image
        className={styles.fallbackImage}
        src={src}
        alt={alt}
        width={width}
        height={height}
        crossOrigin="anonymous"
        fetchPriority="high"
        loading="eager"
        unoptimized
        sizes="(max-width: 700px) 100vw, 52vw"
      />
    </div>
  );
}
