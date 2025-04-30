'use client'

import Idendity from "./identity"
import Link from "next/link"
import { Label } from '@/components/ui/label'
import { usePathname } from "next/navigation"
import { cn } from '@/lib/utils'

const Navbar = () => {
  const pathname = usePathname()
  const items = [
    {
      title: 'Mint',
      href: '/mint'
    },
    {
      title: 'Write',
      href: '/write'
    }
  ]

  return (
    <div
      className='bg-secondary-background text-black justify-center items-center flex py-[10px] px-[1rem] h-[75px]'
      style={{ borderBottom: '2px solid black',}}
    >
      <div className='flex gap-[10px] justify-between w-full items-center'>
        <div className='flex gap-[10px]'>
          <div className="flex items-center gap-[5px]">
            <p className='font-bold text-foreground'><Link href='/'>BaseWrite</Link></p>
          </div>
          <ul className='flex gap-[25px] ml-[20px]'>
            { items.map((item, i) => (
              <li key={i} className={cn('border-transparent border-b-2', pathname === item.href && 'border-black')}>
                <Link href={item.href}>
                  <Label>{item.title}</Label>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Idendity />
      </div>
    </div>
  )
}

export default Navbar
