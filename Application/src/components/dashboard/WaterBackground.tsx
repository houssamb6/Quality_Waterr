import { useMemo } from "react";

interface BubbleProps {
  isContaminated: boolean;
}

const WaterBackground = ({ isContaminated }: BubbleProps) => {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 16 + 6,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient base */}
      {/* Clean gradient - always rendered, fades out */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{
          background: "var(--gradient-ocean)",
          opacity: isContaminated ? 0 : 1,
        }}
      />

      {/* Contaminated gradient light - always rendered, fades in */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out dark:hidden"
        style={{
          background: "linear-gradient(180deg, hsl(0 40% 92%) 0%, hsl(0 50% 85%) 100%)",
          opacity: isContaminated ? 1 : 0,
        }}
      />

      {/* Contaminated gradient dark - always rendered, fades in */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out hidden dark:block"
        style={{
          background: "linear-gradient(180deg, hsl(215 40% 8%) 0%, hsl(0 30% 12%) 100%)",
          opacity: isContaminated ? 1 : 0,
        }}
      />

      {/* Wave layers */}
      <svg className="absolute bottom-0 left-0 w-[200%] opacity-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          className="animate-wave"
          d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,30 1440,50 L1440,120 L0,120 Z"
          fill="hsl(var(--primary) / 0.3)"
        />
      </svg>
      <svg className="absolute bottom-0 left-0 w-[200%] opacity-5" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ animationDelay: "-3s" }}>
        <path
          className="animate-wave"
          d="M0,60 C240,20 480,80 720,40 C960,0 1200,60 1440,30 L1440,120 L0,120 Z"
          fill="hsl(var(--aqua-light) / 0.3)"
        />
      </svg>

      {/* Floating bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full animate-float-bubble"
          style={
            {
              left: `${b.left}%`,
              bottom: "-20px",
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.3), hsl(var(--aqua-light) / 0.1))`,
              border: `1px solid hsl(var(--primary) / 0.15)`,
              "--duration": `${b.duration}s`,
              "--delay": `${b.delay}s`,
              opacity: b.opacity,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Contamination red glow - always rendered, crossfades */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(0_70%_50%/0.15)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_hsl(0_60%_50%/0.08)_0%,_transparent_70%)] transition-opacity duration-[2000ms] ease-in-out"
        style={{ opacity: isContaminated ? 1 : 0 }}
      />
      <div
        className="absolute inset-0 bg-destructive/5 dark:bg-destructive/[0.03] transition-opacity duration-[2000ms] ease-in-out"
        style={{ opacity: isContaminated ? 1 : 0 }}
      />
    </div>
  );
};

export default WaterBackground;
