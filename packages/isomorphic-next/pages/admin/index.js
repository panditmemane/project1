import React from 'react';
import Link from 'next/link';
import SignInStyleWrapper from '../../styled/SignIn.styles';
import SignInForm from '../../src/components/admin-signin/signin-form';

export default function AdminSignIn(props) {
  return (
    <SignInStyleWrapper className='isoSignInPage'>
      <div className='isoLoginContentWrapper'>
        <div className='isoLoginContent text-center'>
          <div className='isoLogoWrapper'>Admin Login</div>
          <SignInForm />
          {/* <span>
            Don't have an account ?{" "}
            <Link href='/signup'>
              <a> Register</a>
            </Link>
          </span> */}
          <span>
            <Link href='/forgotpassword'>
              <a> Forgot password</a>
            </Link>
          </span>
        </div>
      </div>
    </SignInStyleWrapper>
  );
}
