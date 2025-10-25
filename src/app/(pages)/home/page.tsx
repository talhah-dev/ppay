import Link from 'next/link'
import React from 'react'

const Homepage = () => {
  return (
    <div className='flex items-center justify-center h-screen '>
      <Link href={"/dashboard"} className='text-xl font-medium underline'>Go to Dashboard</Link>
    </div>
  )
}

export default Homepage
