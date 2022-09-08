import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';
import { ImSpinner3 } from 'react-icons/im';
import { useNotification } from '../../hooks';
import { resetPassword, verifyPasswordResetToken } from '../../api/auth';

function ConfirmPassword() {

    const [password, setPassword] = useState({
        one: '',
        two: ''
    })
    const [isVerifying, setIsVerifying] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const { updateNotification } = useNotification();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const id = searchParams.get('id');

    useEffect(() => {
        isValidToken()
    }, [])

    const handleChange = (e) => {
        const { value, name } = e.target;
        setPassword({ ...password, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!password.one.trim() || !password.two.trim()) {
            return updateNotification('error', 'Password is Missing!');
        }

        if(password.one.trim().length < 8) {
            return updateNotification('error', 'Password must be 8 Characters Long!');
        }

        if(password.one !== password.two) {
            return updateNotification('error', 'Passwords do not match!');
        }

        const { error, message } = await resetPassword({ newPassword: password.one, userId: id, token });

        if(error) {
            return updateNotification('error', error);
        }

        updateNotification('success', message);
        navigate('/auth/signin', { replace: true });

    }

    const isValidToken = async () => {
        const { error, valid } = await verifyPasswordResetToken(token, id);
        setIsVerifying(false);

        if(error) {
            navigate('/auth/reset-password', { replace: true })
            return updateNotification('error', error);
        }

        if(!valid) {
            setIsValid(false);
            return navigate('/auth/reset-password', { replace: true });
        }

        setIsValid(true);
    }

    if(!isValid) {
        return (
            <FormContainer>
                <Container>
                    <h1 className='text-4xl font-semibold dark:text-white text-primary'>
                        Sorry..The Token is Invalid..!!
                    </h1>
                </Container>
            </FormContainer>
        )
    }

    if(isVerifying) {
        return (
            <FormContainer>
                <Container>
                    <div className='flex space-x-2 items-center'>
                        <h1 className='text-4xl font-semibold dark:text-white text-primary'>
                            Please Wait... We are Verifying your Token..!!
                        </h1>
                        <ImSpinner3 className='animate-spin text-4xl dark:text-white text-primary' />
                    </div>
                </Container>
            </FormContainer>
        )
    }

    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses + ' w-96'}>
                    <Title>Enter New Passord</Title>
                    <FormInput 
                        label="New Passowrd"
                        placeholder="Your Password"
                        name="one"
                        type="password"
                        value={password.one}
                        onChange={handleChange}
                    />
                    <FormInput 
                        label="Confirm Passowrd"
                        placeholder="Confirm Password"
                        name="two"
                        type="password"
                        value={password.two}
                        onChange={handleChange}
                    />
                    <Submit value="Confirm Password" />
                </form>
            </Container>
        </FormContainer>
    )
}

export default ConfirmPassword;