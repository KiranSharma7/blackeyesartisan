import { AlertTriangle } from 'lucide-react'

interface DutiesDisclaimerProps {
  /**
   * Disclaimer text from Strapi CMS global settings
   * Falls back to default text if not provided
   */
  disclaimerText?: string | null
  /**
   * Title for the disclaimer section
   */
  title?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to show an icon
   */
  showIcon?: boolean
}

const DEFAULT_TITLE = 'International Orders'
const DEFAULT_DISCLAIMER =
  'Additional duties and taxes may apply upon delivery to your country. These are the responsibility of the recipient.'

export default function DutiesDisclaimer({
  disclaimerText,
  title = DEFAULT_TITLE,
  className = '',
  showIcon = true,
}: DutiesDisclaimerProps) {
  const displayText = disclaimerText || DEFAULT_DISCLAIMER

  return (
    <div
      className={`bg-sun/20 border-2 border-ink rounded-xl p-3 text-xs ${className}`}
      role="note"
      aria-label="International shipping duties disclaimer"
    >
      <div className="flex items-start gap-2">
        {showIcon && (
          <AlertTriangle
            className="h-4 w-4 text-ink/70 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
        )}
        <div>
          <p className="font-bold mb-1">{title}</p>
          <p className="text-ink/70">{displayText}</p>
        </div>
      </div>
    </div>
  )
}

export { DutiesDisclaimer }
