import { motion } from "motion/react";
import ProjectStack from "../components/ProjectStack.jsx";

export default function ProjectsSection() {
  return (
    <section id="work" className="py-24 md:py-32 border-t border-line dark:border-line-dark">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-md mb-14"
        >
          <span className="eyebrow">Selected work</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight">
            Four projects, end to end.
          </h2>
        </motion.div>
      </div>

      <div className="container-content">
        <ProjectStack />
      </div>
    </section>
  );
}
