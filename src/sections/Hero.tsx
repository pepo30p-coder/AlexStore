import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

void main() {
  vec2 newUV = vUv;
  
  // Liquid displacement effect
  float dist = distance(vUv, uMouse);
  float ripple = exp(-dist * dist * 20.0) * uMouseStrength;
  
  newUV.x += (sin(newUV.y * 10.0 + time * 0.5) * 0.015 + ripple * 0.03);
  newUV.y += (sin(newUV.x * 10.0 + time * 0.5) * 0.015 + ripple * 0.03);
  
  vec4 color = texture2D(uTexture, newUV);
  
  // Subtle vignette
  float vignette = 1.0 - smoothstep(0.4, 1.2, length(vUv - 0.5) * 1.5);
  color.rgb *= mix(0.6, 1.0, vignette);
  
  gl_FragColor = color;
}
`;

function HeroPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const { viewport } = useThree();

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/images/hero-bg.jpg');
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0 },
    }),
    [texture]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;
      
      materialRef.current.uniforms.uMouse.value.set(m.x, m.y);
      const dist = Math.sqrt(
        (m.x - 0.5) * (m.x - 0.5) + (m.y - 0.5) * (m.y - 0.5)
      );
      const targetStrength = Math.max(0, 1.0 - dist * 2) * 0.5;
      materialRef.current.uniforms.uMouseStrength.value += 
        (targetStrength - materialRef.current.uniforms.uMouseStrength.value) * 0.05;
    }
  });

  const scale = Math.max(viewport.width, viewport.height) * 1.2;

  return (
    <mesh ref={meshRef} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExploreClick = () => {
    const el = document.querySelector('#gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <HeroPlane />
        </Canvas>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#050505]/80 via-[#050505]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-[2] flex flex-col justify-center h-full max-w-[600px] px-6 lg:px-12">
        <span
          className={`text-eyebrow text-[#c8a45c] mb-6 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
        >
          ALEXSTORE COLLECTION
        </span>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#f5f5f0] leading-[1.05] mb-6">
          {'Where Technology'.split(' ').map((word, i) => (
            <span
              key={i}
              className={`inline-block mr-[0.25em] transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${200 + i * 60}ms`,
                transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
              }}
            >
              {word}
            </span>
          ))}
          <br />
          {'Meets Art'.split(' ').map((word, i) => (
            <span
              key={i}
              className={`inline-block mr-[0.25em] transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${380 + i * 60}ms`,
                transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p
          className={`font-body text-base text-[#8a8a8a] max-w-[480px] mb-10 leading-relaxed transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{
            transitionDelay: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        >
          A curated gallery of premium laptops. Each device is hand-selected, 
          rigorously tested, and presented as a masterpiece of engineering.
        </p>

        <button
          onClick={handleExploreClick}
          className={`text-eyebrow text-[#c8a45c] hover:text-[#d4b76a] transition-all duration-500 self-start gold-underline ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: '800ms',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          Explore the Collection ↓
        </button>
      </div>
    </section>
  );
}
