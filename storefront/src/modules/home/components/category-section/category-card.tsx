import Image from 'next/image'
import Link from 'next/link'

export interface EnrichedCategory {
  id: string
  name: string
  handle: string
  description: string | null
  thumbnail: string | null
}

interface CategoryCardProps {
  category: EnrichedCategory
  countryCode: string
}

export default function CategoryCard({
  category,
  countryCode,
}: CategoryCardProps) {
  return (
    <Link
      href={`/${countryCode}/categories/${category.handle}`}
      className="group block h-full"
    >
      <div className="relative h-full rounded-2xl border-2 border-ink bg-paper shadow-hard overflow-hidden transition-all duration-300 hover:shadow-hard-xl hover:-translate-y-1 flex flex-col">
        {/* Image Area — fixed proportion */}
        <div className="relative flex-1 min-h-0 bg-ink/[0.03] overflow-hidden">
          {category.thumbnail ? (
            <Image
              src={category.thumbnail}
              alt={category.name}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 75vw, (max-width: 768px) 42vw, (max-width: 1024px) 28vw, 22vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-acid/20 via-sun/20 to-ink/10" />
          )}
        </div>

        {/* Text Area — fixed height bottom bar */}
        <div className="border-t-2 border-ink px-4 py-3 bg-paper flex items-center justify-between gap-3">
          <h3 className="font-display font-bold text-base md:text-lg uppercase truncate leading-tight">
            {category.name}
          </h3>
          <span
            className="shrink-0 w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center
                        transition-all duration-300 group-hover:bg-acid group-hover:translate-x-0.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
