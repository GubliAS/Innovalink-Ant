"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setEmail("");

        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 5000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 items-start"
        >
          <div className="flex-1 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-full text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
            <p
              className={`mt-2 px-6 text-sm min-h-5 ${
                message.text
                  ? message.type === "success"
                    ? "text-green-500"
                    : "text-red-500"
                  : ""
              }`}
            >
              {message.text}
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer hover:opacity-90 bg-linear-to-r from-[#09C00E] to-[#045A07] text-white px-8 py-4 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
          >
            {loading ? "Joining..." : "Join the Waitlist"}
            {!loading && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
