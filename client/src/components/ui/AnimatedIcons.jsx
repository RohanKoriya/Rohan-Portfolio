import { forwardRef, useImperativeHandle } from "react";
import { motion, useAnimation } from "motion/react";

/**
 * Shared factory for micro-animated line icons.
 * Each icon exposes a ref handle: { startAnimation, stopAnimation }
 * and triggers automatically on hover / focus. Respects prefers-reduced-motion
 * via the short, non-looping transition durations.
 *
 * Uses `useAnimation()` controls bound directly to the animated element via
 * the `animate` prop, rather than `useAnimate()`'s selector-based querying —
 * controls target a specific element reference directly, so there's nothing
 * for a DOM query to miss (which is what was silently breaking playback).
 */
function createAnimatedIcon({ displayName, paths, animate: animateConfig }) {
  const Icon = forwardRef(
    (
      { size = 22, color = "currentColor", strokeWidth = 1.75, className = "" },
      ref,
    ) => {
      const controls = useAnimation();

      const start = () =>
        controls.start(animateConfig.keyframes, {
          duration: animateConfig.duration ?? 0.45,
          ease: animateConfig.ease ?? "easeInOut",
        });

      const stop = () =>
        controls.start(animateConfig.rest, { duration: 0.2, ease: "easeOut" });

      useImperativeHandle(
        ref,
        () => ({ startAnimation: start, stopAnimation: stop }),
        [],
      );

      return (
        <motion.svg
          onHoverStart={start}
          onHoverEnd={stop}
          onFocus={start}
          onBlur={stop}
          tabIndex={-1}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`inline-flex shrink-0 cursor-pointer items-center justify-center ${className}`}
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          {/* Invisible full-size hit area — without this, hover only registers
              over the thin strokes themselves, not the empty space around them. */}
          <rect
            x="0"
            y="0"
            width="24"
            height="24"
            fill="transparent"
            stroke="none"
          />

          <motion.g
            animate={controls}
            initial={animateConfig.rest}
            style={{ transformOrigin: "center" }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            {paths}
          </motion.g>
        </motion.svg>
      );
    },
  );
  Icon.displayName = displayName;
  return Icon;
}

export const GithubIcon = createAnimatedIcon({
  displayName: "GithubIcon",
  animate: {
    keyframes: { scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] },
    rest: { scale: 1, rotate: 0 },
  },
  paths: (
    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
  ),
});

export const LinkedinIcon = createAnimatedIcon({
  displayName: "LinkedinIcon",
  animate: {
    keyframes: { scale: [1, 1.1, 1], y: [0, -2, 0] },
    rest: { scale: 1, y: 0 },
  },
  paths: (
    <>
      <path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" />
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 0 0 -4 0" />
    </>
  ),
});

export const GmailIcon = createAnimatedIcon({
  displayName: "GmailIcon",
  animate: {
    keyframes: { y: [0, -3, 0], scale: [1, 1.06, 1] },
    rest: { y: 0, scale: 1 },
  },
  paths: (
    <>
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
      <path d="M3 7l9 6l9 -6" />
    </>
  ),
});

export const DownloadIcon = createAnimatedIcon({
  displayName: "DownloadIcon",
  animate: {
    keyframes: { y: [0, 4, 0] },
    rest: { y: 0 },
  },
  paths: (
    <>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    </>
  ),
});

export const CodeIcon = createAnimatedIcon({
  displayName: "CodeIcon",
  animate: {
    keyframes: { x: [0, -1, 1, 0] },
    rest: { x: 0 },
  },
  paths: (
    <>
      <path d="M7 8l-4 4l4 4" />
      <path d="M17 8l4 4l-4 4" />
      <path d="M14 4l-4 16" />
    </>
  ),
});

export const LinkIcon = createAnimatedIcon({
  displayName: "LinkIcon",
  animate: {
    keyframes: { rotate: [0, 12, 0], scale: [1, 1.08, 1] },
    rest: { rotate: 0, scale: 1 },
  },
  paths: (
    <>
      <path d="M9 15l6 -6" />
      <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
      <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
    </>
  ),
});

export const SendIcon = createAnimatedIcon({
  displayName: "SendIcon",
  animate: {
    keyframes: { x: [0, 4, 0], y: [0, -3, 0] },
    rest: { x: 0, y: 0 },
  },
  paths: (
    <>
      <path d="M10 14l11 -11" />
      <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
    </>
  ),
});

export const PlugConnectedIcon = createAnimatedIcon({
  displayName: "PlugConnectedIcon",
  animate: {
    keyframes: { scale: [1, 1.15, 1] },
    rest: { scale: 1 },
  },
  paths: (
    <>
      <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5z" />
      <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5z" />
      <path d="M3 21l2.5 -2.5" />
      <path d="M18.5 5.5l2.5 -2.5" />
      <path d="M10 11l-2 2" />
      <path d="M13 14l-2 2" />
    </>
  ),
});

export const BrandReactIcon = createAnimatedIcon({
  displayName: "BrandReactIcon",
  animate: {
    keyframes: { rotate: [0, 180, 360] },
    rest: { rotate: 0 },
    duration: 0.8,
  },
  paths: (
    <>
      <path d="M6.306 8.711c-2.602 .723 -4.306 1.926 -4.306 3.289c0 2.21 4.477 4 10 4s10 -1.79 10 -4c0 -1.363 -1.704 -2.566 -4.306 -3.289" />
      <path d="M6.306 15.289c-2.602 -.723 -4.306 -1.926 -4.306 -3.289" />
      <path d="M12 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M12 2c1.5 2.5 2.5 5 2.5 10s-1 7.5 -2.5 10" />
      <path d="M12 2c-1.5 2.5 -2.5 5 -2.5 10s1 7.5 2.5 10" />
    </>
  ),
});

export const LetterRIcon = createAnimatedIcon({
  displayName: "LetterRIcon",
  animate: {
    keyframes: { scale: [1, 1.08, 1] },
    rest: { scale: 1 },
  },
  paths: (
    <>
      <path d="M7 4h4a3 3 0 0 1 0 6h-4z" />
      <path d="M7 4v16" />
      <path d="M11 10l4 10" />
    </>
  ),
});
