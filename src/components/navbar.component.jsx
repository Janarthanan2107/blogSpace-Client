import { useContext, useEffect, useState } from "react"
import logo from "../imgs/logo.png"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import UserNavigationPanel from "./user-navigation.component"
import axios from "axios"
import { domain } from "../constants/domain"
const Navbar = () => {
    const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext)
    // state
    const [searchBarVisibility, setSearchBarVisibility] = useState(false)
    const [userNavPanel, setUserNavPanel] = useState(false)

    let navigate = useNavigate()

    // action
    const toggleSearchBar = () => {
        setSearchBarVisibility(!searchBarVisibility)
    }

    const togglePanel = () => {
        setUserNavPanel(!userNavPanel)
    }

    const handlePanelBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false)
        }, 500);
    }

    const handleSearchFunc = (e) => {
        let query = e.target.value;

        if (e.keyCode == 13 && query.length) {
            navigate(`/search/${query}`)
        }
    }

    useEffect(() => {
        if (access_token) {
            axios.get(domain + "/blog/notify/new-notification", {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(({ data }) => {
                // console.log(data);
                setUserAuth({ ...userAuth, ...data })
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [access_token])

    return (
        <nav className="navbar z-50">
            {/* logo */}
            <Link to={"/"} className="flex-none w-10">
                <img src={logo} alt="logo" />
            </Link>


            {/* sign in && sign up && write && search bar*/}
            <div className={`absolute bg-white w-full left-0 top-full mt-0 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${searchBarVisibility ? "show" : "hide"}`}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search.."
                    className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                    onKeyDown={handleSearchFunc}
                />

                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-gray"></i>
            </div>

            <div className="flex items-center gap-3 md:gap-6 ml-auto">
                <button className="md:hidden bg-grey w-12 h-12 rounded-full flex justify-center items-center" onClick={toggleSearchBar}>
                    <i className="fi fi-rr-search text-xl"></i>
                </button>

                <Link to="/editor" className="hidden md:flex gap-2 link">
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>

                {
                    access_token ?
                        <>
                            <Link to={"/dashboard/notifications"}>
                                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                    {new_notification_available &&
                                        <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                                    }
                                </button>
                            </Link>

                            <div className="relative">
                                <button className="w-12 h-12 mt-1" onClick={togglePanel} onBlur={handlePanelBlur}>
                                    <img src={profile_img} alt="user-profile-img" className="w-full h-full object-cover rounded-full" />
                                </button>

                                {userNavPanel && <UserNavigationPanel />}
                            </div>
                        </>
                        :
                        <>
                            <Link className="btn-dark py-2" to="/signIn">Sign In</Link>
                            <Link className="btn-light py-2 hidden md:block" to="/signUp">Sign Up</Link>
                        </>

                }
            </div>
        </nav>
    )
}

export default Navbar