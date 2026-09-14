import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRef } from "react";
import { SendIcon } from "./ui/AnimatedIcons.jsx";
import { submitContactForm } from "../utils/api.js";

const MESSAGE_MAX = 600;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(MESSAGE_MAX, `Keep it under ${MESSAGE_MAX} characters`),
  // Honeypot: real visitors never see this field, so it should always arrive
  // empty. If a bot fills every field it finds, validation rejects the
  // submission here, before it ever reaches onSubmit or the network.
  company: z.string().max(0, "").optional(),
});

function fieldClasses(hasError) {
  return hasError
    ? "border-red-400 dark:border-red-500/60 focus:border-red-500 focus:ring-red-500/10"
    : "border-line dark:border-line-dark focus:border-ink dark:focus:border-ink-dark focus:ring-ink/5 dark:focus:ring-ink-dark/10";
}

export default function ContactForm() {
  const sendRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const messageLength = watch("message")?.length ?? 0;
  const nameValid = touchedFields.name && !errors.name;
  const emailValid = touchedFields.email && !errors.email;

  const onSubmit = async ({ company, ...values }) => {
    try {
      await submitContactForm(values);
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error(error.message || "Error submitting form. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative flex flex-col gap-5"
    >
      {/* Honeypot — hidden from sighted and keyboard users, still visible to simple bots */}
      <div
        className="absolute -left-[9999px] top-0 opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-sm text-muted dark:text-muted-dark"
          >
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
              className={`w-full rounded-xl border bg-transparent px-4 py-3 pr-9 text-sm outline-none transition-colors focus:ring-4 ${fieldClasses(
                errors.name,
              )}`}
              placeholder="Jane Doe"
            />
            {nameValid && (
              <CheckCircle2
                size={16}
                aria-hidden="true"
                className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-signal"
              />
            )}
          </div>
          {errors.name && (
            <span
              id="name-error"
              role="alert"
              className="text-xs text-red-600 dark:text-red-400"
            >
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm text-muted dark:text-muted-dark"
          >
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className={`w-full rounded-xl border bg-transparent px-4 py-3 pr-9 text-sm outline-none transition-colors focus:ring-4 ${fieldClasses(
                errors.email,
              )}`}
              placeholder="jane@company.com"
            />
            {emailValid && (
              <CheckCircle2
                size={16}
                aria-hidden="true"
                className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-signal"
              />
            )}
          </div>
          {errors.email && (
            <span
              id="email-error"
              role="alert"
              className="text-xs text-red-600 dark:text-red-400"
            >
              {errors.email.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="message"
            className="text-sm text-muted dark:text-muted-dark"
          >
            Message
          </label>
          <span
            className={`font-mono text-xs ${
              messageLength > MESSAGE_MAX
                ? "text-red-500"
                : "text-muted/70 dark:text-muted-dark/70"
            }`}
          >
            {messageLength}/{MESSAGE_MAX}
          </span>
        </div>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
          className={`resize-none rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:ring-4 ${fieldClasses(
            errors.message,
          )}`}
          placeholder="Tell me a bit about the role or project…"
        />
        {errors.message && (
          <span
            id="message-error"
            role="alert"
            className="text-xs text-red-600 dark:text-red-400"
          >
            {errors.message.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        onMouseEnter={() => sendRef.current?.startAnimation()}
        onMouseLeave={() => sendRef.current?.stopAnimation()}
        className="inline-flex items-center self-start justify-center gap-2 px-6 py-3 mt-1 text-sm font-medium transition-opacity rounded-full bg-ink dark:bg-ink-dark text-canvas dark:text-canvas-dark hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <SendIcon ref={sendRef} size={16} />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
