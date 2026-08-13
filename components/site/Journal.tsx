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
          <h2 className="font-heading text-3xl tracking-tight text-foreground md:text-[2.75rem] lg:text-5xl">
            Stories &amp; style notes
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
          {/* Tall card */}
          <Link
            href="/lookbook"
            className="group relative row-span-2 min-h-[460px] overflow-hidden rounded-full md:min-h-[560px]"
          >
            <Image
              src={siteImages.journalTall}
              alt="Journal feature — style editorial"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-foreground/25" />
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
              <span className="flex h-20 w-20 items-center justify-center self-start rounded-full border border-white/60 bg-white/10 text-center text-[11px] uppercase leading-tight tracking-wide text-white backdrop-blur-sm">
                Read
                <br />
                Now
              </span>
              <div className="max-w-md">
                <h3 className="font-heading text-[1.75rem] leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
                  Spring Edit 2026
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
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
              className="group relative min-h-[260px] overflow-hidden rounded-full md:min-h-[270px]"
            >
              <Image
                src={card.img}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/40" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
                <div className="max-w-lg">
                  <h3 className="font-heading text-[1.4rem] leading-[1.15] tracking-tight text-white md:text-[1.75rem] lg:text-[2rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white/90 md:text-[1.05rem]">{card.excerpt}</p>
                </div>
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
