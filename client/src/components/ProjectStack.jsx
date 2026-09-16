import { useRef } from "react";
import { useScroll, useTransform, useMotionTemplate } from "motion/react";

import { projects } from "../data/projects.js";
import ProjectCard from "./ProjectCard.jsx";

const STACK_OFFSET_PX = 22;
const BASE_TOP_PX = 96;

function StackedCard({ project, index, total, cardRef, nextCardRef }) {
  const isLast = index === total - 1;

  const { scrollYProgress: nextCardProgress } = useScroll({
    target: nextCardRef,
    offset: [
      "start end",
      `start ${BASE_TOP_PX + (index + 1) * STACK_OFFSET_PX}px`,
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

  const filter = useMotionTemplate`
    
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
        index={index}
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

      {/* Mobile: normal list */}
      <div className="flex flex-col gap-6 md:hidden">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
