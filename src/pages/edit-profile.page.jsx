import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { domain } from '../constants/domain';
import { UserContext } from '../App';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import InputText from '../components/input.component';

const profileDataStructure = {
    personal_info: {
        fullname: "",
        email: "",
        username: "",
        profile_img: "",
        bio: ""
    },
    social_links: {
        youtube: "",
        instagram: "",
        facebook: "",
        twitter: "",
        github: "",
        website: ""
    },
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    joinedAt: "",
    __v: 0
};

const EditProfile = () => {
    const { userAuth, userAuth: { access_token } } = useContext(UserContext);
    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(false);

    let { personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const { data: user } = await axios.post(`${domain}/getUserProfile`, { username: userAuth.username });
            if (user) {
                setProfile(user);
                setLoading(false)
            }
        } catch (error) {
            toast.error("Error fetching user profile:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (access_token) {
            fetchUserProfile();
        }
    }, [access_token]);


    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> : <div>
                    <Toaster />
                    <h1 className='max-md:hidden text-xl'>Edit Profile</h1>

                    <div className='flex flex-col lg:flex-row items-center py-10 gap-8 lg:gap-10'>

                        <div className=' max-lg:center mb-5'>
                            <label htmlFor="uploading" id='profileImgLabel' className=' relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                <div className=' w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>Upload Image</div>
                                <img src={profile_img} alt="profile" />
                            </label>
                            <input type="file" id="uploading" accept='.jpeg, .png, .jpg' hidden />
                            <button type="button" className='btn-light mt-5 max-lg:center lg:w-full px-10'>Upload</button>
                        </div>

                        <div className='w-full'>
                            <div className='grid grid-cols-1 md:grid-cols-2 '>
                                <div>
                                    <InputText name="fullname" type="text" value={fullname} placeholder="Full Name" disable/>
                                </div> 
                            </div>
                        </div>

                    </div>
                </div>
            }
        </AnimationWrapper>
    )
}

export default EditProfile