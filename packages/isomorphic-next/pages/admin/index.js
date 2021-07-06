import React from 'react';
import SignInStyleWrapper from '../../styled/SignIn.styles';
import SignInForm from '../../src/components/admin-signin/signin-form';

export default function AdminSignIn(props) {
  return (
    <SignInStyleWrapper className='isoSignInPage'>
      <div className='isoLoginContentWrapper'>
        <div className='isoLoginContent text-center'>
          <div className='isoLogoWrapper'>Admin Login</div>
          <SignInForm />
        </div>
      </div>
    </SignInStyleWrapper>
  );
}
