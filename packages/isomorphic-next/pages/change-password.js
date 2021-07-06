import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useUser from '../src/components/auth/useUser';
import { useAuthState } from '../src/components/auth/hook';
import { Space, Row, Col, Tag, Form, Button, Input, Modal, Select, message } from 'antd';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../containers/DashboardLayout/DashboardLayout';
import FormStyles from '../styled/Form.styles';
import PageHeader from '@iso/components/utility/pageHeader';
import Box from '@iso/components/utility/box';
import onLogOut from '../../isomorphic-next/containers/Topbar/TopbarUser';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const { user } = useUser({});
  const router = useRouter();
  const { client } = useAuthState();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const load = () => {
      let { user_id } = user;
      if (user) {
        setUserId(user_id);
      }
    };
    if (user && user.isLoggedIn) load();
  }, [user]);

  const changePasswordConfirm = async (values) => {
    try {
      const response = await client.put(`/user/change_password/${userId}/`, {
        old_password: values.old_password,
        new_password: values.new_password,
        confirm_password: values.confirm,
      });
      message.success(response.data.message);
      router.push('/');
    } catch (error) {
      message.warning('Wrong current password!');
    }
  };

  return (
    <>
      <Head>
        <title>Change Password</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Change Password</PageHeader>
            <Box>
              <Form name='formStep1' form={form} onFinish={changePasswordConfirm} scrollToFirstError>
                <Row gutter={[16, 0]} justify='space-around'>
                  <Col span={14}>
                    <Form.Item
                      name='old_password'
                      label='Current Password'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter old password!',
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name='new_password'
                      label='New Password'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter new password!',
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name='confirm'
                      label='Confirm Password'
                      labelCol={{ span: 24 }}
                      dependencies={['password']}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Please enter confirm password!',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('new_password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>

                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/job-posts/'>
                        <Button type='secondary' htmlType='button'>
                          Back
                        </Button>
                      </Link>
                      <Button type='primary' htmlType='submit'>
                        Submit
                      </Button>
                    </Space>
                  </Form.Item>
                </Row>
              </Form>
            </Box>
          </FormStyles>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default ChangePassword;
