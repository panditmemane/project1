import React, { useState } from 'react';
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

const InformationAll = [
  { value: 'education doctorate', label: 'Doctorate' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'international trips', label: 'International Trips' },
  { value: 'job history', label: 'Job History' },
  { value: 'personal', label: 'Personal' },
  { value: 'post graduation', label: 'Post Graduation' },
  { value: 'published papers', label: 'Published Papers' },
  { value: 'references', label: 'References' },
  { value: 'relatives in neeri', label: 'Relatives in Neeri' },
  { value: 'reservation', label: 'Reservation' },
  { value: 'typing speed', label: 'Typing Speed' },
];

const Add = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const router = useRouter();
  const [info_type, setInfo_type] = useState('');

  const onFormSubmit = async (values) => {
    await client.post('/document/info/', {
      ...values,
      info_name: values.info_name,
      info_type: info_type,
    });
    message.success('Information Added Successfully');
    router.push('/admin/admin-section/information-master');
  };

  const handleInfosChange = (value, obj) => {
    setInfo_type(value);
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Add Information</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Add Information </PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={{}} scrollToFirstError>
                <Row gutter={[16, 0]} justify='space-around'>
                  <Col span={14}>
                    <Form.Item
                      name='info_name'
                      label='Information Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Information Name',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Information Name' maxLength='100' type='text' />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name='info_type'
                      label='Select Information Type'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Information Type',
                        },
                      ]}
                    >
                      <Select
                        placeholder='Select Information Type'
                        showSearch
                        onChange={handleInfosChange}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {InformationAll.map((infos) => (
                          <Option value={infos.value} name={infos.value}>
                            {infos.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/admin-section/information-master'>
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
