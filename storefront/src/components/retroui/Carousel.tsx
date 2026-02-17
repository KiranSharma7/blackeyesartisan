"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { cn } from "@lib/util";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  HTMLAttributes,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselApi = UseEmblaCarouselType[1];

interface CarouselContextValue {
  emblaRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within <Carousel>");
  return ctx;
}

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  opts?: Parameters<typeof useEmblaCarousel>[0];
  plugins?: Parameters<typeof useEmblaCarousel>[1];
}

const Carousel = ({
  opts,
  plugins,
  className,
  children,
  ...props
}: CarouselProps) => {
  const [emblaRef, api] = useEmblaCarousel(
    { loop: false, align: "start", ...opts },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const syncScrollState = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  // Sync initial state when api becomes available
  useEffect(() => {
    if (!api) return;
    // Defer initial sync to avoid cascading renders
    const frame = requestAnimationFrame(() => syncScrollState());
    return () => cancelAnimationFrame(frame);
  }, [api, syncScrollState]);

  // Subscribe to scroll events
  useEffect(() => {
    if (!api) return;
    api.on("select", syncScrollState);
    api.on("reInit", syncScrollState);
    return () => {
      api.off("select", syncScrollState);
      api.off("reInit", syncScrollState);
    };
  }, [api, syncScrollState]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <CarouselContext.Provider
      value={{ emblaRef, api, canScrollPrev, canScrollNext, scrollPrev, scrollNext }}
    >
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselViewport = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { emblaRef } = useCarousel();
  return (
    <div ref={emblaRef} className={cn("overflow-hidden", className)} {...props} />
  );
};

const CarouselSlides = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex", className)} {...props} />
);

const CarouselSlide = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("min-w-0 flex-[0_0_100%]", className)} {...props} />
);

const navButtonBase =
  "absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-ink bg-paper shadow-hard-sm text-ink flex items-center justify-center transition-all duration-200 hover:bg-ink hover:text-paper hover:shadow-none hover:translate-x-[2px] hover:translate-y-[calc(-50%+2px)] active:shadow-none active:translate-x-[2px] active:translate-y-[calc(-50%+2px)]";

const CarouselPrev = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { canScrollPrev, scrollPrev } = useCarousel();
  if (!canScrollPrev) return null;
  return (
    <button
      onClick={scrollPrev}
      aria-label="Previous slide"
      className={cn(navButtonBase, "left-3 md:left-6", className)}
      {...props}
    >
      <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
};

const CarouselNext = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { canScrollNext, scrollNext } = useCarousel();
  if (!canScrollNext) return null;
  return (
    <button
      onClick={scrollNext}
      aria-label="Next slide"
      className={cn(navButtonBase, "right-3 md:right-6", className)}
      {...props}
    >
      <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
};

const CarouselComponent = Object.assign(Carousel, {
  Viewport: CarouselViewport,
  Slides: CarouselSlides,
  Slide: CarouselSlide,
  Prev: CarouselPrev,
  Next: CarouselNext,
  useCarousel,
});

export { CarouselComponent as Carousel };
