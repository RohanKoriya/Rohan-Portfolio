import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

function Word({ children, progress, range, isLast }) {
  const opacity = useTransform(progress, range, [0.18, 1]);

  return (
    <motion.span
      style={{ opacity, marginRight: !isLast ? "0.25em" : 0 }}
      className="text-ink dark:text-ink-dark will-change-[opacity]"
    >
      {children}
      {!isLast ? " " : null}
    </motion.span>
  );
}

export default function ScrollHighlightBlock({
  headline,
  body,
  className = "",
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.88", "start 0.18"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 200,
    restDelta: 0.001,
  });

  const headlineWords = headline.split(" ");
  const bodyWords = body.split(" ");
  const totalWords = headlineWords.length + bodyWords.length;

  // Every word gets the same fade duration, including the last one —
  // spacing start points across (1 - duration) rather than the full [0,1]
  // and letting "end" clamp at 1, so later words aren't given a shorter
  // fade than earlier ones.
  const overlapFactor = 2.2;
  const duration = Math.min(1, (1 / totalWords) * overlapFactor);
  const usableRange = 1 - duration;

  const rangeFor = (index) => {
    const start = totalWords > 1 ? (index / (totalWords - 1)) * usableRange : 0;
    return [start, start + duration];
  };

  return (
    <div ref={containerRef} className={className}>
      {/* Real heading + paragraph for assistive tech — kept in the
          accessibility tree, visually hidden. The word-by-word version
          below is a decorative duplicate, hidden from screen readers. */}
      <h2 className="sr-only">{headline}</h2>
      <p className="sr-only">{body}</p>

      <div aria-hidden="true">
        <div className="mb-6 text-3xl font-medium leading-[1.25] tracking-tight md:text-4xl">
          {headlineWords.map((word, i) => (
            <Word
              key={`h-${i}`}
              progress={smoothProgress}
              range={rangeFor(i)}
              isLast={i === headlineWords.length - 1}
            >
              {word}
            </Word>
          ))}
        </div>

        <div className="text-base leading-relaxed md:text-lg">
          {bodyWords.map((word, i) => {
            const globalIndex = headlineWords.length + i;
            return (
              <Word
                key={`b-${i}`}
                progress={smoothProgress}
                range={rangeFor(globalIndex)}
                isLast={i === bodyWords.length - 1}
              >
                {word}
              </Word>
            );
          })}
        </div>
      </div>
    </div>
  );
}
