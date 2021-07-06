import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SignInStyleWrapper from '../styled/SignIn.styles';
import SignInForm from '../src/components/signin/signin-form';
import useUser from '../src/components/auth/useUser';

export default function SignInPage(props) {
  const { user } = useUser({ redirectTo: '/' });
  const router = useRouter();

  useEffect(() => {
    const roles = JSON.parse(window.localStorage.getItem('roles'));

    if (user && user.isLoggedIn !== null && user.isLoggedIn && roles && roles !== null) {
      if (roles.includes('applicant')) {
        router.push('/job-posts');
      } else {
        router.push('/admin/dashboard');
      }
    }
  }, [user]);

  return (
    <SignInStyleWrapper className='isoSignInPage'>
      <div className='isoLoginContentWrapper'>
        <div className='isoLoginContent'>
          <div className='isoLogoWrapper'>Login</div>
          <SignInForm />
          <span>
            Don't have an account ?{' '}
            <Link href='/signup'>
              <a> Register</a>
            </Link>
          </span>
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
