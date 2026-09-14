import { useRef } from "react";
import { useScroll, useTransform, useMotionTemplate } from "motion/react";

import { projects } from "../data/projects.js";
import ProjectCard from "./ProjectCard.jsx";

const STACK_OFFSET_PX = 22;
const BASE_TOP_PX = 96;

function StackedCard({ project, index, total, cardRef, nextCardRef }) {
  const isLast = index === total - 1;

  /*
   * Track the ACTUAL scroll position of the next card.
   *
   * 0 = next card is just entering the viewport
   * 1 = next card has reached its sticky position
   */
  const { scrollYProgress: nextCardProgress } = useScroll({
    target: nextCardRef,
    offset: [
      "start end",
      `start ${BASE_TOP_PX + (index + 1) * STACK_OFFSET_PX}px`,
    ],
    layoutEffect: false,
  });

  /*
   * Previous card remains completely sharp
   * until the next card has covered approximately 60%.
   */
  const blur = useTransform(
    nextCardProgress,
    [0, 0.6, 0.75, 1],
    [0, 0, isLast ? 0 : 0.8, isLast ? 0 : 2],
  );

  /*
   * Slightly darken the previous card only after
   * the next card has reached around 60%.
   */
  const brightness = useTransform(
    nextCardProgress,
    [0, 0.6, 0.75, 1],
    [1, 1, isLast ? 1 : 0.9, isLast ? 1 : 0.82],
  );

  /*
   * Slight scale-down as the next card takes focus.
   */
  const scale = useTransform(
    nextCardProgress,
    [0, 0.6, 1],
    [1, 1, isLast ? 1 : 0.96],
  );

  const filter = useMotionTemplate`
    brightness(${brightness})
    blur(${blur}px)
  `;

  return (
    <div
      ref={cardRef}
      className="sticky"
      style={{
        top: `${BASE_TOP_PX + index * STACK_OFFSET_PX}px`,
        zIndex: index + 1,
      }}
    >
      <ProjectCard
        project={project}
        style={{
          scale,
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
      {/* Desktop: sticky overlapping stack */}
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
          />
        ))}
      </div>

      {/* Mobile: normal cards */}
      <div className="flex flex-col gap-6 md:hidden">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
