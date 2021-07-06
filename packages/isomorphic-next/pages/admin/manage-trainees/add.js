import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../containers/DashboardLayout/DashboardLayout';
import FormStyles from '../../../styled/Form.styles';
import PageHeader from '@iso/components/utility/pageHeader';
import { Row, Col, Form, Input, Button, Space, DatePicker, message } from 'antd';
import Box from '@iso/components/utility/box';
import { useAuthState } from '../../../src/components/auth/hook';
import useUser from '../../../src/components/auth/useUser';
import { Select } from 'antd';

const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: 'Please Select Date!',
    },
  ],
};

const statusAll = [
  { value: 0, label: 'active' },
  { value: 1, label: 'yet to join' },
  { value: 2, label: 'completed' },
];

const AddTrainee = () => {
  const router = useRouter();
  const { client } = useAuthState();
  const { user } = useUser({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [division, setDiv] = useState({});
  const [mentors, setMntrs] = useState({});
  const [dateStr, setDateString] = useState();
  const [status, setStatus] = useState(false);
  const [divOptions, setDivision] = useState([]);
  const [mentorOptions, setMentor] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/job_posting/division_list_and_create/`);
      const mentorRes = await client.get(`/user/mentor/`);
      const division = response.data.map((div) => ({
        value: div.division_id,
        label: div.division_name,
      }));
      const mentors = mentorRes.data.map((mentor) => ({
        mentor_id: mentor.mentor_id,
        mentor_name: mentor.mentor_name,
      }));
      setDivision(division);
      setMentor(mentors);
    };
    load();
  }, []);

  const onFormSubmit = async (values) => {
    console.log(values, division, mentors, status, values['emp_start_date'].format('YYYY-MM-DD'));
    await client.post(`/user/trainee/`, {
      trainee_name: values.trainee_name,
      email: values.email,
      mobile_no: values.mobile_no,
      division: division,
      mentor: mentors,
      status: status,
      emp_start_date: values['emp_start_date'].format('YYYY-MM-DD'),
      emp_end_date: values['emp_end_date'].format('YYYY-MM-DD'),
    });
    message.success('Trainee Added Successfully');
    router.push('/admin/manage-trainees');
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const dateChangeHandler = (date, dateString) => {
    //console.log(date, dateString);
    setStartDate(date);
    setDateString(dateString);
  };

  const endDateChangeHandler = (date, dateString) => {
    setEndDate(date);
    setDateString(dateString);
  };

  const handleDivChange = (value, obj) => {
    const divObj = { division_id: value, division_name: obj.name };
    setDiv(divObj);
  };

  const handleMentorChange = (value, obj) => {
    const mentorObj = { mentor_id: value, mentor_name: obj.name };
    setMntrs(mentorObj);
  };

  const handleStatusChange = (value, obj) => {
    setStatus(obj.name);
  };

  return (
    <>
      <Head>
        <title>Add Trainee</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Add/Update Trainee</PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} scrollToFirstError>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <Form.Item
                      name='trainee_name'
                      label='Trainee Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Trainee Name',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label='Department'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Department',
                        },
                      ]}
                    >
                      <Select placeholder='Select Department' onChange={handleDivChange}>
                        {divOptions.map((div) => (
                          <Option value={div.value} name={div.label}>
                            {div.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label='Mentor'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Mentor',
                        },
                      ]}
                    >
                      <Select placeholder='Select Mentor' onChange={handleMentorChange}>
                        {mentorOptions.map((mentor) => (
                          <Option value={mentor.mentor_id} name={mentor.mentor_name}>
                            {mentor.mentor_name}
                          </Option>
                        ))}
                      </Select>
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
                      ]}
                    >
                      <Input />
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
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='emp_start_date' label='Employee Start Date' labelCol={{ span: 24 }} {...config}>
                      <DatePicker format='YYYY-MM-DD' value={startDate} onChange={dateChangeHandler} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='emp_end_date' label='Employee End Date' labelCol={{ span: 24 }} {...config}>
                      <DatePicker format='YYYY-MM-DD' value={endDate} onChange={endDateChangeHandler} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Status' labelCol={{ span: 24 }}>
                      <Select placeholder='Select Status' onChange={handleStatusChange}>
                        {statusAll.map((status) => (
                          <Option value={status.value} name={status.label}>
                            {status.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/manage-trainees'>
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

export default AddTrainee;
