import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@iso/components/uielements/button';
import IntlMessages from '@iso/components/utility/intlMessages';
import { validationSchema } from './validations';
import { useAuthState } from '../auth/hook';
import InputField from '../common/input-field';
import { message } from 'antd';
import { useRouter } from 'next/router';

const ForgotPasswordForm = () => {
  const { client } = useAuthState();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    try {
      const response = await client.post('/user/forgot_password/', values);
      const msg = response.data.message;
      message.warning(msg);
      router.push('/');
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='isoForgotPassForm'>
        <div className='isoInputWrapper'>
          <InputField control={control} name='email' placeholder='Email' />
        </div>

        <div className='isoInputWrapper'>
          <Button type='primary' htmlType='submit' disabled={isSubmitting} loading={isSubmitting}>
            <IntlMessages id='page.sendRequest' />
          </Button>
        </div>
      </div>
    </form>
  );
};
export default ForgotPasswordForm;
