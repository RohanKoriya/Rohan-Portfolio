// import { motion } from "motion/react";
// import { useEffect, useRef, useState, useMemo } from "react";

// const buildKeyframes = (from, steps) => {
//   const keys = new Set([
//     ...Object.keys(from),
//     ...steps.flatMap((s) => Object.keys(s)),
//   ]);

//   const keyframes = {};
//   keys.forEach((k) => {
//     keyframes[k] = [from[k], ...steps.map((s) => s[k])];
//   });
//   return keyframes;
// };

// export default function BlurText({
//   text = "",
//   delay = 200,
//   className = "",
//   animateBy = "words",
//   direction = "top",
//   threshold = 0.1,
//   rootMargin = "0px",
//   animationFrom,
//   animationTo,
//   easing = (t) => t,
//   onAnimationComplete,
//   stepDuration = 0.35,
// }) {
//   const elements = animateBy === "words" ? text.split(" ") : text.split("");
//   const [inView, setInView] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     if (!ref.current) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setInView(true);
//           observer.unobserve(ref.current);
//         }
//       },
//       { threshold, rootMargin },
//     );
//     observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [threshold, rootMargin]);

//   const defaultFrom = useMemo(
//     () =>
//       direction === "top"
//         ? { filter: "blur(10px)", opacity: 0, y: -50 }
//         : { filter: "blur(10px)", opacity: 0, y: 50 },
//     [direction],
//   );

//   const defaultTo = useMemo(
//     () => [
//       {
//         filter: "blur(5px)",
//         opacity: 0.5,
//         y: direction === "top" ? 5 : -5,
//       },
//       { filter: "blur(0px)", opacity: 1, y: 0 },
//     ],
//     [direction],
//   );

//   const fromSnapshot = animationFrom ?? defaultFrom;
//   const toSnapshots = animationTo ?? defaultTo;

//   const stepCount = toSnapshots.length + 1;
//   const totalDuration = stepDuration * (stepCount - 1);
//   const times = Array.from({ length: stepCount }, (_, i) =>
//     stepCount === 1 ? 0 : i / (stepCount - 1),
//   );

//   return (
//     <p
//       ref={ref}
//       className={className}
//       style={{ display: "flex", flexWrap: "wrap" }}
//     >
//       {elements.map((segment, index) => {
//         const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

//         const spanTransition = {
//           duration: totalDuration,
//           times,
//           delay: (index * delay) / 1000,
//         };
//         spanTransition.ease = easing;

//         return (
//           <motion.span
//             className="inline-block will-change-[transform,filter,opacity]"
//             key={index}
//             initial={fromSnapshot}
//             animate={inView ? animateKeyframes : fromSnapshot}
//             transition={spanTransition}
//             onAnimationComplete={
//               index === elements.length - 1 ? onAnimationComplete : undefined
//             }
//           >
//             {segment === " " ? "\u00A0" : segment}
//             {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
//           </motion.span>
//         );
//       })}
//     </p>
//   );
// }

// import { motion } from "motion/react";
// import { useEffect, useMemo, useRef, useState } from "react";

// const buildKeyframes = (from, steps) => {
//   const keys = new Set([
//     ...Object.keys(from),
//     ...steps.flatMap((step) => Object.keys(step)),
//   ]);

//   const keyframes = {};

//   keys.forEach((key) => {
//     keyframes[key] = [from[key], ...steps.map((step) => step[key])];
//   });

//   return keyframes;
// };

// export default function BlurText({
//   text = "",
//   delay = 150,
//   className = "",
//   animateBy = "words",
//   direction = "top",
//   threshold = 0.1,
//   rootMargin = "0px",

//   animationFrom,
//   animationTo,

//   easing = [0.22, 1, 0.36, 1],

//   onAnimationComplete,

//   stepDuration = 0.45,

//   triggerOnView = true,

//   // Extra controls
//   blurAmount = 12,
//   yOffset = 30,
//   scaleFrom = 0.96,
// }) {
//   const elements = useMemo(
//     () => (animateBy === "words" ? text.split(" ") : text.split("")),
//     [text, animateBy],
//   );

//   const [inView, setInView] = useState(!triggerOnView);
//   const ref = useRef(null);

//   // Intersection Observer
//   useEffect(() => {
//     if (!triggerOnView) return;
//     if (!ref.current) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setInView(true);
//           observer.unobserve(entry.target);
//         }
//       },
//       {
//         threshold,
//         rootMargin,
//       },
//     );

