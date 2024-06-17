import React from 'react'
import Navbar from '../components/navbar.component'
import { Outlet } from 'react-router-dom'

const Root = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default Root