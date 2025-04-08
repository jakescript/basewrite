import Words from './components/words.js'
import Link from 'next/link.js';

export default function Home() {
  return (
    <div className='flex justify-center align-center'>
      <div className='bg-white w-max p-[25px] text-center mt-[150px]'>
        <div className='m-[20px]'>
          <h1 className='' style={{ fontSize: 36 }}>BASE<b>WRITE</b></h1>
          <p>Creating a library of community written stories.</p>
        </div>

        <Link
          className='bg-black border text-white font-regular w-max'
          style={{ padding: '8px 30px', marginTop: 20, borderRadius: 50, fontSize: 12 }}
          href='/mint'
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}
