import { motion } from "motion/react";
import ContactForm from "../components/ContactForm.jsx";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 border-t border-dashed border-line dark:border-line-dark sm:py-24 md:py-28"
    >
      <div className="container-content">
        <div className="grid grid-cols-1 items-start gap-12 md:gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          {/* Left: Contact introduction */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:pt-2"
          >
            <h2 className="max-w-md mt-5 text-4xl font-medium tracking-tight sm:text-4xl">
              Say hello.
            </h2>

            <p className="max-w-md mt-6 text-base leading-7 text-muted dark:text-muted-dark">
              I'm currently looking for a full-time software engineering role.
              Have an opportunity on your team, or just want to talk about what
              you're building? I'd love to hear from you.
            </p>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="w-full min-w-0 lg:ml-auto lg:max-w-xl"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
