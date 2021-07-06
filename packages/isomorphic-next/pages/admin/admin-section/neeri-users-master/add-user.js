import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../../../../containers/Admin/NeeriUsers/validations';
import FormStyles from '../../../../styled/Form.styles';
import PageHeader from '@iso/components/utility/pageHeader';
import { Row, Col, Form, Input, Button, Space, Checkbox, Radio, DatePicker, Upload, message } from 'antd';
import Box from '@iso/components/utility/box';
import { useAuthState } from '../../../../src/components/auth/hook';
import useUser from '../../../../src/components/auth/useUser';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: 'Please Select Date!',
    },
  ],
};

const AddUser = () => {
  const router = useRouter();
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialState, setInitialState] = useState();
  const [checkList, setCheckList] = useState();
  const [roleList, setRoleList] = useState();
  const [date, setDate] = useState();
  const [dateStr, setDateString] = useState();
  const [loading, setLoading] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/user/public/role_master/`);
      const rolesData = response.data.map((roles) => ({
        label: roles.role_name,
        value: roles.role_id,
      }));
      setCheckList(rolesData);
    };
    load();
  }, []);

  const onFormSubmit = async (values) => {
    const response = await client.post(`/user/create_neeri_user/`, {
      first_name: values.first_name,
      middle_name: values.middle_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      mobile_no: values.mobile_no,
      religion: values.religion,
      caste: values.caste,
      gender: values.gender,
      date_of_birth: dateStr,
      roles: roleList,
      profile_photo: '',
    });
    if (response.data.message === 'mobile no. Already Exist') {
      message.error('Mobile No. already exist!');
    } else if (response.data.message === 'email Already Exist') {
      message.error('Email already exist!');
    } else {
      message.success('User Added Successfully');
      router.push('/admin/admin-section/neeri-users-master');
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleChange = (options) => {
    const updatedRoleList = options.map((options) => ({ role_id: options }));
    setRoleList(updatedRoleList);
  };

  const dateChangeHandler = (date, dateString) => {
    setDate(date);
    setDateString(dateString);
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Add User</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Add User</PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={initialState} scrollToFirstError>
                <Row gutter={[16, 0]}>
                  {/* <Col span={24}>
                    <Form.Item label="Profile Photo">
                      <Form.Item name="profile_photo" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <Upload.Dragger name="files" action="/upload.do">
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">Click or drag file to this area to upload</p>
                          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </Upload.Dragger>
                      </Form.Item>
                    </Form.Item>
                  </Col> */}
                  <Col span={12}>
                    <Form.Item
                      name='first_name'
                      label='First Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter First Name',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='middle_name'
                      label='Middle Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Middle Name',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='last_name'
                      label='Last Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Last Name',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='email'
                      label='Email'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Email',
                        },
                        {
                          type: 'email',
                          message: 'Please enter valid email',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='password'
                      label='Password'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Password',
                        },
                      ]}
                    >
                      <Input type='password' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='mobile_no'
                      label='Mobile No'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Mobile No',
                        },
                        {
                          min: 10,
                          max: 10,
                          message: 'Please enter valid mobile no.',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Mobile No' type='number' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='date_of_birth' label='DOB' labelCol={{ span: 24 }} {...config}>
                      <DatePicker format='YYYY-MM-DD' value={date} onChange={dateChangeHandler} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='religion'
                      label='Religion'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Religion',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='caste'
                      label='Caste'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Caste',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='gender'
                      label='Gender'
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Please pick gender!' }]}
                    >
                      <Radio.Group name='gender' value='gender'>
                        <Radio value='male'>Male</Radio>
                        <Radio value='female'>Female</Radio>
                        <Radio value='others'>Others</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='user_role'
                      label='User Roles'
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Please select user role!' }]}
                    >
                      <Checkbox.Group options={checkList} onChange={handleChange} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/admin-section/neeri-users-master'>
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

export default AddUser;
