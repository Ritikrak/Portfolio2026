"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./ParticleWave.module.scss";

const shaderFiles = {
  structure: {
    vertex: "/shaders/particle-wave.vert.glsl",
    fragment: "/shaders/particle-wave.frag.glsl",
  },
  ripples: {
    vertex: "/shaders/particle-ripples.vert.glsl",
    fragment: "/shaders/particle-ripples.frag.glsl",
  },
};

type ParticleWaveProps = {
  mode?: "structure" | "ripples";
};

export default function ParticleWave({ mode = "structure" }: ParticleWaveProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const isMobile =
      window.matchMedia("(max-width: 700px)").matches ||
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency < 4);
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      isMobile ? 1.25 : 1.75,
    );
    const shaderController = new AbortController();
    const shaders = shaderFiles[mode];
    const scene = new THREE.Scene();
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let resizeHandler: (() => void) | null = null;
    let uniforms: {
      uTime: { value: number };
      uMouse: { value: THREE.Vector2 };
      uMouseStrength: { value: number };
      uPixelRatio: { value: number };
      uPointSize: { value: number };
    } | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let animationFrame = 0;
    let isVisible = typeof IntersectionObserver === "undefined";
    let contextLost = false;
    let disposed = false;
    let resourcesDisposed = false;

    const stopAnimation = () => {
      if (!animationFrame) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const renderFrame = (time: number) => {
      animationFrame = 0;
      if (
        disposed ||
        contextLost ||
        !isVisible ||
        document.hidden ||
        !renderer ||
        !uniforms ||
        !camera
      ) {
        return;
      }

      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(renderFrame);
    };

    const startAnimation = () => {
      if (
        animationFrame ||
        disposed ||
        contextLost ||
        !isVisible ||
        document.hidden
      ) {
        return;
      }

      animationFrame = requestAnimationFrame(renderFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !uniforms) return;

      const bounds = frame.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      uniforms.uMouse.value.set(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2.4,
        (0.5 - (event.clientY - bounds.top) / bounds.height) * 2.4,
      );
      uniforms.uMouseStrength.value = 1;
    };

    const handlePointerLeave = () => {
      if (!uniforms) return;
      uniforms.uMouse.value.set(10, 10);
      uniforms.uMouseStrength.value = 0;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stopAnimation();
      frame.classList.remove(styles.ready);
      console.error("Particle wave WebGL context lost; showing the CSS fallback.");
    };

    const cleanupResources = () => {
      if (resourcesDisposed) return;
      resourcesDisposed = true;
      disposed = true;
      shaderController.abort();
      stopAnimation();
      resizeObserver?.disconnect();
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      visibilityObserver?.disconnect();
      frame.removeEventListener("pointermove", handlePointerMove);
      frame.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      frame.classList.remove(styles.ready);

      if (renderer) {
        renderer.domElement.removeEventListener(
          "webglcontextlost",
          handleContextLost,
        );
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      }

      geometry?.dispose();
      material?.dispose();
    };

    const initialize = async () => {
      try {
        const [vertexResponse, fragmentResponse] = await Promise.all([
          fetch(shaders.vertex, { signal: shaderController.signal }),
          fetch(shaders.fragment, { signal: shaderController.signal }),
        ]);
        if (!vertexResponse.ok || !fragmentResponse.ok) {
          throw new Error(
            `Shader request failed (${vertexResponse.status}, ${fragmentResponse.status}).`,
          );
        }

        const [vertexShader, fragmentShader] = await Promise.all([
          vertexResponse.text(),
          fragmentResponse.text(),
        ]);
        if (disposed) return;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          depth: false,
          powerPreference: isMobile ? "low-power" : "high-performance",
          stencil: false,
        });
        renderer.setPixelRatio(pixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.className = styles.canvas;
        renderer.domElement.setAttribute("aria-hidden", "true");

        const columns = isMobile ? 42 : 62;
        const rows = isMobile ? 36 : 48;
        const positions = new Float32Array(columns * rows * 3);
        const coordinates = new Float32Array(columns * rows * 2);

        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            const particleIndex = row * columns + column;
            const positionOffset = particleIndex * 3;
            const coordinateOffset = particleIndex * 2;
            const u = column / (columns - 1);
            const v = row / (rows - 1);

            positions[positionOffset] = (u - 0.5) * 2.5;
            positions[positionOffset + 1] = (v - 0.5) * 2.15;
            positions[positionOffset + 2] = 0;
            coordinates[coordinateOffset] = u;
            coordinates[coordinateOffset + 1] = v;
          }
        }

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );
        geometry.setAttribute("uv", new THREE.BufferAttribute(coordinates, 2));
        geometry.computeBoundingSphere();

        uniforms = {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(10, 10) },
          uMouseStrength: { value: 0 },
          uPixelRatio: { value: pixelRatio },
          uPointSize: { value: isMobile ? 2.9 : 3.1 },
        };
        material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, -0.38, 3.25);
        camera.lookAt(0, 0, 0);

        const resize = () => {
          if (!renderer || !camera || !uniforms) return;
          const bounds = frame.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return;

          renderer.setSize(bounds.width, bounds.height, false);
          camera.aspect = bounds.width / bounds.height;
          camera.updateProjectionMatrix();
        };

        resizeObserver =
          typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(resize);
        resizeObserver?.observe(frame);
        if (!resizeObserver) {
          resizeHandler = resize;
          window.addEventListener("resize", resize);
        }
        renderer.domElement.addEventListener(
          "webglcontextlost",
          handleContextLost,
        );
        frame.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        frame.addEventListener("pointerleave", handlePointerLeave);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        frame.appendChild(renderer.domElement);
        resize();

        if (typeof IntersectionObserver !== "undefined") {
          visibilityObserver = new IntersectionObserver(
            ([entry]) => {
              isVisible = entry?.isIntersecting ?? false;
              if (isVisible) {
                startAnimation();
              } else {
                stopAnimation();
              }
            },
            { rootMargin: "100px" },
          );
          visibilityObserver.observe(frame);
        }

        renderer.render(scene, camera);
        frame.classList.add(styles.ready);
        startAnimation();
      } catch (error) {
        if (!disposed) {
          console.error(
            "Particle wave initialization failed; showing the CSS fallback.",
            error,
          );
          cleanupResources();
        }
      }
    };

    void initialize();
    return cleanupResources;
  }, [mode]);

  return (
    <div
      aria-hidden="true"
      className={styles.frame}
      data-mode={mode}
      ref={frameRef}
    >
      <div className={styles.fallback} />
    </div>
  );
}
