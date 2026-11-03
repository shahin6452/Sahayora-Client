
import Link from "next/link";

const events = [
  {
    id: 1,
    category: "COMMUNITY CARE",
    title: "A Warmer Winter for Everyone",
    description:
      "Help families stay warm by collecting and distributing winter essentials to those who need them.",
    date: "DEC 15, 2026",
    location: "Dhaka, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=900&q=85",
    color: "#F08A72",
    number: "01",
  },
  {
    id: 2,
    category: "ENVIRONMENT",
    title: "Grow Something Good",
    description:
      "Bring your community together for a day of planting trees and creating greener neighbourhoods.",
    date: "DEC 20, 2026",
    location: "Sylhet, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=85",
    color: "#A59AF2",
    number: "02",
  },
  {
    id: 3,
    category: "EDUCATION",
    title: "Pages Full of Possibilities",
    description:
      "Donate books and learning materials to help children discover new opportunities through education.",
    date: "DEC 28, 2026",
    location: "Chattogram, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=85",
    color: "#E8C96A",
    number: "03",
  },
];

const ArrowUpRight = () => (
  <span aria-hidden="true" className="text-xl leading-none">
    ↗
  </span>
);

export default function Home() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* NAVBAR */}
      <header className="relative z-20 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
              S
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              sahayora<span className="text-accent">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-sm font-semibold md:flex">
            <Link href="#events" className="transition hover:text-primary">
              Explore Events
            </Link>
            <Link href="#about" className="transition hover:text-primary">
              About Us
            </Link>
            <Link href="#how-it-works" className="transition hover:text-primary">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-24">
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                A little good goes a long way
              </span>
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[82px]">
              Make room
              <br />
              for <span className="text-primary">good.</span>
              <br />
              Make it
              <br />
              <span className="relative inline-block">
                happen.
                <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-2 rounded-full bg-accent/50" />
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-8 text-muted sm:text-lg">
              Big change doesn't need a big beginning. Find meaningful
              community events, meet people who care, and turn small acts
              into something wonderful.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-1 hover:bg-primary-hover"
              >
                Explore Events <ArrowUpRight />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 font-bold transition hover:border-primary hover:text-primary"
              >
                Become a Volunteer
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-5 border-t border-border pt-7">
              <div className="flex -space-x-3">
                {[
                  "photo-1534528741775-53994a69daeb",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1531123897727-8f129e1688ce",
                ].map((photo) => (
                  <img
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?w=100&q=80`}
                    alt="Community volunteer"
                    className="h-11 w-11 rounded-full border-[3px] border-background object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-extrabold">People who care.</p>
                <p className="text-xs text-muted">
                  Coming together for a better tomorrow.
                </p>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="relative aspect-[0.92]">
              <div className="absolute right-2 top-0 h-[77%] w-[76%] overflow-hidden rounded-[48%_48%_18px_18px] bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1000&q=90"
                  alt="Volunteers working together"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute bottom-[4%] left-0 h-[46%] w-[51%] overflow-hidden rounded-2xl border-[7px] border-background shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=700&q=85"
                  alt="Community volunteering"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute left-[4%] top-[9%] flex h-20 w-20 rotate-[-12deg] items-center justify-center rounded-2xl bg-highlight text-4xl shadow-lg sm:h-24 sm:w-24">
                ✳
              </div>

              <div className="absolute bottom-[10%] right-0 max-w-[190px] rounded-2xl bg-primary p-5 text-white shadow-xl sm:max-w-[215px] sm:p-6">
                <p className="text-3xl font-extrabold">01.</p>
                <p className="mt-2 text-sm font-semibold leading-6">
                  Every little action can make a real difference.
                </p>
                <div className="mt-3 text-2xl text-accent">↗</div>
              </div>

              <div className="absolute right-[5%] top-[4%] -z-10 h-28 w-28 rounded-full border border-accent sm:h-36 sm:w-36" />
            </div>
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="bg-primary py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 text-center sm:px-8 lg:justify-between lg:px-10">
          <p className="text-sm font-bold tracking-wide sm:text-base">
            PEOPLE
          </p>
          <span className="text-2xl text-accent">✳</span>
          <p className="text-sm font-bold tracking-wide sm:text-base">
            PURPOSE
          </p>
          <span className="text-2xl text-accent">✳</span>
          <p className="text-sm font-bold tracking-wide sm:text-base">
            POSITIVE CHANGE
          </p>
          <span className="text-2xl text-accent">✳</span>
          <p className="text-sm font-bold tracking-wide sm:text-base">
            TOGETHER
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              WHY SAHAYORA?
            </p>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Good things grow when we grow <span className="text-primary">together.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <p className="text-lg leading-9 text-muted">
              We believe every person has something valuable to give. A little
              time, a helping hand, a donated book, or a planted tree can
              create a ripple of positive change. Sahayora brings people and
              meaningful causes together.
            </p>
            <Link
              href="/events"
              className="inline-flex w-fit items-center gap-3 border-b-2 border-primary pb-2 font-extrabold text-primary transition hover:gap-5"
            >
              Discover our community <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-surface-secondary py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
                SIMPLE AS THAT
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Three steps. <span className="text-primary">Real impact.</span>
              </h2>
            </div>
            <p className="max-w-sm leading-7 text-muted">
              You don't need to change the whole world. Just start somewhere.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Find your cause",
                description:
                  "Explore community events and discover something that matters to you.",
                symbol: "⌕",
              },
              {
                number: "02",
                title: "Show up & join in",
                description:
                  "Join an event, meet like-minded people, and become part of the action.",
                symbol: "↗",
              },
              {
                number: "03",
                title: "Make a difference",
                description:
                  "Share your time and skills to create positive change in your community.",
                symbol: "✳",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-border bg-surface p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold tracking-widest text-accent">
                    {item.number}
                  </span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-3xl text-primary">
                    {item.symbol}
                  </span>
                </div>
                <h3 className="mt-10 text-2xl font-extrabold">{item.title}</h3>
                <p className="mt-4 leading-7 text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              FIND YOUR NEXT GOOD THING
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Get out there. <span className="text-primary">Do good.</span>
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-muted">
              A few ways to get involved and make your community a better place.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-border px-6 py-3 font-bold transition hover:border-primary hover:text-primary"
          >
            View all events <ArrowUpRight />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative aspect-[1.35] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute left-5 top-5 rounded-full px-4 py-2 text-[10px] font-extrabold tracking-[0.12em] text-foreground"
                  style={{ backgroundColor: event.color }}
                >
                  {event.category}
                </span>
                <span className="absolute bottom-4 right-5 text-5xl font-extrabold text-white/80">
                  {event.number}
                </span>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted">
                  <span>◷ {event.date}</span>
                  <span>⌖ {event.location}</span>
                </div>

                <h3 className="mt-5 text-2xl font-extrabold leading-tight transition group-hover:text-primary">
                  {event.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-muted">
                  {event.description}
                </p>

                <Link
                  href="/events"
                  className="mt-7 inline-flex items-center gap-3 border-b border-foreground/20 pb-2 text-sm font-extrabold transition group-hover:border-primary group-hover:text-primary"
                >
                  Explore event <ArrowUpRight />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-7 text-center text-xs text-muted">
          Preview events for design purposes. Live events will be loaded from
          the database.
        </p>
      </section>

      {/* COMMUNITY CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#25233A] px-7 py-16 text-white sm:px-14 sm:py-20 lg:px-20">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-4 -top-8 h-52 w-52 rounded-full border border-white/10" />
          <div className="absolute bottom-0 right-[20%] h-36 w-36 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F08A72]">
              YOUR TURN TO MAKE A DIFFERENCE
            </p>
            <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              The world needs more people like you.
            </h2>
            <p className="mt-6 max-w-lg leading-8 text-white/65">
              Join a community that believes in kindness, action, and making
              good things happen. Your next step starts here.
            </p>

            <Link
              href="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#F08A72] px-7 py-4 font-extrabold text-[#25233A] transition hover:-translate-y-1 hover:bg-[#ffab98]"
            >
              Join Sahayora <ArrowUpRight />
            </Link>
          </div>

          <div className="absolute bottom-8 right-12 hidden text-[150px] leading-none text-white/5 lg:block">
            ✳
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
                  <Link href="/events" className="hover:text-primary">Events</Link>
                  <Link href="#about" className="hover:text-primary">About us</Link>
                  <Link href="#how-it-works" className="hover:text-primary">How it works</Link>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-extrabold">Get involved</h4>
                <div className="flex flex-col gap-3 text-muted">
                  <Link href="/register" className="hover:text-primary">Become a volunteer</Link>
                  <Link href="/login" className="hover:text-primary">Log in</Link>
                  <Link href="/register" className="hover:text-primary">Create account</Link>
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
    </main>
  );
}
