import Image from "next/image";
import Link from "next/link";
import PillButton from "@/components/site/PillButton";
import { siteImages } from "@/lib/site-images";

const wideCards = [
  {
    title: "The Art of the Everyday Tote",
    excerpt: "How one bag carries an entire wardrobe philosophy.",
    img: siteImages.journal1,
    href: "/lookbook",
  },
  {
    title: "Soft Steps: A Guide to Heel Comfort",
    excerpt: "Engineering elegance without compromise.",
    img: siteImages.journal2,
    href: "/lookbook",
  },
  {
    title: "Neutrals That Never Fade",
    excerpt: "Building a capsule around timeless tones.",
    img: siteImages.journal3,
    href: "/lookbook",
  },
];

export default function Journal() {
  return (
    <section className="bg-surface px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 md:mb-14">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            From the journal
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-foreground md:text-[2.75rem]">
            Stories &amp; style notes
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
          {/* Tall card */}
          <Link
            href="/lookbook"
            className="group relative row-span-2 min-h-[360px] overflow-hidden rounded-full md:min-h-0"
          >
            <Image
              src={siteImages.journalTall}
              alt="Journal feature — style editorial"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-foreground/25" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              <span className="flex h-20 w-20 items-center justify-center self-start rounded-full border border-white/60 bg-white/10 text-center text-[11px] uppercase leading-tight tracking-wide text-white backdrop-blur-sm">
                Read
                <br />
                Now
              </span>
              <div>
                <h3 className="font-heading text-2xl tracking-tight text-white md:text-3xl">
                  Spring Edit 2026
                </h3>
                <p className="mt-2 max-w-xs text-sm text-white/80">
                  A quiet palette for bold women.
                </p>
              </div>
            </div>
          </Link>

          {/* Three wide cards */}
          {wideCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative min-h-[180px] overflow-hidden rounded-full md:min-h-[200px]"
            >
              <Image
                src={card.img}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/40" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                <h3 className="font-heading text-lg tracking-tight text-white md:text-xl">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-white/75">{card.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-14">
          <PillButton href="/lookbook">See more</PillButton>
        </div>
      </div>
    </section>
  );
}
