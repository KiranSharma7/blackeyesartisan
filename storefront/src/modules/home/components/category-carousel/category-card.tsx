import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@lib/util/cn'
import { CategoryWithImage } from './index'

interface CategoryCardProps {
  category: CategoryWithImage
  countryCode: string
}

export default function CategoryCard({
  category,
  countryCode,
}: CategoryCardProps) {
  return (
    <Link
      href={`/${countryCode}/categories/${category.handle}`}
      className="group block flex-[0_0_280px] md:flex-[0_0_340px] min-w-0"
    >
      {/* Image area */}
      <div
        className={cn(
          'relative aspect-[3/4] rounded-2xl border-2 border-ink shadow-hard overflow-hidden bg-ink/[0.06]',
          'transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-hard-xl'
        )}
      >
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 280px, 340px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/[0.04]">
            <span className="text-6xl font-display text-ink/10 uppercase">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info below image */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg uppercase tracking-wide text-ink truncate">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-ink/60 font-medium mt-0.5 line-clamp-1">
              {category.description}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 mt-1 w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center group-hover:bg-ink group-hover:text-paper transition-colors duration-200">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 7h12m0 0L8 2m5 5L8 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  )
}
