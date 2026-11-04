
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Login successful! Welcome back.");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
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
                Welcome back to your community.
              </h1>

              <p className="mt-6 leading-7 text-white/80">
                Every small action creates a meaningful impact.
                Continue your journey with Sahayora.
              </p>
            </div>

            <p className="text-sm text-white/60">
              Small actions. Real impact.
            </p>
          </div>

          <div className="px-6 py-10 sm:px-12 md:py-16">
            <Link
              href="/"
              className="text-xl font-bold text-[#5146A5] md:hidden"
            >
              Sahayora.
            </Link>

            <div className="mt-8 md:mt-0">
              <h2 className="text-3xl font-bold">Welcome back</h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to continue making a difference.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#5146A5] focus:ring-2 focus:ring-[#5146A5]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#5146A5] focus:ring-2 focus:ring-[#5146A5]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#5146A5] px-5 py-3.5 font-semibold text-white transition hover:bg-[#40368E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#5146A5] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
