import React from "react";
import { useState } from 'react';
import EmailVerification from "../../layouts/components/ResetPassword/EmailVerification";
import OptVerification from "../../layouts/components/ResetPassword/OptVerification";
import CreateNewPassword from "../../layouts/components/ResetPassword/CreateNewPassword";

const ResetPassword = () => {
    const [emailVerification, setEmailVerification] = useState(true);
    const [optVerify, setOptVerify] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const handleEmailVerified = () => {
        setEmailVerification(false);
        setOptVerify(true);
    };

    const handleOtpVerified = () => {
        setOptVerify(false);
        setResetPassword(true);
    };
    return (
        <>
            {emailVerification &&
                <>
                    <EmailVerification onEmailVerified={handleEmailVerified} />
                </>
            }
            {optVerify &&
                <>
                    <OptVerification onOtpVerified={handleOtpVerified} />
                </>
            }
            {resetPassword &&
                <>
                    <CreateNewPassword />
                </>
            }
        </>
    );
};

export default ResetPassword;