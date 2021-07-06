import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@iso/components/uielements/button';
import { validationSchema } from './validations';
import { useAuthState } from '../auth/hook';
import { getRequestObject } from './apiServices';
import InputField from '../common/input-field';
import { message } from 'antd';

const SignUpForm = () => {
  const { client } = useAuthState();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();

  const onSubmit = async (values) => {
    try {
      const requestObject = getRequestObject(values);
      const response = await client.post('/user/signup/', requestObject);
      if (response.data.messege == 'User Already Exist' || response.data.messege == 'Mobile Number Already Exist') {
        message.error(response.data.messege);
      } else {
        message.success('User Registered successfully.');
        router.push('/');
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='isoSignUpForm'>
        <div className='isoInputWrapper'>
          <InputField control={control} name='email' placeholder='Email' />
        </div>

        <div className='isoInputWrapper'>
          <InputField control={control} name='mobile' type='number' placeholder='Mobile' />
        </div>

        <div className='isoInputWrapper'>
          <InputField control={control} name='password' type='password' placeholder='Password' />
        </div>

        <div className='isoInputWrapper'>
          <InputField control={control} name='confirmPassword' type='password' placeholder='Confirm password' />
        </div>

        <div className='isoInputWrapper isoLeftRightComponent'>
          <Button type='primary' htmlType='submit' disabled={isSubmitting} loading={isSubmitting}>
            Register
          </Button>
        </div>
        <span>
          Already have an account ?
          <Link href='/'>
            <a> Login</a>
          </Link>
        </span>
      </div>
    </form>
  );
};
export default SignUpForm;
