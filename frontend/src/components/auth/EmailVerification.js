import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resendEmailVerificationToken, verifyUserEmail } from '../../api/auth';
import { useAuth, useNotification } from '../../hooks';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import FormContainer from '../form/FormContainer';
import Submit from '../form/Submit';
import Title from '../form/Title';

const OTP_LENGTH = 6;
let currentOTPIndex;

function EmailVerification() {

    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);

    const inputRef = useRef();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { updateNotification } = useNotification();
    const { isAuth, authInfo } = useAuth();
    const { isLoggedIn, profile } = authInfo;
    const isVerified = profile?.isVerified;

    const user = state?.user;

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOtpIndex])

    const focusNextInputField = (index) => {
        setActiveOtpIndex(index + 1);
    }

    const focusPreviousInputField = (index) => {
        let newIndex = index - 1;
        setActiveOtpIndex(newIndex !== 0 ? newIndex : 0);
    }

    const isValidOTP = (otp) => {
        let valid = false;

        for (let val of otp) {
            valid = !isNaN(parseInt(val));
            if (!valid) {
                break;
            }
        }

        return valid;
    }

    const handleOtpChange = ({ target }) => {
        const { value } = target;
        const newOtp = [...otp];
        newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);

        if (!value) {
            focusPreviousInputField(currentOTPIndex);
        } else {
            focusNextInputField(currentOTPIndex);
        }

        setOtp([...newOtp]);
    }

    const handleKeyDown = ({ key }, index) => {
        currentOTPIndex = index;
        if (key === 'Backspace') {
            focusPreviousInputField(currentOTPIndex);
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/not-found');
        }
        if (isLoggedIn && isVerified) {
            navigate('/');
        }
    }, [isLoggedIn, user, isVerified])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidOTP(otp)) {
            return updateNotification('error', 'Invalid OTP');
        }

        const { error, message, user: userResponse } = await verifyUserEmail({ OTP: otp.join(''), userId: user.id });

        if (error) {
            return updateNotification('error', error);
        } else {
            updateNotification('success', message);
        }

        localStorage.setItem('auth-token', userResponse.token);
        isAuth();
    }

    const handleOTPResend = async () => {
        const { error, message } = await resendEmailVerificationToken(user.id);

        if (error) {
            return updateNotification("error", error);
        }

        updateNotification("success", message);
    };


    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses}>
                    <div>
                        <Title>Please enter the OTP to verify your account.</Title>
                        <p className='text-center dark:text-dark-subtle text-light-subtle'>OTP has been sent to your email</p>
                    </div>

                    <div className='flex justify-center items-center space-x-4'>
                        {
                            otp.map((_, index) => {
                                return (
                                    <input
                                        ref={activeOtpIndex === index ? inputRef : null}
                                        key={index}
                                        value={otp[index]}
                                        onChange={(e) => handleOtpChange(e)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        type="number"
                                        className='w-12 h-12 border-2 rounded dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary bg-transparent 
                                        outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none'
                                    />
                                )
                            })
                        }
                    </div>

                    <div>
                        <Submit value="Verify Account" />
                        <button
                            onClick={handleOTPResend}
                            type="button"
                            className="dark:text-white text-blue-500 font-semibold hover:underline mt-2"
                        >
                            I don't have an OTP
                        </button>
                    </div>

                </form>
            </Container>
        </FormContainer>
    )
}

export default EmailVerification;