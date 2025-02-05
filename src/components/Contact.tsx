"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegPaperPlane } from "react-icons/fa";

type FormData = {
  email: string;
  message: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ABSTRACT_API_KEY;

      if (!apiKey) {
        alert("Internal error: API key missing.");
        return;
      }

      const emailValidationResponse = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${data.email}`,
      );
      const emailValidation = await emailValidationResponse.json();

      if (emailValidation.deliverability !== "DELIVERABLE") {
        alert("Please enter a valid email address.");
        return;
      }

      // Send the form data to Formspree
      const response = await fetch("https://formspree.io/f/manqjzvn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        reset(); // Clear form on success
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Network error. Please check your internet connection.");
    }
  };

  return (
    <div className="w-full mx-auto p-16">
      <h1 className="text-7xl tracking-tight font-bold mb-4">Contact Us</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl space-y-4 p-6 border rounded-lg"
      >
        <div>
          <label className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full mt-1 p-2 border-b border-b-primary text-sm focus:outline-none"
            placeholder="Your Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm  text-foreground">Message</label>
          <textarea
            {...register("message", { required: "Message cannot be empty" })}
            className="w-full mt-1 p-2 border-b border-b-primary text-sm focus:outline-none"
            placeholder="Your Message"
            rows={4}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-white dark:text-gray-800 rounded-md hover:bg-primary transition-all duration-300 disabled:opacity-50"
        >
          <FaRegPaperPlane className="text-lg transition-transform duration-300" />
          <span className="text-base transition-opacity duration-300">
            {isSubmitting ? "Sending..." : "Send"}
          </span>
        </button>
      </form>
    </div>
  );
}
