import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

export const ServiceThreeCard = ({ id, title, subtitle, thumbnail, link }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    let renderer, scene, camera, mesh;
    let animationFrameId;

    // --- Scene Setup ---
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 650 / 450, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(650, 450);
    mount.appendChild(renderer.domElement);

    // --- Lighting ---
    const pointLight = new THREE.PointLight(0xffffff, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // --- Create a 2D Canvas to Draw Image and Text ---
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 650;
    canvas.height = 450;

    const image = new Image();
    image.src = thumbnail;
    image.onload = () => {
      // Draw the image
      context.drawImage(image, 0, 0, 650, 350);

      // Draw the title
      context.font = "600 24px Arial, sans-serif";
      context.fillStyle = "#e0e0e0";
      context.fillText(title, 30, 380);

      // Draw the subtitle
      context.font = "normal 16px Arial, sans-serif";
      context.fillStyle = "#9e9e9e";
      context.fillText(subtitle, 30, 410);

      // --- Use the 2D Canvas as a Texture ---
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const geometry = new THREE.PlaneGeometry(10, 6.9, 50, 50);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: texture },
        },
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
          float snoise(vec2 v) {
              const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
              vec2 i  = floor(v + dot(v, C.yy) );
              vec2 x0 = v -   i + dot(i, C.xx);
              vec2 i1;
              i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy + C.xxzz;
              x12.xy -= i1;
              i = mod289(i);
              vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
              vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
              m = m*m; m = m*m;
              vec3 x = 2.0 * fract(p * C.www) - 1.0;
              vec3 h = abs(x) - 0.5;
              vec3 ox = floor(x + 0.5);
              vec3 a0 = x - ox;
              m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
              vec3 g;
              g.x  = a0.x  * x0.x  + h.x  * x0.y;
              g.yz = a0.yz * x12.xz + h.yz * x12.yw;
              return 130.0 * dot(m, g);
          }
          void main() {
            vUv = uv;
            vec3 pos = position;
            float waveSpeed = uTime * 0.4;
            float noise = snoise(vec2(pos.x * 0.2 - waveSpeed, pos.y * 0.2 - waveSpeed));
            pos.z += noise * 0.1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(uTexture, vUv);
          }
        `,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const clock = new THREE.Clock();
      const animate = () => {
        material.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    };

    image.crossOrigin = "Anonymous";
    image.src = thumbnail;

    // --- ▼▼▼ THIS IS THE CORRECTED CLEANUP LOGIC ▼▼▼ ---
    return () => {
      // 1. Stop the animation loop
      cancelAnimationFrame(animationFrameId);

      // 2. We DO NOT manually remove the canvas. React handles this when it
      //    unmounts the parent div.

      // 3. We ONLY clean up Three.js objects to prevent memory leaks.
      if (mesh) {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (
            mesh.material.uniforms &&
            mesh.material.uniforms.uTexture &&
            mesh.material.uniforms.uTexture.value
          ) {
            mesh.material.uniforms.uTexture.value.dispose();
          }
          mesh.material.dispose();
        }
        scene.remove(mesh);
      }

      if (renderer) {
        renderer.dispose();
      }
    };
    // --- ▲▲▲ END OF UPDATED CODE ▲▲▲ ---
  }, [thumbnail, title, subtitle]);

  return (
    <div id={`service-card-${id}`} className="w-[650px] flex-shrink-0">
      <Link to={link} className="group block">
        <div ref={mountRef} className="w-[650px] h-[450px] cursor-pointer" />
      </Link>
    </div>
  );
};
