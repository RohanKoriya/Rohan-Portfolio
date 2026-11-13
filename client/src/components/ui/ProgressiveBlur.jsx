import { useEffect, useState } from "react";

const BLUR_LAYERS = [
  {
    blur: "0.75px",
    mask: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 85%)",
  },
  {
    blur: "1.5px",
    mask: "linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,1) 55%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
  },
  {
    blur: "3px",
    mask: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 75%, rgba(0,0,0,1) 100%)",
  },
  {
    blur: "6px",
    mask: "linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)",
  },
];

export default function ProgressiveBlur() {
  const [hiddenAtBottom, setHiddenAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      // Fade out once within 120px of the bottom so the footer stays 100% crisp
      setHiddenAtBottom(docHeight - scrollBottom < 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 h-14 select-none transition-opacity duration-300 sm:h-16 ${
        hiddenAtBottom ? "opacity-0" : "opacity-100"
      }`}
    >
      {BLUR_LAYERS.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}

      {/* Subtle edge tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-canvas/55 via-canvas/10 to-transparent dark:from-canvas-dark/55 dark:via-canvas-dark/10" />
    </div>
  );
}
