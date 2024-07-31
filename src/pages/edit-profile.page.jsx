import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { domain } from '../constants/domain';
import { UserContext } from '../App';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import InputText from '../components/input.component';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebase } from '../common/firebase';

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
    let maxLimit = 150;
    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(false);
    const [charactersLeft, setCharactersLeft] = useState(maxLimit);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { userAuth, userAuth: { access_token } } = useContext(UserContext);

    let { personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const { data: user } = await axios.post(`${domain}/getUserProfile`, { username: userAuth.username });
            if (user) {
                setProfile(user);
                setLoading(false);
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

    const handleCharactersChange = (e) => {
        setCharactersLeft(maxLimit - e.target.value.length);
        handleChange(e);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const section = name.includes('social_links') ? 'social_links' : 'personal_info';
        const key = name.includes('social_links') ? name.split('.')[1] : name;

        setProfile(prevProfile => ({
            ...prevProfile,
            [section]: {
                ...prevProfile[section],
                [key]: value
            }
        }));
    };

    const handleImageSelection = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set image preview
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            setSelectedImage(file);
        }
    };

    const handleImgUpload = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            toast.error("No image selected");
            return;
        }

        try {
            setUploading(true);
            let loadingToast = toast.loading("Uploading...");
            const storage = getStorage(firebase);
            const storageRef = ref(storage, "images/" + selectedImage.name);
            await uploadBytes(storageRef, selectedImage);
            const downloadUrl = await getDownloadURL(storageRef);
            setProfile(prevProfile => ({
                ...prevProfile,
                personal_info: {
                    ...prevProfile.personal_info,
                    profile_img: downloadUrl
                }
            }));
            toast.dismiss(loadingToast);
            toast.success("Uploaded👍");
            setImagePreview(downloadUrl); // Update preview with the URL of the uploaded image
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let dataToSend = {
            personal_info: profile.personal_info,
            social_links: profile.social_links
        };

        try {
            const response = await axios.post(`${domain}/updateUserProfile`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            toast.success(response.data.message);
            fetchUserProfile();
        } catch (error) {
            toast.error("Error updating profile:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> : <div>
                    <Toaster />
                    <h1 className='max-md:hidden text-xl'>Edit Profile</h1>

                    <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row items-center py-10 gap-8 lg:gap-10'>
                        <div className=' max-lg:center mb-5'>
                            <label htmlFor="uploading" id='profileImgLabel' className=' relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                {uploading && (
                                    <div className="absolute inset-0 bg-dark-grey opacity-50 z-10"></div>
                                )}
                                <div className=' w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>Upload Image</div>
                                <img src={imagePreview || profile_img} alt="profile" />
                            </label>
                            <input type="file" id="uploading" accept='.jpeg, .png, .jpg' hidden onChange={handleImageSelection} />
                            <button type="button" className='btn-light mt-5 max-lg:center lg:w-full px-10' onClick={handleImgUpload}>Upload</button>
                        </div>

                        <div className='w-full'>
                            <div className='grid grid-cols-1 md:gap-5 md:grid-cols-2 '>
                                <div>
                                    <InputText name="fullname" type="text" value={fullname} placeholder="Full Name" onChange={handleChange} disabled={true} icon="fi-rr-user" />
                                </div>
                                <div>
                                    <InputText name="email" type="email" value={email} placeholder="Email" onChange={handleChange} disabled={true} icon="fi-sr-envelope" />
                                </div>
                            </div>

                            <InputText name="username" type="text" value={profile_username} placeholder="Username" onChange={handleChange} disabled={false} icon="fi-rr-at" />

                            <p className='text-dark-grey -mt-3'>Username will use to search user and will be visible to all users</p>

                            <textarea name="bio" id="" maxLength={maxLimit} value={bio} className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5 placeholder:text-dark-grey' placeholder='Bio' onChange={handleCharactersChange}></textarea>
                            <p className='mt-1 text-dark-grey'>{charactersLeft} characters left.</p>

                            <p className='my-6 text-dark-grey'>Add social media below</p>
                            <div className='md:grid md:grid-cols-2 gap-x-6'>
                                {
                                    Object.keys(social_links).map((key, i) => {
                                        let link = social_links[key];
                                        return <InputText key={i} name={`social_links.${key}`} type="text" value={link} placeholder="https://" className="placeholder:text-dark-grey/30" onChange={handleChange} icon={"fi " + (key !== "website" ? "fi-brands-" + key : "fi-rr-globe")} />
                                    })
                                }
                            </div>
                            <button type="submit" className='btn-dark w-auto px-10'>Update</button>
                        </div>

                    </form>
                </div>
            }
        </AnimationWrapper>
    );
};

export default EditProfile;
