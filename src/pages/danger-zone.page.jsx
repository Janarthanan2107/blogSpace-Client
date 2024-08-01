import React, { useContext, useState } from 'react';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import { UserContext } from '../App';
import { domain } from '../constants/domain';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { removeFromSession } from '../common/session';

const DangerZone = () => {
    const { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
    const [isConfirming, setIsConfirming] = useState(false);
    // let navigate = useNavigate()

    const removeUser = () => {
        removeFromSession("User");
        setUserAuth({ access_token: null })
    }


    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${domain}/deleteUserProfile`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            });
            toast.success(response.data.message);
            removeUser()
        } catch (error) {
            toast.error("Error deleting account: " + error.response.data.error);
        }
    };

    return (
        <AnimationWrapper>
            <Toaster />
            {access_token == null ? <Navigate to="/" /> :
                <div className="danger-zone">
                    <h1 className="text-xl font-medium">Danger Zone</h1>
                    <p className="text-dark-grey mt-2">
                        Deleting your account is a permanent action and cannot be undone. All your data will be lost. Please be certain.
                    </p>
                    <div className="mt-5">
                        {isConfirming ? (
                            <AnimationWrapper>
                                <div className="p-4 border border-grey rounded">
                                    <p className="text-red mb-4">User confirmation</p>
                                    <button className="btn-dark px-10 mr-4" onClick={handleDeleteAccount}>Yes, delete my account</button>
                                    <button className="btn-light px-10" onClick={() => setIsConfirming(false)}>Cancel</button>
                                </div>
                            </AnimationWrapper>
                        ) : (
                            <AnimationWrapper>
                                <div className="p-4 border border-grey rounded flex flex-col md:flex-row justify-between items-center">
                                    <p className="text-dark-grey mb-4 md:mb-0 pr-5">
                                        Are you sure you want to delete your account?<br />
                                        This action cannot be undone, your blogs get removed from the site.
                                    </p>
                                    <button className="btn-danger px-10 mt-4 md:mt-0" onClick={() => setIsConfirming(true)}>
                                        Delete Account
                                    </button>
                                </div>

                            </AnimationWrapper>
                        )}
                    </div>
                </div>
            }
        </AnimationWrapper>
    );
};

export default DangerZone;
