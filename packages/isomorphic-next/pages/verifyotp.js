import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Input from '@iso/components/uielements/input';
import Checkbox from '@iso/components/uielements/checkbox';
import Button from '@iso/components/uielements/button';
import FirebaseSignUpForm from '@iso/containers/FirebaseForm/FirebaseForm';
import authAction from '@iso/redux/auth/actions';
import appActions from '@iso/redux/app/actions';
import Auth0 from '../authentication/Auth0';
import IntlMessages from '@iso/components/utility/intlMessages';
import SignUpStyleWrapper from '../styled/SignUp.styles';
import VerifyOTP from '../src/components/verifyMobile/verifyotp';

const { login } = authAction;
const { clearMenu } = appActions;

export default function verifyOTP() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = (token = false) => {
    console.log(token, 'handlelogin');
    if (token) {
      dispatch(login(token));
    } else {
      dispatch(login());
    }
    dispatch(clearMenu());
    history.push('/dashboard');
  };
  return (
    <SignUpStyleWrapper className='isoSignUpPage'>
      <div className='isoSignUpContentWrapper'>
        <div className='isoSignUpContent'>
          <div className='isoLogoWrapper'>OTP Verification</div>

          <div className='isoSignUpForm'>
            <VerifyOTP />
          </div>
        </div>
      </div>
    </SignUpStyleWrapper>
  );
}