//     observer.observe(ref.current);

//     return () => observer.disconnect();
//   }, [threshold, rootMargin, triggerOnView]);

//   // Starting position
//   const defaultFrom = useMemo(() => {
//     return {
//       filter: `blur(${blurAmount}px)`,
//       opacity: 0,
//       y: direction === "top" ? -yOffset : yOffset,
//       scale: scaleFrom,
//     };
//   }, [direction, blurAmount, yOffset, scaleFrom]);

//   // Animation steps
//   const defaultTo = useMemo(() => {
//     return [
//       {
//         filter: `blur(${Math.max(blurAmount / 2, 3)}px)`,
//         opacity: 0.5,
//         y: direction === "top" ? 4 : -4,
//         scale: 0.985,
//       },
//       {
//         filter: "blur(0px)",
//         opacity: 1,
//         y: 0,
//         scale: 1,
//       },
//     ];
//   }, [direction, blurAmount]);

//   const fromSnapshot = animationFrom ?? defaultFrom;
//   const toSnapshots = animationTo ?? defaultTo;

//   // Build keyframes only once instead of once per word
//   const animateKeyframes = useMemo(
//     () => buildKeyframes(fromSnapshot, toSnapshots),
//     [fromSnapshot, toSnapshots],
//   );

//   const stepCount = toSnapshots.length + 1;

//   const totalDuration = stepDuration * Math.max(toSnapshots.length, 1);

//   const times = useMemo(
//     () =>
//       Array.from({ length: stepCount }, (_, index) =>
//         stepCount === 1 ? 0 : index / (stepCount - 1),
//       ),
//     [stepCount],
//   );

//   return (
//     <p
//       ref={ref}
//       className={className}
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//       }}
//       aria-label={text}
//     >
//       {elements.map((segment, index) => {
//         const spanTransition = {
//           duration: totalDuration,
//           times,
//           delay: (index * delay) / 1000,
//           ease: easing,
//         };

//         return (
//           <motion.span
//             key={`${segment}-${index}`}
//             className="inline-block will-change-[transform,filter,opacity]"
//             initial={fromSnapshot}
//             animate={inView ? animateKeyframes : fromSnapshot}
//             transition={spanTransition}
//             onAnimationComplete={
//               index === elements.length - 1 ? onAnimationComplete : undefined
//             }
//           >
//             {segment === " " ? "\u00A0" : segment}

//             {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
//           </motion.span>
//         );
//       })}
//     </p>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((step) => Object.keys(step)),
  ]);

  const keyframes = {};

  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])];
  });

  return keyframes;
};

export default function BlurText({
  text = "",
  delay = 150,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = [0.22, 1, 0.36, 1],
  onAnimationComplete,
  stepDuration = 0.45,
  triggerOnView = true,
  blurAmount = 12,
  yOffset = 30,
  scaleFrom = 0.96,
}) {
  const elements = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy],
  );

  const [inView, setInView] = useState(!triggerOnView);
  const ref = useRef(null);

  useEffect(() => {
    if (!triggerOnView) return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnView]);

  const defaultFrom = useMemo(() => {
    return {
      filter: `blur(${blurAmount}px)`,
      opacity: 0,
      y: direction === "top" ? -yOffset : yOffset,
      scale: scaleFrom,
    };
  }, [direction, blurAmount, yOffset, scaleFrom]);

  const defaultTo = useMemo(() => {
    return [
      {
        filter: `blur(${Math.max(blurAmount / 2, 3)}px)`,
        opacity: 0.5,
        y: direction === "top" ? 4 : -4,
        scale: 0.985,
      },
      {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
        scale: 1,
      },
    ];
  }, [direction, blurAmount]);

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const animateKeyframes = useMemo(
    () => buildKeyframes(fromSnapshot, toSnapshots),
    [fromSnapshot, toSnapshots],
  );

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * Math.max(toSnapshots.length, 1);

  const times = useMemo(
    () =>
      Array.from({ length: stepCount }, (_, index) =>
        stepCount === 1 ? 0 : index / (stepCount - 1),
      ),
    [stepCount],
  );

  return (
    <p
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
      aria-label={text}
    >
      {elements.map((segment, index) => {
        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            key={`${segment}-${index}`}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
}
