import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Checkbox from '@iso/components/uielements/checkbox';
import Button from '@iso/components/uielements/button';
import IntlMessages from '@iso/components/utility/intlMessages';
import { validationSchema } from './validations';
import { useAuthDispatch, useAuthState } from '../auth/hook';
import InputField from '../common/input-field';

const SignInForm = () => {
  const { client } = useAuthState();
  const dispatch = useAuthDispatch();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();

  const onSubmit = async (values) => {
    const response = await client.post('/user/login/', values);
    window.localStorage.setItem('token', response.data.token);
    window.localStorage.setItem('user', JSON.stringify(response.data.user));
    window.localStorage.setItem('roles', JSON.stringify(response.data.roles));
    window.localStorage.setItem('authUser', JSON.stringify(response));
    dispatch({
      type: 'set',
      payload: {
        user: {
          ...response.data.user,
          isLoggedIn: response.data.token && response.data.token !== null,
        },
        roles: response.data.roles,
      },
    });
    router.push('/job-posts');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='isoSignInForm'>
        <div className='isoInputWrapper'>
          <InputField control={control} name='email' placeholder='Email' />
        </div>

        <div className='isoInputWrapper'>
          <InputField control={control} name='password' type='password' placeholder='Password' />
        </div>

        <div className='isoInputWrapper isoLeftRightComponent'>
          <Checkbox>
            <IntlMessages id='page.signInRememberMe' />
          </Checkbox>
          <Button type='primary' htmlType='submit' disabled={isSubmitting} loading={isSubmitting}>
            <IntlMessages id='page.signInButton' />
          </Button>
        </div>
      </div>
    </form>
  );
};
export default SignInForm;
