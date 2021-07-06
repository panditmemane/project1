import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Popover from '@iso/components/uielements/popover';
import TopbarDropdownWrapper from './TopbarDropdown.styles';
import { Space, Row, Col, Tag, Form, Button, Input, Modal, Select, message } from 'antd';

import userpic from '@iso/assets/images/user1.png';

export default function TopbarUser() {
  const router = useRouter();
  const [visible, setVisibility] = React.useState(false);
  const [showChangeMobile, setChangeMobile] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const roles = window.localStorage.getItem('roles').includes('applicant');
    if (roles) {
      setChangeMobile(true);
    }
  }, []);

  function handleVisibleChange() {
    setVisibility((visible) => !visible);
  }
  const onLogOut = (e) => {
    e.preventDefault();
    if (window.localStorage.getItem('roles').includes('applicant')) {
      router.push('/');
    } else {
      router.push('/admin/');
    }
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('roles');
    window.localStorage.removeItem('authUser');
    window.localStorage.clear();
    dispatch({
      type: 'set',
      payload: {
        user: {
          isLoggedIn: false,
        },
        roles: [],
      },
    });
  };

  const onChangePassword = () => {
    if (window.localStorage.getItem('roles').includes('applicant')) {
      router.push('/change-password/');
    } else {
      router.push('/admin/change-password/');
    }
  };

  const onChangeMobileNo = () => {
    router.push('/change-mobileno/');
  };

  const content = (
    <TopbarDropdownWrapper className='isoUserDropdown'>
      <a onClick={onLogOut} className='isoDropdownLink'>
        Logout
      </a>
      <a onClick={onChangePassword} className='isoDropdownLink'>
        Change Password
      </a>
      {showChangeMobile ? (
        <a onClick={onChangeMobileNo} className='isoDropdownLink'>
          Change Mobile No
        </a>
      ) : (
        ''
      )}
    </TopbarDropdownWrapper>
  );

  return (
    <Popover
      content={content}
      trigger='click'
      visible={visible}
      onVisibleChange={handleVisibleChange}
      arrowPointAtCenter={true}
      placement='bottomLeft'
    >
      <div className='isoImgWrapper'>
        <img alt='user' src={userpic} />
        {/* <span className='userActivity online' /> */}
      </div>
    </Popover>
  );
}
