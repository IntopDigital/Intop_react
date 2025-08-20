import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

/**
 * Advanced Liquid Hover Text
 * - Tech: React + Tailwind CSS + GSAP + Three.js (custom GLSL)
 * - Words are separate hover targets: "Click", "Connect", "Convert"
 * - Centered layout via Tailwind
 * - Base colors: Blue (#1E3A8A) and Cream (#F5F5DC)
 * - Hover effect: shader-based liquid distortion + color change only within an ~8px band around glyph edges
 */

// Base brand colors
const BLUE = new THREE.Color("#1E3A8A");
const CREAM = new THREE.Color("#F5F5DC");

// Utility: create a texture from text using an offscreen 2D canvas
function createTextTexture({
  text,
  fontFamily = "Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu",
  fontWeight = 800,
  fontSize = 200, // in px for high-res texture; we will scale down in 3D
  padding = 64, // px padding around text
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // First measure to set canvas size
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
  const width = Math.ceil(metrics.width + padding * 2);
  const height = Math.ceil(ascent + descent + padding * 2);

  canvas.width = width;
  canvas.height = height;

  // Re-set font after resizing canvas
  const dpr = window.devicePixelRatio || 1;
  const scale = dpr; // make it crisp on HiDPI
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  const c = canvas.getContext("2d");
  c.scale(scale, scale);
  c.clearRect(0, 0, width, height);
  c.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  c.textBaseline = "alphabetic";
  c.textAlign = "left";

  // Draw transparent background
  // c.fillStyle = 'rgba(0,0,0,0)'; c.fillRect(0,0,width,height);

  // Draw text in white to produce alpha mask
  c.fillStyle = "#ffffff";
  const x = padding;
  const y = padding + ascent;
  c.fillText(text, x, y);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return {
    texture,
    width: canvas.width / scale,
    height: canvas.height / scale,
    rawWidth: canvas.width,
    rawHeight: canvas.height,
  };
}

// GLSL helpers: 2D hash and value noise
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// We use the text alpha as a mask. We color the inside with blue by default.
// On hover, we apply a liquid distortion (time-based noise displacement of UV)
// and recolor only within an ~8px band around the glyph edges to cream.
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D u_map;        // alpha mask from canvas text
  uniform vec2 u_texSize;         // raw texture size in pixels
  uniform vec2 u_planeSize;       // plane size in screen pixels (approx via renderer.setPixelRatio)
  uniform float u_time;
  uniform float u_hover;          // 0..1
  uniform vec3 u_colorBase;       // blue
  uniform vec3 u_colorAccent;     // cream
  uniform float u_bandPx;         // ~8.0 px band width
  uniform float u_intensity;      // distortion intensity

  // 2D random hash
  float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D value noise
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
  }

  // Approximate pixel-space derivatives for consistent band thickness.
  // Convert an 8px band in texture pixels to UV space for the text texture.
  // u_bandPx is the band in *screen* pixels; we scale it to texture UV by ratio of texSize/planeSize.

  void main(){
    // Distort UVs with animated noise based on hover state
    vec2 uv = vUv;
    float t = u_time * 0.6;
    float h = u_hover; // smoother step could be used; gsap already eases

    // Noise scale and displacement increase with hover
    float n1 = noise(uv * 8.0 + t);
    float n2 = noise(uv * 16.0 - t*0.8);
    vec2 disp = vec2(n1 - 0.5, n2 - 0.5) * (0.02 + u_intensity * 0.06) * h; // up to ~8% UV shift at full hover
    vec2 duv = uv + disp;

    // Sample the alpha mask
    float a = texture2D(u_map, duv).a;

    // Early discard for performance (outside glyph completely)
    if(a < 0.01) discard;

    // Compute a band of ~u_bandPx around the edges using ddx/ddy of alpha.
    // Estimate edge sharpness via fwidth.
    float edge = fwidth(a) * 2.0; // conservative

    // Convert desired pixel band on screen to UV band in texture space
    // ratio: pixels_on_screen -> pixels_in_texture -> UV (0..1)
    vec2 pxToUv = u_texSize / u_planeSize; // how many texture px per screen px
    float bandUV = max(pxToUv.x, pxToUv.y) * u_bandPx; // uniform band

    // Build a soft edge mask: near the alpha threshold (~0.5) expanded by bandUV
    // We dilate by sampling a slightly shifted UV to approximate distance.
    float a_center = a;
    float a_in = smoothstep(0.5, 0.5 + edge, a_center);

    // Sample a ring by checking neighboring points; crude distance approx
    float a_n = texture2D(u_map, duv + vec2( bandUV, 0.0)).a;
    float a_s = texture2D(u_map, duv + vec2(-bandUV, 0.0)).a;
    float a_e = texture2D(u_map, duv + vec2(0.0,  bandUV)).a;
    float a_w = texture2D(u_map, duv + vec2(0.0, -bandUV)).a;

    float edgeBand = 0.0;
    // Edge if center is inside but neighbors step towards outside OR near threshold
    float nearEdge = smoothstep(0.48, 0.52, abs(a_center - 0.5));
    edgeBand += step(0.5, a_in) * (1.0 - step(0.5, a_n*a_s*a_e*a_w));
    edgeBand = clamp(edgeBand + (1.0 - nearEdge) * 0.25, 0.0, 1.0);

    // Color logic
    vec3 baseCol = u_colorBase;
    vec3 accentCol = u_colorAccent;

    // On hover, only recolor the ~8px band to accent; inside remains base
    vec3 col = mix(baseCol, mix(baseCol, accentCol, edgeBand), h);

    // Subtle inside shimmer on hover
    float shimmer = noise(uv * 40.0 + t*2.0);
    col += (h) * 0.05 * (shimmer - 0.5);

    gl_FragColor = vec4(col, a);
  }
