import Image from "next/image";
import PillButton from "@/components/site/PillButton";
import { siteImages } from "@/lib/site-images";

export default function EcoPacking() {
  return (
    <section className="bg-background px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-md flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Sustainability
            </p>
            <h2 className="font-heading text-3xl tracking-tight text-foreground md:text-[2.75rem]">
              Eco-friendly Packing
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:pt-8 md:text-[15px]">
            Every order ships in recycled, biodegradable packaging — minimal,
            beautiful, and kind to the planet. Because luxury should leave a
            light footprint.
          </p>
        </div>

        <div className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-full md:mb-12">
          <Image
            src={siteImages.packaging}
            alt="Eco-friendly packaging materials"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="flex justify-center">
          <PillButton href="/sustainability">Learn about our packaging</PillButton>
        </div>
      </div>
    </section>
  );
}
