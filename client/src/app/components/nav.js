import Idendity from "./identity"

const Navbar = () => {
  return (
    <div
      className='bg-white text-black justify-center items-center flex py-[10px] px-[1rem]'
    >
      <div className='flex gap-[10px] justify-between w-full items-center'>
        <p className='font-bold' style={{ fontFamily: `'c64', sans-serif`}}>* BaseWrite</p>
        {/* <ul className='flex gap-[25px]'> */}
        {/*   <li>Mint</li> */}
        {/*   <li>Write</li> */}
        {/*   <li>About</li> */}
        {/* </ul> */}
        <Idendity />
      </div>
    </div>
  )
}

export default Navbar
