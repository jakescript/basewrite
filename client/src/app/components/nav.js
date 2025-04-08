import Idendity from "./identity"
import Link from "next/link"

const Navbar = () => {
  return (
    <div
      className='bg-white text-black justify-center items-center flex py-[10px] px-[1rem]'
    >
      <div className='flex gap-[10px] justify-between w-full items-center'>
        <div className='flex gap-[10px]'>
          <p className='font-bold' style={{ fontFamily: `'c64', sans-serif`}}><Link href='/'>* BaseWrite</Link></p>
          <ul className='flex gap-[25px]' style={{ marginLeft: 50 }}>
            <li><Link href='/mint'>Mint</Link></li>
            <li><Link href='/write'>Write</Link></li>
          </ul>
        </div>
        <Idendity />
      </div>
    </div>
  )
}

export default Navbar
