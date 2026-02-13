import { getGlobalSettings } from '@lib/data/fetch'

const MARQUEE_ITEMS = [
  { emoji: '🔥', text: 'Handcrafted Glass Art' },
  { emoji: '📦', text: 'Discreet Shipping' },
  { emoji: '✨', text: 'Premium Borosilicate' },
  { emoji: '🚚', text: 'Free Shipping $100+' },
  { emoji: '🛡️', text: 'Satisfaction Guaranteed' },
  { emoji: '🎨', text: 'Each Piece Unique' },
]

function MarqueeStrip() {
  return (
    <div className="animate-marquee shrink-0 flex items-center gap-6 px-4">
      {MARQUEE_ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-6 whitespace-nowrap">
          <span className="flex items-center gap-2">
            <span>{item.emoji}</span>
            <span className="font-display uppercase text-xs tracking-widest">
              {item.text}
            </span>
          </span>
          <span className="text-sun text-xs">✸</span>
        </span>
      ))}
    </div>
  )
}

export default async function AnnouncementBar() {
  const settingsData = await getGlobalSettings()
  const settings = settingsData?.data

  if (!settings?.announcementBarEnabled) {
    return null
  }

  return (
    <div className="bg-ink text-paper overflow-hidden py-2.5 border-b-2 border-ink relative select-none">
      <div className="flex hover-pause">
        <MarqueeStrip />
        <MarqueeStrip />
      </div>
    </div>
  )
}
