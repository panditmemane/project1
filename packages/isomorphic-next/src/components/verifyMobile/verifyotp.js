import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@iso/components/uielements/button';
import { validationSchema } from './validations';
import InputField from '../common/input-field';
import { message } from 'antd';

const VerifyMobile = (otp) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();

  const onFormSubmit = async () => {
    try {
      const response = await client.post(`/user/sms_token_verify/${otp}`, {
        user_otp: parseInt(otp),
      });
      const msg = response.data.message;
      message.success(msg);
      router.push('/');
    } catch (error) {}
  };

  return (
    <form onSubmit={onFormSubmit}>
      <div className='isoSignUpForm'>
        <div className='isoInputWrapper'>
          <InputField control={control} name='sms_otp_code' placeholder='Enter SMS Verification Code' />
        </div>

        <div className='isoInputWrapper isoCenterComponent'>
          <Button type='primary'>Submit</Button>
        </div>

        <span>
          <Link href='#'>
            <a> Resend Verification Code via SMS </a>
          </Link>
        </span>

        <span>
          Back to Register Page ?
          <Link href='/signup'>
            <a> Register</a>
          </Link>
        </span>
      </div>
    </form>
  );
};
export default VerifyMobile;
