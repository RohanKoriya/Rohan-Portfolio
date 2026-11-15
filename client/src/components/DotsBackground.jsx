import { useEffect, useRef } from "react";

function Halves() {
  return (
    <>
      <span className="dots-half dots-half--left" />
      <span className="dots-half dots-half--right" />
    </>
  );
}

export default function DotsBackground() {
  const rootRef = useRef(null);
  const hoverRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const hover = hoverRef.current;
    if (!root || !hover) return;

    const wide = window.matchMedia(
      "(min-width: 1440px) and (hover: hover) and (pointer: fine)",
    );

    let frame = null;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = null;
      // Set on the hover layer only, so the rest of the page isn't restyled
      hover.style.setProperty("--mx", `${x}px`);
      hover.style.setProperty("--my", `${y}px`);
    };

    const handleMove = (event) => {
      if (!wide.matches) return;
      x = event.clientX;
      y = event.clientY;
      root.classList.add("is-active");
      if (frame === null) frame = requestAnimationFrame(apply);
    };

    const handleLeave = () => root.classList.remove("is-active");

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="dots-bg">
      <div className="dots-layer dots-layer--blur">
        <Halves />
      </div>
      <div className="dots-layer dots-layer--crisp">
        <Halves />
      </div>
      <div ref={hoverRef} className="dots-layer dots-layer--hover">
        <Halves />
      </div>
    </div>
  );
}
