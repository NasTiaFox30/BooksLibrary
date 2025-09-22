import { useEffect, useState } from "react";

export default function ParallaxDecorations() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Textures
  const textures = [
    { src: "/textures/decor/decor1.png", className: "decor-1", baseRotate: 25, speed: 0.08 },
    { src: "/textures/decor/decor2.png", className: "decor-2", baseRotate: -35, speed: 0.12 },
    { src: "/textures/decor/decor3.png", className: "decor-3", baseRotate: 50, speed: 0.07 },
    { src: "/textures/decor/decor4.png", className: "decor-4", baseRotate: 15, speed: 0.1 },
    { src: "/textures/decor/decor5.png", className: "decor-5", baseRotate: -45, speed: 0.15 },
    { src: "/textures/decor/decor6.png", className: "decor-6", baseRotate: 60, speed: 0.09 },
    { src: "/textures/decor/decor7.png", className: "decor-7", baseRotate: 15, speed: 0.05 },
    { src: "/textures/decor/decor8.png", className: "decor-8", baseRotate: -45, speed: 0.06 },
  ];

  return (
    <div className="decoration">
      {textures.map(({ src, className, baseRotate, speed }, i) => (
        <img
          key={i}
          src={src}
          alt={`decoration-${i}`}
          className={className}
          style={{
            transform: `translateY(-${scrollY * speed}px) rotate(${baseRotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
