import React from "react";
import Link from "next/link";
import SignInStyleWrapper from "../styled/SignIn.styles";
import SignInForm from "../src/components/signin/signin-form";

export default function SignInPage(props) {
  return (
    <SignInStyleWrapper className='isoSignInPage'>
      <div className='isoLoginContentWrapper'>
        <div className='isoLoginContent'>
          <div className='isoLogoWrapper'>Login</div>
          <SignInForm />
          <span>
            Don't have an account ?{" "}
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
