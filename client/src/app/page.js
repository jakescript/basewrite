import Words from './components/words.js'
import Link from 'next/link.js'
import { Button } from '@/components/ui/button.jsx'
import FAQSection from './components/faq.js'

export default function Home() {
  return (
    <div style={{ height: 'calc(100vh - 75px)'}} className="flex flex-col w-screen bg-background">
      <div className="p-[25px] text-center mt-[120px]">
        <div className="m-[20px]">
          <h1 style={{ fontSize: 36 }}>
            BASE<b>WRITE</b>
          </h1>
          <p>Creating a library of community written stories.</p>
        </div>

        <Button asChild>
          <Link href="/mint">Join Now</Link>
        </Button>
      </div>

      <FAQSection />
    </div>
  )
}
