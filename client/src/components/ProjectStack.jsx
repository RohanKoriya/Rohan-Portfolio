import { projects } from "../data/projects.js";
import ProjectCard from "./ProjectCard.jsx";

/*
  The first project is featured: full width on tablet and up, with the image
  and text side by side. The rest sit in a two-column grid below it.
  Order your best project first in projects.js.
*/
export default function ProjectStack() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      {projects.map((project, index) => {
        const featured = index === 0;
        return (
          <div key={project.id} className={featured ? "md:col-span-2" : ""}>
            <ProjectCard project={project} featured={featured} />
          </div>
        );
      })}
    </div>
  );
}
