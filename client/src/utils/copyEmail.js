import { toast } from "sonner";
import { EMAIL } from "../data/Site.js";

/**
 * Copies EMAIL to the clipboard and shows a confirmation toast. Works as a
 * click handler on a real <a href="mailto:...">, so it still degrades
 * gracefully: preventDefault() stops the mail client from opening on
 * success, but if the Clipboard API is unavailable (e.g. an insecure
 * context) it falls back to the normal mailto navigation instead.
 */
export function copyEmail(event) {
  if (!navigator.clipboard?.writeText) {
    return; // let the native mailto: href handle it
  }

  event?.preventDefault();

  navigator.clipboard
    .writeText(EMAIL)
    .then(() => toast.success("Email copied to clipboard"))
    .catch(() => {
      window.location.href = `mailto:${EMAIL}`;
    });
}