import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Row, Col, Form, Input, Button, Space, message } from 'antd';
// Layouts
import DashboardLayout from '../../../../../containers/DashboardLayout/DashboardLayout';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
// Components
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
// Styles
import FormStyles from '../../../../../styled/Form.styles';
//Providers
import { useAuthState } from '../../../../../src/components/auth/hook';
import useUser from '../../../../../src/components/auth/useUser';

const Edit = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const router = useRouter();
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const { id } = router.query;
    const load = async () => {
      const response = await client.get(`/job_posting/get_qualification/${id}/`);
      setInitialState({
        ...response.data,
        short_code: response.data.short_code.join(', '),
      });
    };
    if (id) load();
  }, []);

  const onFormSubmit = async (values) => {
    await client.put(`/job_posting/update_qualification/${router.query.id}/`, {
      ...values,
      short_code: [values.short_code],
    });
    message.success('Qualification Updated Successfully');
    router.push('/admin/admin-section/qualification-master');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }
  if (!initialState) return null;

  return (
    <>
      <Head>
        <title>Update Qualification</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Update Qualification </PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={initialState} scrollToFirstError>
                <Row gutter={[16, 0]} justify='space-around'>
                  <Col span={14}>
                    <Form.Item
                      name='qualification'
                      label='Qualification'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Qualification',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Qualification' maxLength='100' type='text' />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name='short_code'
                      label='Short Code'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Short Code',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Short Code' maxLength='20' type='text' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/admin-section/qualification-master'>
                        <Button type='secondary' htmlType='button'>
                          Back
                        </Button>
                      </Link>
                      <Button type='primary' htmlType='submit'>
                        Save
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

export default Edit;
