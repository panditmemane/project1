import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../containers/DashboardLayout/DashboardLayout';
import moment from 'moment';
import FormStyles from '../../../styled/Form.styles';
import PageHeader from '@iso/components/utility/pageHeader';
import { Row, Col, Form, Input, Button, Space, message, DatePicker, Select } from 'antd';
import Box from '@iso/components/utility/box';
import { useAuthState } from '../../../src/components/auth/hook';
import useUser from '../../../src/components/auth/useUser';

const statusAll = [
  { value: 0, label: 'active' },
  { value: 1, label: 'yet to join' },
  { value: 2, label: 'completed' },
];

const Edit = () => {
  const router = useRouter();
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialState, setInitialState] = useState();
  const [mentorOptions, setMentorList] = useState([]);
  const [divisions, setDivisionsAll] = useState([]);
  const [division, setDiv] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState('');
  const [mentors, setMntrs] = useState({});
  const [startStrDate, setStartStrDate] = useState('');
  const [endStrDate, setEndStrDate] = useState('');

  useEffect(() => {
    const { id } = router.query;
    const load = async () => {
      const response = await client.get(`/user/trainee/${id}/`);
      setInitialState({ ...response.data });
      const div = {
        division_id: response.data.division.division_id,
        division_name: response.data.division.division_name,
      };
      setDiv(div);
      const mentors = {
        mentor_id: response.data.mentor.mentor_id,
        mentor_name: response.data.mentor.mentor_name,
      };
      setMntrs(mentors);
      const divMaster = await client.get(`/job_posting/division_list_and_create/`);
      const mentorRes = await client.get(`/user/mentor/`);
      const divData = divMaster.data.map((div) => ({
        division_name: div.division_name,
        division_id: div.division_id,
      }));
      setDivisionsAll(divData);
      const mentorList = mentorRes.data.map((mentor) => ({
        mentor_name: mentor.mentor_name,
        mentor_id: mentor.mentor_id,
      }));
      setMentorList(mentorList);
    };
    if (id) load();
  }, []);

  if (!user || !user.isLoggedIn) {
    return null;
  }
  if (!initialState) return null;

  const onFormSubmit = async (values) => {
    await client.put(`/user/trainee/${router.query.id}/`, {
      trainee_name: values.trainee_name,
      trainee_id: values.trainee_id,
      generated_trainee_id: initialState.generated_trainee_id,
      email: values.email,
      mobile_no: values.mobile_no,
      division: division,
      mentor: mentors,
      status: status !== '' ? status : initialState.status,
      emp_start_date: startStrDate !== '' ? startStrDate : initialState.emp_start_date,
      emp_end_date: endStrDate !== '' ? endStrDate : initialState.emp_end_date,
    });
    message.success('Trainee Updated Successfully');
    router.push('/admin/manage-trainees');
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

  const handleStartDateChange = (date, dateString) => {
    setStartDate(date);
    setStartStrDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(date);
    setEndStrDate(dateString);
  };

  return (
    <>
      <Head>
        <title>Edit User</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Add/Update User</PageHeader>
            <Box>
              <Form
                name='formStep1'
                onFinish={onFormSubmit}
                initialValues={initialState}
                key='trainee_id'
                scrollToFirstError
              >
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
                    <Form.Item label='Department' name='division_id' labelCol={{ span: 24 }}>
                      <Select
                        defaultValue={initialState.division.division_id}
                        name={initialState.division.division_name}
                        placeholder='Select Department'
                        onChange={handleDivChange}
                      >
                        {divisions.map((div) => (
                          <Option value={div.division_id} name={div.division_name}>
                            {div.division_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='mentor_id' label='Mentor' labelCol={{ span: 24 }}>
                      <Select
                        defaultValue={initialState.mentor.mentor_id}
                        name={initialState.mentor.mentor_name}
                        placeholder='Select Mentor'
                        onChange={handleMentorChange}
                      >
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
                    <Form.Item label='Employee Start Date' labelCol={{ span: 24 }}>
                      <DatePicker
                        value={startDate}
                        defaultValue={moment(initialState.emp_start_date)}
                        onChange={handleStartDateChange}
                        format='YYYY-MM-DD'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Employee End Date' labelCol={{ span: 24 }}>
                      <DatePicker
                        value={endDate}
                        defaultValue={moment(initialState.emp_end_date)}
                        onChange={handleEndDateChange}
                        format='YYYY-MM-DD'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='status' label='Status' labelCol={{ span: 24 }}>
                      <Select
                        defaultValue={initialState.status}
                        placeholder='Select Status'
                        onChange={handleStatusChange}
                      >
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

export default Edit;
