import Link from 'next/link'
import { getGlobalSettings } from '@lib/data/fetch'

export default async function AnnouncementBar() {
  const settingsData = await getGlobalSettings()
  const settings = settingsData?.data

  if (!settings?.announcementBarEnabled || !settings?.announcementBarText) {
    return null
  }

  const content = (
    <span className="inline-flex items-center gap-2">
      <span>{settings.announcementBarText}</span>
      {settings.announcementBarLink && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </span>
  )

  return (
    <div className="bg-acid text-paper py-2 px-4 text-center text-sm font-medium">
      {settings.announcementBarLink ? (
        <Link
          href={settings.announcementBarLink}
          className="hover:underline transition-colors"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}
