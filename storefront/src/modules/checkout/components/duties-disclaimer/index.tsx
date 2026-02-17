import { Alert } from '@/components/retroui/Alert'

interface DutiesDisclaimerProps {
  disclaimerText?: string | null
  title?: string
  className?: string
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
    <Alert
      status="warning"
      showIcon={showIcon}
      className={className}
      aria-label="International shipping duties disclaimer"
    >
      <p className="font-bold mb-1">{title}</p>
      <p className="text-ink/70">{displayText}</p>
    </Alert>
  )
}

export { DutiesDisclaimer }
