import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Row, Col, Form, Input, Button, Space, Select, message } from 'antd';
// Layouts
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
// Components
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
// Styles
import FormStyles from '../../../../styled/Form.styles';
//Providers
import { useAuthState } from '../../../../src/components/auth/hook';
import useUser from '../../../../src/components/auth/useUser';

const Add = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const router = useRouter();

  const onFormSubmit = async (values) => {
    await client.post('/document/docs/', {
      ...values,
      doc_name: values.doc_name,
      doc_type: values.doc_type,
    });
    message.success('Document Added Successfully');
    router.push('/admin/admin-section/document-master');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Add Document</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Add Document </PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={{}} scrollToFirstError>
                <Row gutter={[16, 0]} justify='space-around'>
                  <Col span={14}>
                    <Form.Item
                      name='doc_name'
                      label='Document Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Document Name',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Document Name' maxLength='100' type='text' />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name='doc_type'
                      label='Select Document Type'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Document Type',
                        },
                      ]}
                    >
                      <Select placeholder='Select Document Type'>
                        <Option value='caste'>Caste</Option>
                        <Option value='personal'>Personal</Option>
                        <Option value='qualification'>Qualification</Option>
                        <Option value='experience'>Experience</Option>
                        <Option value='published'>Published</Option>
                        <Option value='papers'>Papers</Option>
                        <Option value='others'>Others</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/admin-section/document-master'>
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

export default Add;
