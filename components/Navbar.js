
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "../lib/auth-client";
import { useAuth } from "../app/providers";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useAuth();
  const user = session?.user;

  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sahayora-theme") || "light";

    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("sahayora-theme", nextTheme);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut();
      closeMenu();
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Unable to log out. Please try again.");
    }
  };

  const navLinks = [
    { href: "/events", label: "Upcoming Events" },
    { href: "/#about", label: "About Us" },
    { href: "/#how-it-works", label: "How It Works" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
            S
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            sahayora<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-9 text-sm font-semibold text-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-xl text-foreground transition hover:bg-primary-light"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {!isPending && user && (
            <>
              {/* Desktop Profile */}
              <div className="group relative hidden md:block">
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
                  <div className="rounded-xl border border-border bg-surface p-3 text-foreground shadow-xl">
                    <p className="truncate px-3 py-2 font-bold">
                      {user.name}
                    </p>

                    <p className="truncate px-3 pb-3 text-xs text-muted">
                      {user.email}
                    </p>

                    <div className="border-t border-border pt-2">
                      <Link href="/create-event" className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-light hover:text-primary">
                        Create Event
                      </Link>

                      <Link href="/manage-events" className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-light hover:text-primary">
                        Manage Events
                      </Link>

                      <Link href="/joined-events" className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-light hover:text-primary">
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

              {/* Mobile Avatar */}
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-primary-light md:hidden">
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
              </div>
            </>
          )}

          {!isPending && !user && (
            <>
              <Link
                href="/login"
                className="hidden px-3 py-2 text-sm font-bold text-foreground transition hover:text-primary sm:block"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="hidden rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover sm:inline-flex"
              >
                Get Started <span className="ml-1">↗</span>
              </Link>
            </>
          )}

          {/* Hamburger Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-2xl text-foreground transition hover:bg-primary-light md:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-5 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-primary-light hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="px-4 font-bold text-foreground">{user.name}</p>
              <p className="truncate px-4 pb-3 text-xs text-muted">
                {user.email}
              </p>

              <Link href="/create-event" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary-light hover:text-primary">
                Create Event
              </Link>

              <Link href="/manage-events" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary-light hover:text-primary">
                Manage Events
              </Link>

              <Link href="/joined-events" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary-light hover:text-primary">
                Joined Events
              </Link>

              <button
                onClick={handleLogout}
                className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                Log out
              </button>
            </div>
          )}

          {!isPending && !user && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <Link
                href="/login"
                onClick={closeMenu}
                className="rounded-full border border-border px-4 py-3 text-center text-sm font-bold text-foreground"
              >
                Log in
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="rounded-full bg-primary px-4 py-3 text-center text-sm font-bold text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
