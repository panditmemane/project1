import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useUser from '../src/components/auth/useUser';
import { useAuthState } from '../src/components/auth/hook';
// import OtpInput from 'react-otp-input';
import { Space, Row, Col, Tag, Form, Button, Input, Modal, Select, message } from 'antd';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../containers/DashboardLayout/DashboardLayout';
import FormStyles from '../styled/Form.styles';
import PageHeader from '@iso/components/utility/pageHeader';
import Box from '@iso/components/utility/box';

const ChangeMobile = () => {
  const [form] = Form.useForm();
  const { user } = useUser({});
  const router = useRouter();
  const { client } = useAuthState();
  const [userId, setUserId] = useState('');
  const [otp, setOTP] = useState('');

  useEffect(() => {
    const load = () => {
      let { user_id } = user;
      if (user) {
        setUserId(user_id);
      }
    };
    if (user && user.isLoggedIn) load();
  }, [user]);

  const changeMobileNoConfirm = async (values) => {
    try {
      const response = await client.put(`/user/change_mobile_number/${userId}/`, {
        new_mobile_no: values.new_mobile_no,
      });
      message.success(response.data.message);
    } catch (error) {
      message.warning('OTP sending failed!');
    }
  };

  return (
    <>
      <Head>
        <title>Change Mobile No</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Change Mobile No</PageHeader>
            <Box>
              <Form name='formStep1' form={form} onFinish={changeMobileNoConfirm} scrollToFirstError>
                <Row gutter={[16, 0]} justify='space-around'>
                  <Col span={14}>
                    <Form.Item
                      name='new_mobile_no'
                      label='New Mobile No'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter mobile no!',
                        },
                        {
                          min: 10,
                          max: 10,
                          message: 'Please enter valid mobile no!',
                        },
                      ]}
                      hasFeedback
                    >
                      <Input />
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
                {/* <Row justify='center'>
                    <OtpInput value={otp} numInputs={6} separator={<span>-</span>} />
                </Row> */}
              </Form>
            </Box>
          </FormStyles>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default ChangeMobile;
