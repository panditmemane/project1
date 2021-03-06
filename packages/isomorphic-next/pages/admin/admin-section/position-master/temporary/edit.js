import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Row, Col, Form, Input, Button, Space, Select, message, InputNumber } from 'antd';
// Layouts
import DashboardLayout from '../../../../../containers/DashboardLayout/DashboardLayout';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
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
  const [docOption, setDocOption] = useState([]);
  const [document, setDocument] = useState({});
  const [infoOption, setinfoOption] = useState([]);
  const [information, setInformation] = useState({});
  const [qualificationData, setQualification] = useState({});
  const [qualiOption, setQualiOption] = useState([]);
  const [qualificationJob, setQualificationjob] = useState({});
  const [qualijobOption, setQualiJobOption] = useState([]);

  const { TextArea } = Input;

  useEffect(() => {
    const { id } = router.query;
    const load = async () => {
      const response = await client.get(`/job_posting/temporary_positions/${id}/`);
      const docData = await client.get('/document/docs/');
      const infoData = await client.get('/document/info/');
      const qualiData = await client.get('/job_posting/qualification_list/');
      const qualiJobData = await client.get('/job_posting/qualification_job_history/');
      setInitialState({
        ...response.data,
        position_name: response.data.temp_position_master.position_name,
        position_display_name: response.data.temp_position_master.position_display_name,
        min_age: response.data.temp_position_master.min_age,
        max_age: response.data.temp_position_master.max_age,
        qualification_desc: response.data.temp_position_master.qualification_desc,
        documents_required: [document],
        information_required: [information],
        qualification: [qualificationData],
        qualification_job_history: [qualificationJob],
      });
      console.log(response.data);
      const document = docData.data.map((div) => ({
        value: div.doc_id,
        label: div.doc_name,
        doc_type: div.doc_type,
      }));
      console.log(docData);
      const information = infoData.data.map((info) => ({
        value: info.info_id,
        label: info.info_name,
        info_type: info.info_type,
      }));
      const qualificationData = qualiData.data.map((res) => ({
        value: res.qualification_id,
        label: res.qualification,
        short_code: [res.short_code],
      }));
      const qualificationJob = qualiJobData.data.map((res) => ({
        value: res.qualification_job_id,
        label: res.qualification,
        short_code: [res.short_code],
      }));
      setDocOption(document);
      setinfoOption(information);
      setQualiOption(qualificationData);
      setQualiJobOption(qualificationJob);
    };
    if (id) load();
  }, []);

  const onFormSubmit = async (values) => {
    await client.put(`/job_posting/temporary_positions/${router.query.id}/`, {
      temp_position_id: values.temp_position_id,
      temp_position_master: {
        position_id: values.position_id,
        position_name: values.position_name,
        position_display_name: values.position_display_name,
        min_age: values.min_age,
        max_age: values.max_age,
        qualification_desc: values.qualification_desc,
        documents_required: [document],
        information_required: [information],
        qualification: [qualificationData],
        qualification_job_history: [qualificationJob],
      },
      salary: values.salary,
    });
    console.log('sav', values);
    message.success('Position Updated Successfully');
    router.push('/admin/admin-section/position-master');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }
  if (!initialState) return null;

  const handleDocChange = (value, obj) => {
    debugger;
    const docObj = { doc_id: value, doc_name: obj.name, doc_type: obj.children[0] };
    setDocument(docObj);
  };

  const handleInfoChange = (value, obj) => {
    debugger;
    const infoObj = { info_id: value, info_name: obj.name, info_type: obj.children[0] };
    setInformation(infoObj);
  };

  const handleQualiChange = (value, obj) => {
    debugger;
    const QualiObj = { qualification_id: value, qualification: obj.children[0], short_code: obj.name[0] };
    setQualification(QualiObj);
  };

  const handleQualiJobChange = (value, obj) => {
    const QualiJOb = { qualification_job_id: value, qualification: obj.children[0], short_code: obj.name[0] };
    setQualificationjob(QualiJOb);
  };

  console.log(initialState);
  return (
    <>
      <Head>
        <title>Update Position Temporary</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Update Position Temporary</PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={initialState} scrollToFirstError>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <Form.Item
                      name='position_name'
                      label='Position Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Position Name',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Position Name' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='position_display_name'
                      label='Position Display Name*'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Position Display Name',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Position Display Name' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      defaultValue={initialState.temp_position_master.documents_required.doc_id}
                      name={initialState.temp_position_master.documents_required.doc_name}
                      label='Required Documents'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Required Documents',
                        },
                      ]}
                    >
                      <Select placeholder='Select Required Documents' onChange={handleDocChange}>
                        {docOption.map((doc) => (
                          <Option value={doc.value} name={doc.doc_type}>
                            {doc.label}{' '}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name='requiredInformation'
                      label='Required Information'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Required Information',
                        },
                      ]}
                    >
                      <Select placeholder='Select Required Information' onChange={handleInfoChange}>
                        {infoOption.map((info) => (
                          <Option value={info.value} name={info.info_type}>
                            {info.label}{' '}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name='salary'
                      label='Salary Amount'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Salary',
                        },
                      ]}
                    >
                      <InputNumber placeholder='Enter Salary' />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name='min_age'
                      label='Minimum Age'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Min Age',
                        },
                      ]}
                    >
                      <InputNumber placeholder='Enter Min Age' />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name='max_age'
                      label='Maximum Age'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Max Age',
                        },
                      ]}
                    >
                      <InputNumber placeholder='Enter Max Age' />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='qualification_desc'
                      label='Qualification Description'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Qualification Description',
                        },
                      ]}
                    >
                      <TextArea placeholder='Enter Qualification Description' allowClear rows={4} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='qualification'
                      label='Qualifications Degrees'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Qualification Degrees',
                        },
                      ]}
                    >
                      <Select placeholder='Select Qualification Degrees' onChange={handleQualiChange}>
                        {qualiOption.map((quali) => (
                          <Option value={quali.value} name={quali.short_code}>
                            {quali.label}{' '}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='qualification_job_history'
                      label='Qualifications Job History'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Qualification Job History',
                        },
                      ]}
                    >
                      <Select placeholder='Select Qualification Job History' onChange={handleQualiJobChange}>
                        {qualijobOption.map((qualiJob) => (
                          <Option value={qualiJob.value} name={qualiJob.short_code}>
                            {qualiJob.label}{' '}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/admin-section/position-master/temporary'>
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
