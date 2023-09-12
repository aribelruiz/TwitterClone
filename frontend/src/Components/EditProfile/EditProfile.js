import React, { useState } from 'react';
import axios from 'axios';

// Import CSS
import './EditProfile.scss';

function EditProfile() {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const updatePassword = () => {
        axios.put(
            "http://localhost:8080/auth/updatePassword", 
            {oldPassword: oldPassword, newPassword: newPassword},
            { headers: {accessToken: localStorage.getItem("accessToken")} } 
        ).then((res) => {
            if (res.data.error) {
                setSuccessMessage('');
                setErrorMessage(res.data.error);
            }
            else {
                setErrorMessage('');
                setSuccessMessage(res.data);
            }
        });
    };


    return (
    <div className='edit-profile'>
        <h1>Edit Profile</h1>
        <hr></hr>
        <div className='edit-password'>
            <input type='password' placeholder='Old Password...' onChange={(e) => {setOldPassword(e.target.value)}}/>
            <input type='password' placeholder='New Password...' onChange={(e) => {setNewPassword(e.target.value)}}/>
            <button onClick={updatePassword}> Update Password </button>
        </div>
        <div className='password-response'>
        <span className='pass-error'>{errorMessage}</span>
        <span className='pass-success'>{successMessage}</span>
        </div>
    </div>
    );
}

export default EditProfile;