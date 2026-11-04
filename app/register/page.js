
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(form.password)) {
      toast.error("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(form.password)) {
      toast.error("Password must contain a lowercase letter.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.image.trim() || undefined,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF8F2] px-5 py-12 text-[#25233A]">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-[#5146A5] p-12 text-white md:flex">
            <Link href="/" className="text-2xl font-bold">
              Sahayora.
            </Link>

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#E8C96A]">
                Together, We Make a Difference
              </p>
              <h1 className="text-5xl font-bold leading-tight">
                Be part of something meaningful.
              </h1>
              <p className="mt-6 leading-7 text-white/80">
                Join a community of people creating positive change through
                kindness, volunteering and social initiatives.
              </p>
            </div>

            <p className="text-sm text-white/60">
              Small actions. Real impact.
            </p>
          </div>

          <div className="px-6 py-10 sm:px-12 md:py-14">
            <Link
              href="/"
              className="text-xl font-bold text-[#5146A5] md:hidden"
            >
              Sahayora.
            </Link>

            <div className="mt-8 md:mt-0">
              <h2 className="text-3xl font-bold">Create your account</h2>
              <p className="mt-2 text-sm text-gray-500">
                Start making a difference in your community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#5146A5] focus:ring-2 focus:ring-[#5146A5]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#5146A5] focus:ring-2 focus:ring-[#5146A5]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Profile Photo URL
                  <span className="ml-2 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#5146A5] focus:ring-2 focus:ring-[#5146A5]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#5146A5] focus:ring-2 focus:ring-[#5146A5]/10"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Minimum 6 characters, including uppercase and lowercase
                  letters.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#5146A5] px-5 py-3.5 font-semibold text-white transition hover:bg-[#40368E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#5146A5] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
