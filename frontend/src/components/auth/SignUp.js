import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/auth';
import { useAuth, useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

function SignUp() {

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = userInfo;

    const navigate = useNavigate();
    const { authInfo } = useAuth();
    const { isLoggedIn } = authInfo;
    const { updateNotification } = useNotification();

    const handleChange = (e) => {
        const { value, name } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ok, error } = validateUserInfo(userInfo);

        if(!ok) return updateNotification('error', error);

        const response = await createUser(userInfo);

        if(response.error) updateNotification('error', response.error);

        navigate('/auth/verification', { state: { user: response.user }, replace: true });
    }

    const validateUserInfo = ({ name, email, password }) => {
        if(!name.trim()) return {
            ok: false,
            error: 'Name is Missing'
        }
        if(!/^[a-z A-Z]+$/.test(name)) return {
            ok: false,
            error: 'Invalid Name'
        }

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

    useEffect(() => {
        if(isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn])

    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
                    <Title>Sign Up</Title>
                    <FormInput 
                        label="Name"
                        placeholder="Your Name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                    />
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
                    <Submit value="Sign Up" />
                    <div className='flex justify-between'>
                        <CustomLink to='/auth/forget-password'>
                            Forget Password
                        </CustomLink>
                        <CustomLink to='/auth/signin'>
                            Sign In
                        </CustomLink>
                    </div>
                </form>
            </Container>
        </FormContainer>
    )
}

export default SignUp;