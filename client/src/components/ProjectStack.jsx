import { useRef } from "react";
import { useScroll, useTransform, useMotionTemplate } from "motion/react";

import { projects } from "../data/projects.js";
import ProjectCard from "./ProjectCard.jsx";

const STACK_OFFSET_PX = 22;
const BASE_TOP_PX = 96;

function StackedCard({
  project,
  index,
  total,
  cardRef,
  nextCardRef,
  thirdCardRef,
}) {
  const isLast = index === total - 1;

  // Track the next card scrolling over
  const { scrollYProgress: nextCardProgress } = useScroll({
    target: nextCardRef,
    offset: [
      "start end",
      `start ${BASE_TOP_PX + (index + 1) * STACK_OFFSET_PX}px`,
    ],
    layoutEffect: false,
  });

  // Track the card 2 steps ahead to handle opacity fade out
  const { scrollYProgress: thirdCardProgress } = useScroll({
    target: thirdCardRef,
    offset: [
      "start end",
      `start ${BASE_TOP_PX + (index + 2) * STACK_OFFSET_PX}px`,
    ],
    layoutEffect: false,
  });

  const blur = useTransform(
    nextCardProgress,
    [0, 0.6, 0.75, 1],
    [0, 0, isLast ? 0 : 0.5, isLast ? 0 : 1.5],
  );

  const scale = useTransform(
    nextCardProgress,
    [0, 0.6, 1],
    [1, 1, isLast ? 1 : 0.97],
  );

  // FIX: Fade out card completely when 3rd card arrives
  // If there is no third card ref (near the end), keep opacity at 1
  const opacity = useTransform(
    thirdCardProgress,
    [0, 0.5, 0.9],
    [1, 1, thirdCardRef === cardRef ? 1 : 0],
  );

  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <div
      ref={cardRef}
      className="sticky"
      style={{
        top: `${BASE_TOP_PX + index * STACK_OFFSET_PX}px`,
        zIndex: index + 1,
        willChange: "transform, filter, opacity",
      }}
    >
      <ProjectCard
        project={project}
        index={index}
        style={{
          scale,
          opacity,
          filter,
          transformOrigin: "top center",
        }}
      />
    </div>
  );
}

export default function ProjectStack() {
  const cardRefs = useRef(
    projects.map(() => ({
      current: null,
    })),
  );

  return (
    <>
      <div
        className="relative hidden md:block"
        style={{
          height: `${projects.length * 62}vh`,
        }}
      >
        {projects.map((project, index) => (
          <StackedCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            cardRef={cardRefs.current[index]}
            nextCardRef={cardRefs.current[index + 1] || cardRefs.current[index]}
            // Explicit reference to card 2 steps ahead (without intermediate fallback)
            thirdCardRef={
              cardRefs.current[index + 2] || cardRefs.current[index]
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-6 md:hidden">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
