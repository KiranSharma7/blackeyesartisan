import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BlackEyesArtisan',
  description: 'Handcrafted artisan glass art',
}

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Hello World</h1>
    </div>
  )
}
