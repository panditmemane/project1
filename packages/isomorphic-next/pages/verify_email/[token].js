import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SignUpStyleWrapper from '../../styled/SignUp.styles';
import { useAuthState } from '../../src/components/auth/hook';
import { message } from 'antd';

export default function EmailTokenVerify() {
  const router = useRouter();
  const { token } = router.query;
  const { client } = useAuthState();

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`user/email_token_verify/${token}/`);
      const msg = response.data.message;
      message.warning(msg);
      window.setTimeout(() => {
        router.push('/');
      }, 4000);
    };
    if (token) load();
  }, [token]);

  return (
    <SignUpStyleWrapper className='isoSignUpPage'>
      <div className='isoSignUpContentWrapper'>
        {/* <div className='isoSignUpContent'>
          <div className='isoLogoWrapper'>Email Verification</div>
          <div className='isoSignUpForm'>
            <VerifyEmail token={token} />
          </div>
        </div> */}
      </div>
    </SignUpStyleWrapper>
  );
}
