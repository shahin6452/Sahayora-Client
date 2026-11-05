
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await signIn.email({
        email: email.trim(),
        password,
        callbackURL: `${window.location.origin}/`,
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

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const { error } = await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch (error) {
      toast.error("Unable to login with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (isPending || session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-surface shadow-xl md:grid-cols-2">
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
              className="text-xl font-bold text-primary md:hidden"
            >
              Sahayora.
            </Link>

            <div className="mt-8 md:mt-0">
              <h2 className="text-3xl font-bold">Welcome back</h2>

              <p className="mt-2 text-sm text-muted">
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
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
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
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full rounded-xl bg-[#5146A5] px-5 py-3.5 font-semibold text-white transition hover:bg-[#40368E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-surface px-4 text-sm text-muted">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-5 py-3.5 font-semibold text-foreground transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                "Connecting to Google..."
              ) : (
                <>
                  <svg
                    viewBox="0 0 48 48"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      transform="translate(0 6)"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6c4.51-4.17 7.07-10.31 7.07-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56z"
                      transform="translate(0 6)"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.47 0 11.9-2.13 15.87-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.14 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p className="mt-7 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
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
