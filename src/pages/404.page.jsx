import React from 'react'
import pageNotFound from "../imgs/404.png"
import logo from "../imgs/full-logo.png"
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
            <img src={pageNotFound} className='select-none border-2 border-grey w-72 aspect-square object-cover rounded' />

            <h1 className=' font-semibold text-4xl leading-7'>Page not found</h1>
            <p className='text-dark-grey text-xl leading-7 -mt-8'>The page your are looking for does not exists. Head back to the <Link to={"/"} className='text-black underline underline-offset-4'>home page</Link>.</p>

            <div className='mt-auto'>
                <img src={logo} alt="logo" className='h-8 object-contain block mx-auto select-none' />
                <p className='mt-5 text-dark-grey'>Read millions of stories around the world</p>
            </div>
        </section>
    )
}

export default NotFound