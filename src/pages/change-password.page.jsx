import React, { useContext, useEffect, useState } from 'react';
import AnimationWrapper from '../common/page-animation';
import InputText from '../components/input.component';
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '../App';
import { domain } from '../constants/domain';
import axios from 'axios';

const ChangePassword = () => {
    const { userAuth: { access_token, googleAuth } } = useContext(UserContext);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handleSubmit = async (e) => {
        e.preventDefault();

        let { currentPassword, newPassword } = formData;

        if (!currentPassword.length || !newPassword.length) {
            return toast.error("Fill all the inputs");
        }

        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Password should be 6-20 characters long, contain at least one digit and one uppercase letter");
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("Updating...");

        try {
            await axios.post(`${domain}/change-Auth`, { currentPassword, newPassword }, { headers: { 'Authorization': `Bearer ${access_token}` } });
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.success("Password Updated Successfully");
            setFormData({
                currentPassword: '',
                newPassword: ''
            });
        } catch ({ response }) {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.error(response.data.error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <AnimationWrapper>
            <Toaster />
            {
                googleAuth ? (
                    <div>
                        <h1 className='max-md:hidden text-xl'>Change Password</h1>
                        <p className='text-red/70 mt-2'>Your account is managed through Google. To change your password, please visit your Google Account settings.</p>
                    </div>
                ) : (
                    <div>
                        <h1 className='max-md:hidden text-xl'>Change Password</h1>
                        <p className='text-dark-grey mt-2'>Please fill out the form below to change your password. Make sure to enter your current password and a new password that meets our security requirements.</p>
                        <div className='mt-5'>
                            <InputText
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                placeholder="Current Password"
                                className="profile-edit-input"
                                icon="fi-rr-unlock"
                                onChange={handleInputChange}
                            />
                            <InputText
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                placeholder="New Password"
                                className="profile-edit-input"
                                icon="fi-rr-unlock"
                                onChange={handleInputChange}
                            />

                            <button className='btn-dark px-10' onClick={handleSubmit}>Change Password</button>
                        </div>
                    </div>
                )
            }
        </AnimationWrapper>
    );
};

export default ChangePassword;