`;

function makeWordMesh({ text, renderer, pixelRatio, baseScale = 0.005 }) {
  const { texture, width, height, rawWidth, rawHeight } = createTextTexture({
    text,
  });

  // Plane size in world units proportional to pixel size
  const geometry = new THREE.PlaneGeometry(
    width * baseScale,
    height * baseScale,
    1,
    1
  );
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      u_map: { value: texture },
      u_texSize: { value: new THREE.Vector2(rawWidth, rawHeight) },
      u_planeSize: { value: new THREE.Vector2(1, 1) }, // we'll set after we know canvas size
      u_time: { value: 0 },
      u_hover: { value: 0 },
      u_colorBase: { value: BLUE.clone() },
      u_colorAccent: { value: CREAM.clone() },
      u_bandPx: { value: 8.0 }, // 8px band target
      u_intensity: { value: 0 }, // hover-driven
    },
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { text, texture, width, height };

  // Helper hover timelines
  const tlIn = gsap
    .timeline({ paused: true })
    .to(material.uniforms.u_hover, {
      value: 1,
      duration: 0.5,
      ease: "power3.out",
    })
    .to(
      material.uniforms.u_intensity,
      { value: 1, duration: 0.6, ease: "power3.out" },
      0
    );
  const tlOut = gsap
    .timeline({ paused: true })
    .to(material.uniforms.u_hover, {
      value: 0,
      duration: 0.45,
      ease: "power3.inOut",
    })
    .to(
      material.uniforms.u_intensity,
      { value: 0, duration: 0.5, ease: "power3.inOut" },
      0
    );
  mesh.userData.hoverIn = () => {
    tlOut.pause(0);
    tlIn.play();
  };
  mesh.userData.hoverOut = () => {
    tlIn.pause(0);
    tlOut.play();
  };

  // Update planeSize uniform once we know renderer size
  const setPlaneScreenSize = () => {
    const size = new THREE.Vector2();
    renderer.getSize(size);
    const plane = mesh.geometry.parameters;
    // Convert plane world size to screen pixels approximately:
    // We'll pass renderer size directly; shader uses it as an approximation for band UV scaling.
    material.uniforms.u_planeSize.value.set(size.x, size.y);
  };
  setPlaneScreenSize();

  return mesh;
}

export default function LiquidHoverText() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = wrapRef.current;
    const canvas = canvasRef.current;

    // THREE setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -w / 200,
      w / 200,
      h / 200,
      -h / 200,
      -1000,
      1000
    );
    camera.position.z = 10;

    // Create word meshes
    const words = ["Click", "Connect", "Convert"];
    const meshes = words.map((word) =>
      makeWordMesh({ text: word, renderer, pixelRatio })
    );

    // Spacing & positioning centered
    const gap = 40; // px gap visually; convert to world units
    let totalWidthPx =
      meshes.reduce((acc, m) => acc + m.userData.width, 0) +
      gap * (meshes.length - 1);
    const baseScale = 0.005; // must match makeWordMesh
    const totalWidthWorld = totalWidthPx * baseScale;

    let xCursor = -totalWidthWorld / 2;
    meshes.forEach((m, i) => {
      const wWorld = m.userData.width * baseScale;
      m.position.x = xCursor + wWorld / 2;
      m.position.y = 0; // vertically centered
      xCursor += wWorld + gap * baseScale;
      scene.add(m);
    });

    // Raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let hovered = null;

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length) {
        const m = intersects[0].object;
        if (hovered !== m) {
          if (hovered) hovered.userData.hoverOut();
          m.userData.hoverIn();
          hovered = m;
          canvas.style.cursor = "pointer";
        }
      } else {
        if (hovered) {
          hovered.userData.hoverOut();
          hovered = null;
        }
        canvas.style.cursor = "default";
      }
    }

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.left = -w / 200;
      camera.right = w / 200;
      camera.top = h / 200;
      camera.bottom = -h / 200;
      camera.updateProjectionMatrix();
      // Update plane screen uniforms
      meshes.forEach((m) => {
        const mat = m.material;
        if (mat.uniforms && mat.uniforms.u_planeSize) {
          mat.uniforms.u_planeSize.value.set(w, h);
        }
      });
    }

    container.addEventListener("mousemove", onPointerMove);
    window.addEventListener("resize", onResize);

    let rafId;
    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      meshes.forEach((m) => {
        m.material.uniforms.u_time.value = t;
      });
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onPointerMove);
      meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
        if (m.userData.texture) m.userData.texture.dispose?.();
        scene.remove(m);
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-transparent select-none">
      {/* Optional subtle grid background for contrast */}
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle,theme(colors.slate.500)_1px,transparent_1px)] [background-size:20px_20px]" />

      <div
        ref={wrapRef}
        className="relative w-full max-w-6xl h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[60vh] flex items-center justify-center"
      >
        {/* WebGL Canvas */}
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Static, accessible text for SEO/a11y (visually hidden) */}
      <h1 className="sr-only">Click, Connect, Convert</h1>

      {/* Caption / instruction (optional) */}
      <div className="absolute bottom-8 text-center text-sm text-slate-500">
        Hover each word — only the edges (≈8px) morph to cream; interior stays
        blue.
      </div>
    </div>
  );
}
