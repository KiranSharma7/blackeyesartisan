export default function HeroSkeleton() {
  return (
    <section className="w-full py-6 md:py-10">
      <div className="max-w-site mx-auto px-4 md:px-8">
        {/* Desktop skeleton */}
        <div className="hidden md:grid md:grid-cols-[1fr_2.5fr_1fr] gap-4 items-stretch h-[420px]">
          <div className="bg-stone/30 rounded-2xl animate-pulse border-2 border-ink/10" />
          <div className="bg-stone/30 rounded-[2rem] animate-pulse border-2 border-ink/10" />
          <div className="bg-stone/30 rounded-2xl animate-pulse border-2 border-ink/10" />
        </div>

        {/* Mobile skeleton */}
        <div className="md:hidden aspect-[16/9] bg-stone/30 rounded-[2rem] animate-pulse border-2 border-ink/10" />
      </div>
    </section>
  )
}
