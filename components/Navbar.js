
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "../lib/auth-client";
import { useAuth } from "../app/providers";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useAuth();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Unable to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
            S
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            sahayora<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-9 text-sm font-semibold md:flex">
          <Link href="/events" className="transition hover:text-primary">
            Explore Events
          </Link>
          <Link href="/#about" className="transition hover:text-primary">
            About Us
          </Link>
          <Link href="/#how-it-works" className="transition hover:text-primary">
            How It Works
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {!isPending && (
            user ? (
              <div className="group relative">
                <button
                  type="button"
                  aria-label="Open profile menu"
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-primary-light font-bold text-primary"
                >
                  <img
                    src={
                      user.image?.trim() ||
                      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
                        user.name || user.email || "Sahayora"
                      )}`
                    }
                    alt={`${user.name || "User"} avatar`}
                    className="h-full w-full object-cover"
                  />
                </button>

                <div className="invisible absolute right-0 top-full z-50 w-56 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-xl border border-border bg-surface p-3 shadow-xl">

                    <p className="truncate px-3 py-2 font-bold">
                      {user.name}
                    </p>

                    <p className="truncate px-3 pb-3 text-xs text-muted">
                      {user.email}
                    </p>

                    <div className="border-t border-border pt-2">
                      <Link
                        href="/create-event"
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-light hover:text-primary"
                      >
                        Create Event
                      </Link>

                      <Link
                        href="/manage-events"
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-light hover:text-primary"
                      >
                        Manage Events
                      </Link>

                      <Link
                        href="/joined-events"
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-light hover:text-primary"
                      >
                        Joined Events
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="mt-2 w-full border-t border-border px-3 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden px-3 py-2 text-sm font-bold transition hover:text-primary sm:block"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                >
                  Get Started <span className="ml-1">↗</span>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
