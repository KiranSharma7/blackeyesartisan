import Link from 'next/link'

interface FooterProps {
  countryCode: string
}

export default function Footer({ countryCode }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink text-paper pt-16 pb-8 border-t-2 border-ink">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-3xl font-display tracking-tighter">
              BLACK
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: '1px #D63D42' }}
              >
                EYES
              </span>
            </span>
            <p className="text-sm opacity-60 max-w-[200px] mt-4">
              Handcrafted glass art from Nepal
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-lg text-sun mb-4">SHOP</h4>
            <ul className="space-y-2 text-sm font-medium opacity-80">
              <li>
                <Link
                  href={`/${countryCode}/shop`}
                  className="hover:text-acid hover:opacity-100 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href={`/${countryCode}/collections`}
                  className="hover:text-acid hover:opacity-100 transition-colors"
                >
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-display text-lg text-sun mb-4">INFO</h4>
            <ul className="space-y-2 text-sm font-medium opacity-80">
              <li>
                <Link
                  href={`/${countryCode}/about-us`}
                  className="hover:text-acid hover:opacity-100 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href={`/${countryCode}/faq`}
                  className="hover:text-acid hover:opacity-100 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h4 className="font-display text-lg text-sun mb-4">POLICIES</h4>
            <ul className="space-y-2 text-sm font-medium opacity-80">
              <li>
                <Link
                  href={`/${countryCode}/privacy-policy`}
                  className="hover:text-acid hover:opacity-100 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={`/${countryCode}/terms-and-conditions`}
                  className="hover:text-acid hover:opacity-100 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-paper/20 text-xs font-bold opacity-40">
          &copy; {currentYear} Black Eyes Artisan. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
