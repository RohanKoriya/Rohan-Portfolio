const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function submitContactForm(payload) {
  const response = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.errors?.[0]?.message || data?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}
