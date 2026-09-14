import { motion } from "motion/react";
import ContactForm from "../components/ContactForm.jsx";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 border-t md:py-32 border-line dark:border-line-dark"
    >
      <div className="container-content">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">Contact</span>
            <h2 className="max-w-sm mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              Let's talk about your team.
            </h2>
            <p className="max-w-sm mt-6 text-base leading-relaxed text-muted dark:text-muted-dark">
              Open to full-time roles. Excited to chat about challenging
              projects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
