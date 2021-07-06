import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
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
      message: 'Please select time!',
    },
  ],
};

const Edit = () => {
  const router = useRouter();
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialState, setInitialState] = useState();
  const [options, setOptions] = useState([]);
  const [date, setDate] = useState();
  const [dateStr, setDateStr] = useState('');
  const [checkList, setCheckList] = useState();
  const [optionsAll, setOptionsAll] = useState();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const { id } = router.query;
    const load = async () => {
      const response = await client.get(`/user/public/neeri_user_personal_info/${id}/`);
      const checkedRoleList = response.data.roles.map((roles) => roles.role_id);
      setInitialState({ ...response.data, user_roles: checkedRoleList });
      const roleMaster = await client.get(`/user/public/role_master/`);
      const rolesData = roleMaster.data.map((roles) => ({
        label: roles.role_name,
        value: roles.role_id,
      }));
      setOptionsAll(rolesData);
    };
    if (id) load();
  }, []);

  const onFormSubmit = async (values) => {
    const roles = checkList.map((opt) => ({ role_id: opt }));
    const response = await client.put(`/user/public/neeri_user_personal_info/${router.query.id}/`, {
      ...values,
      user_id: router.query.id,
      user_address: '',
      date_of_birth: dateStr !== '' ? dateStr : initialState.date_of_birth,
      roles: roles,
      profile_photo: '',
    });
    if (response.data.message === 'mobile no. Already Exist') {
      message.error('Mobile No. already exist!');
    } else if (response.data.message === 'email Already Exist') {
      message.error('Email already exist!');
    } else {
      message.success('User Updated Successfully');
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
    const roleOpt = options.map((opt) => ({ role_id: opt }));
    setCheckList(options);
  };

  const handleDateChange = (date, dateString) => {
    setDate(date);
    setDateStr(dateString);
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }
  if (!initialState) return null;

  return (
    <>
      <Head>
        <title>Update User</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Update User</PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={initialState} scrollToFirstError>
                <Row gutter={[16, 0]}>
                  <Col span={24}>
                    {/* <Form.Item label="Profile Photo">
                      <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                      >
                        <Upload.Dragger name="files" action="/upload.do">
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                          </p>
                        </Upload.Dragger>
                      </Form.Item>
                    </Form.Item> */}
                  </Col>
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
                      disabled
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
                      <Input disabled={true} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='mobile_no'
                      label='Mobile No'
                      disabled
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
                      <Input placeholder='Enter Mobile Number' type='number' disabled={true} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Date of Birth' labelCol={{ span: 24 }} {...config}>
                      <DatePicker
                        value={date}
                        defaultValue={moment(initialState.date_of_birth)}
                        onChange={handleDateChange}
                        format='YYYY-MM-DD'
                      />
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
                      rules={[{ required: true, message: 'Please Pick Gender!' }]}
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
                      name='user_roles'
                      label='User Roles'
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Please select user role!' }]}
                    >
                      <Checkbox.Group
                        options={optionsAll}
                        // value={checkList}
                        // defaultValue={checkList}
                        onChange={handleChange}
                      />
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

export default Edit;
