import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from '../auth/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Button from '@iso/components/uielements/button';
import InputField from '../common/input-field';
import { message } from 'antd';
import { validationSchema } from './validations';

const VerifyEmail = ({ token }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const { client } = useAuthState();
  //const user_token = token.token;

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`user/email_token_verify/${token}/`);
      const msg = response.data.message;
      message.warning(msg);
    };
    if (token) load();
  }, [token]);

  return (
    <form>
      {/* <div className='isoSignUpForm'>
        <div className='isoInputWrapper'>
          <InputField control={control} name='email_otp_code' placeholder='Enter Email Verification Code ' />
        </div>

        <div className='isoInputWrapper isoCenterComponent'>
          <Button type='primary'>Verify Email</Button>
        </div>

        <span>
          <Link href='#'>
            <a> Resend Verification Link via Email </a>
          </Link>
        </span>

        <span>
          Go to OTP Verification ?
          <Link href='/verifyotp'>
            <a> Verify OTP </a>
          </Link>
        </span>

        <span>
          Back to Login Page ?
          <Link href='/'>
            <a> Login</a>
          </Link>
        </span>
      </div> */}
    </form>
  );
};
export default VerifyEmail;
