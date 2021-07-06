import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Row, Col, Form, Input, Button, Space, Select, message } from 'antd';
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

const DocumentAll = [
  { value: 'caste', label: 'Caste' },
  { value: 'personal', label: 'Personal' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'experience', label: 'Experience' },
  { value: 'published papers', label: 'Published Papers' },
  { value: 'others', label: 'Others' },
];

const Edit = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const router = useRouter();
  const [initialState, setInitialState] = useState();
  const [doc_type, setDoc_type] = useState('');

  useEffect(() => {
    const { id } = router.query;
    const load = async () => {
      const response = await client.get(`/document/docs/${id}/`);
      setInitialState({
        ...response.data,
      });
    };
    if (id) load();
  }, []);

  const onFormSubmit = async (values) => {
    await client.put(`/document/docs/${router.query.id}/`, {
      ...values,
      doc_name: values.doc_name,
    });
    message.success('Document Updated Successfully');
    router.push('/admin/admin-section/document-master');
  };

  const handleDocsChange = (value, obj) => {
    setDoc_type(value);
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }
  if (!initialState) return null;

  return (
    <>
      <Head>
        <title>Update Document</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Update Document </PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={initialState} scrollToFirstError>
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
                      label='Document Type'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Document Type',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder='Select Document Type'
                        defaultValue={initialState.doc_type}
                        onChange={handleDocsChange}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {DocumentAll.map((docs) => (
                          <Option value={docs.value} name={docs.value}>
                            {docs.label}
                          </Option>
                        ))}
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

export default Edit;
