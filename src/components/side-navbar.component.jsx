import React, { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../App';

const SideNavbar = () => {
    const { userAuth: { access_token, new_notification_available } } = useContext(UserContext);
    const location = useLocation();
    const [pageState, setPageState] = useState("");
    const [showSideNav, setShowSideNav] = useState(false);

    const activeTabLine = useRef(null);
    const sideBarIconTab = useRef(null);
    const pageStateTab = useRef(null);
    const activeTabRefs = useRef([]);

    useEffect(() => {
        activeIndexFunc()
    }, [location.pathname]);

    const activeIndexFunc = () => {
        const currentPath = location.pathname.split("/")[2];
        setPageState(currentPath ? currentPath.replace("-", " ") : "");
        const activeIndex = activeTabRefs.current.findIndex(tab => tab && tab.dataset.path === currentPath);
        if (activeIndex !== -1) {
            updateActiveTabLine(activeTabRefs.current[activeIndex]);
        }
    }

    const updateActiveTabLine = (tab) => {
        if (tab && activeTabLine.current) {
            const { offsetWidth, offsetLeft } = tab;
            activeTabLine.current.style.width = `${offsetWidth}px`;
            activeTabLine.current.style.left = `${offsetLeft}px`;
        }
    };

    const toggleSidebar = () => {
        setShowSideNav(!showSideNav);
        if (!showSideNav && sideBarIconTab.current) {
            updateActiveTabLine(sideBarIconTab.current);
        } else {
            activeIndexFunc()
        }
    };

    const handleChangeTab = (e, path) => {
        setPageState(path.replace("-", " "));
        updateActiveTabLine(e.target);
        setShowSideNav(false);
    };

    return (
        access_token === null ? <Navigate to="/" /> :
            <>
                <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
                    <div className="sticky top-[80px] z-30">
                        <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
                            <button ref={sideBarIconTab} className='p-5 capitalize' onClick={toggleSidebar}>
                                <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
                            </button>
                            <button ref={pageStateTab} className='p-5 capitalize pointer-events-none'>
                                {pageState}
                            </button>
                            <hr ref={activeTabLine} className='absolute bottom-0 duration-500' />
                        </div>

                        <div className={`min-w-[200px] h-cover md:mb-8 md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 ${!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto"}`}>
                            <h1 className='text-xl text-dark-grey mb-2'>Dashboard</h1>
                            <hr className='border-grey -ml-6 mb-5 mr-6' />
                            <NavLink
                                to="/dashboard/blogs"
                                className="sidebar-link"
                                ref={el => activeTabRefs.current[0] = el}
                                data-path="blogs"
                                onClick={(e) => handleChangeTab(e, 'blogs')}
                            >
                                <i className='fi fi-rr-document'></i>
                                Blogs
                            </NavLink>
                            <NavLink
                                to="/dashboard/notifications"
                                className="sidebar-link"
                                ref={el => activeTabRefs.current[1] = el}
                                data-path="notification"
                                onClick={(e) => handleChangeTab(e, 'notification')}
                            >
                                <div className=' relative'>
                                    <i className='fi fi-rr-bell'></i>
                                    {new_notification_available &&
                                        <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
                                    }
                                </div>
                                Notifications
                            </NavLink>
                            <NavLink
                                to="/editor"
                                className="sidebar-link"
                                ref={el => activeTabRefs.current[2] = el}
                                data-path="editor"
                                onClick={(e) => handleChangeTab(e, 'editor')}
                            >
                                <i className='fi fi-rr-file-edit'></i>
                                Write
                            </NavLink>
                            <h1 className='text-xl text-dark-grey mt-20 mb-2'>Settings</h1>
                            <hr className='border-grey -ml-6 mb-5 mr-6' />
                            <NavLink
                                to="/settings/edit-profile"
                                className="sidebar-link"
                                ref={el => activeTabRefs.current[3] = el}
                                data-path="edit-profile"
                                onClick={(e) => handleChangeTab(e, 'edit-profile')}
                            >
                                <i className='fi fi-rr-user'></i>
                                Edit Profile
                            </NavLink>

                            <NavLink
                                to="/settings/change-password"
                                className="sidebar-link"
                                ref={el => activeTabRefs.current[4] = el}
                                data-path="change-password"
                                onClick={(e) => handleChangeTab(e, 'change-password')}
                            >
                                <i className='fi fi-rr-lock'></i>
                                Change Password
                            </NavLink>

                            <NavLink
                                to="/settings/danger-zone"
                                className="sidebar-link"
                                ref={el => activeTabRefs.current[4] = el}
                                data-path="danger-zone"
                                onClick={(e) => handleChangeTab(e, 'danger-zone')}
                            >
                                <i className="fi fi-rs-triangle-warning"></i>
                                Danger Zone
                            </NavLink>


                        </div>
                    </div>
                    <div className='max-md:-mt-5 mt-5 w-full'>
                        <Outlet />
                    </div>
                </section>
            </>
    );
};

export default SideNavbar;
