import { useEffect, useState, useRef } from "react";

export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    // Track intersection states per element
    const visibleMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleMap.set(entry.target.id, entry);
        });

        // If user is scrolled near top, clear active section immediately
        if (window.scrollY < 150) {
          setActiveId(null);
          return;
        }

        const visibleEntries = Array.from(visibleMap.values()).filter(
          (entry) => entry.isIntersecting
        );

        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -50% 0px", // Better viewport threshold for section midpoints
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Handle smooth top clearing when scrolling fast to top
    const handleScroll = () => {
      if (window.scrollY < 150) {
        setActiveId(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [JSON.stringify(ids)]); // Stable serialization key

  return activeId;
}