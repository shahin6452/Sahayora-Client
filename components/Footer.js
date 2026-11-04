
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-white">
                S
              </span>

              <span className="text-xl font-extrabold tracking-tight">
                sahayora<span className="text-accent">.</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-muted">
              Together, we make a difference. Bringing people and meaningful
              causes together for a better tomorrow.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 text-sm">
            <div>
              <h4 className="mb-4 font-extrabold">Explore</h4>

              <div className="flex flex-col gap-3 text-muted">
                <Link href="/events" className="hover:text-primary">
                  Events
                </Link>
                <Link href="/#about" className="hover:text-primary">
                  About us
                </Link>
                <Link href="/#how-it-works" className="hover:text-primary">
                  How it works
                </Link>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-extrabold">Get involved</h4>

              <div className="flex flex-col gap-3 text-muted">
                <Link href="/register" className="hover:text-primary">
                  Become a volunteer
                </Link>
                <Link href="/login" className="hover:text-primary">
                  Log in
                </Link>
                <Link href="/register" className="hover:text-primary">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© 2026 Sahayora. All rights reserved.</p>
          <p>Made with care, for a better tomorrow. ✳</p>
        </div>
      </div>
    </footer>
  );
}
