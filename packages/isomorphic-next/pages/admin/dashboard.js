import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from '../../src/components/auth/hook';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import Widgets from '@iso/containers/Widgets/Widgets';
import useUser from '../../src/components/auth/useUser';
import { Space, Row, Col, Tag, Form, Button, Input, Modal, Select, message } from 'antd';

export default function Dashboard() {
  const { user } = useUser({ redirectTo: '/admin' });
  const [form] = Form.useForm();
  const { client } = useAuthState();
  const dispatch = useDispatch();
  const router = useRouter();

  const [modalVisible, setVisible] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const load = () => {
      let userInfo = user;
      if (userInfo.user) {
        if (userInfo.user.is_first_login) {
          setVisible(true);
          setUserId(userInfo.user.user_id);
        } else {
          setVisible(false);
        }
      }
    };

    if (user && user.isLoggedIn) load();
  }, []);

  const changePasswordConfirm = async (values) => {
    console.log(values);
    const response = await client.put(`/user/change_password/${userId}/`, {
      old_password: values.old_password,
      new_password: values.new_password,
      confirm_password: values.confirm,
    });
    message.warning(response.data.message);
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
    router.push('/admin/');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardLayout>
        <Modal
          title={`You need to change password after first time login`}
          style={{ top: 20 }}
          visible={modalVisible}
          footer={null}
          closable={false}
        >
          <Form name='formStep1' form={form} onFinish={changePasswordConfirm} scrollToFirstError>
            <Row gutter={[16, 0]}>
              <Col span={24}>
                <Form.Item
                  name='old_password'
                  label='Old Password'
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter old password!',
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={24}>
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
              <Col span={24}>
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
                  <Button
                    type='primary'
                    htmlType='submit'
                    // onClick={() => {
                    //   form
                    //     .validateFields()
                    //     .then(() => {
                    //       form.resetFields();
                    //       resetPasswordConfirm();
                    //     })
                    //     .catch((info) => {
                    //       console.log('Validate Failed:', info);
                    //     });
                    // }}
                  >
                    Submit
                  </Button>
                </Space>
              </Form.Item>
            </Row>
          </Form>
        </Modal>
        <Widgets />
      </DashboardLayout>
    </>
  );
}
