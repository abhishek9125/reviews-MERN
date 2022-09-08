import React, { useState } from 'react';
import { useAuth, useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

function SignIn() {

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    });

    const { updateNotification } = useNotification();
    const { handleLogin, authInfo } = useAuth();
    const { isPending } = authInfo;

    const handleChange = (e) => {
        const { value, name } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const { email, password } = userInfo;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ok, error } = validateUserInfo(userInfo);

        if(!ok) return updateNotification('error', error);

        handleLogin(email, password);
    }

    const validateUserInfo = ({ email, password }) => {
        if(!email.trim()) return {
            ok: false,
            error: 'Email is Missing'
        }
        if(!isValidEmail(email)) return {
            ok: false,
            error: 'Invalid Email'
        }

        if(!password.trim()) return {
            ok: false,
            error: 'Password is Missing'
        }
        if(password.length < 8) return {
            ok: false,
            error: 'Password must be 8 Characters long'
        }

        return { ok: true }
    }

    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
                    <Title>Sign In</Title>
                    <FormInput 
                        label="Email"
                        placeholder="Your Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                    <FormInput 
                        label="Password"
                        placeholder="Your Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        type="password"
                    />
                    <Submit value="Sign In" busy={isPending} />
                    <div className='flex justify-between'>
                        <CustomLink to='/auth/forget-password'>
                            Forget Password
                        </CustomLink>
                        <CustomLink to='/auth/signup'>
                            Sign Up
                        </CustomLink>
                    </div>
                </form>
            </Container>
        </FormContainer>
    )
}

export default SignIn;