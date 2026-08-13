import Image from "next/image";
import PillButton from "@/components/site/PillButton";
import { siteImages } from "@/lib/site-images";

export default function Hero() {
  return (
    <section className="bg-background">
      {/* Top copy row */}
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-8 md:pb-14 md:pt-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-lg flex-col gap-6">
            <h1 className="font-heading text-[2.75rem] leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-[4.25rem]">
              Be Soft &amp;
              <br />
              Striking
            </h1>
            <PillButton href="/shop">Shop the collection</PillButton>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:text-right md:text-[15px]">
            Refined women&apos;s shoes and bags in soft neutrals — designed for
            the woman who accessorizes with intention.
          </p>
        </div>
      </div>

      {/* Full-bleed hero image with display type */}
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-[4/3] w-full md:aspect-[21/9]">
          <Image
            src={siteImages.hero}
            alt="Classiq Store editorial — women's shoes and bags"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span
            aria-hidden
            className="select-none whitespace-nowrap font-heading text-[clamp(4rem,18vw,13rem)] font-medium leading-none tracking-tight text-white/90"
          >
            CLASSIQ STORE
          </span>
        </div>
      </div>
    </section>
  );
}
