import React, { useState } from 'react';
import { forgetPassword } from '../../api/auth';
import { useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

function ForgetPassword() {

    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);
    }

    const { updateNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!isValidEmail(email)) {
            return updateNotification('error', 'Invalid Email');
        }

        const { error, message } = await forgetPassword(email);

        if(error) {
            return updateNotification('error', error);
        }

        updateNotification('success', message);
    }

    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses + ' w-96'}>
                    <Title>Please Enter Your Email</Title>
                    <FormInput 
                        label="Email"
                        placeholder="Your Email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                    />
                    <Submit value="Send Link" />
                    <div className='flex justify-between'>
                        <CustomLink to='/auth/signin'>
                            Sign In
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

export default ForgetPassword;