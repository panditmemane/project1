import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Row, Col, Form, Input, Button, Space, Select, message, InputNumber } from 'antd';
// Layouts
import DashboardLayout from '../../../../../../containers/DashboardLayout/DashboardLayout';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
// Components
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
// Styles
import FormStyles from '../../../../../../styled/Form.styles';
//Providers
import { useAuthState } from '../../../../../../src/components/auth/hook';
import useUser from '../../../../../../src/components/auth/useUser';

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

  const getSavedIds = (idField, records) => {
    var savedIds = [];
    records.map((data) => {
      savedIds.push(data[idField]);
    });
    return savedIds;
  };

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
        documents_required: getSavedIds('doc_id', response.data.temp_position_master.documents_required),
        information_required: getSavedIds('info_id', response.data.temp_position_master.information_required),
        qualification: getSavedIds('qualification_id', response.data.temp_position_master.qualification),
        qualification_job_history: getSavedIds(
          'qualification_job_id',
          response.data.temp_position_master.qualification_job_history
        ),
        salary: response.data.salary,
      });

      const docsData = response.data.temp_position_master.documents_required.map((item) => ({
        doc_id: item.doc_id,
        doc_name: item.doc_name,
        doc_type: item.doc_type,
      }));
      setDocument(docsData);

      const infosData = response.data.temp_position_master.information_required.map((item) => ({
        info_id: item.info_id,
        info_name: item.info_name,
        info_type: item.info_type,
      }));
      setInformation(infosData);

      const qualiInfo = response.data.temp_position_master.qualification.map((item) => ({
        qualification_id: item.qualification_id,
        qualification: item.qualification,
        short_code: item.short_code,
      }));
      setQualification(qualiInfo);

      const jobData = response.data.temp_position_master.qualification_job_history.map((item) => ({
        qualification_job_id: item.qualification_job_id,
        qualification: item.qualification,
        short_code: item.short_code,
      }));
      setQualificationjob(jobData);

      const document = docData.data.map((div) => ({
        doc_id: div.doc_id,
        doc_name: div.doc_name,
        doc_type: div.doc_type,
      }));
      const information = infoData.data.map((info) => ({
        info_id: info.info_id,
        info_name: info.info_name,
        info_type: info.info_type,
      }));
      const qualificationData = qualiData.data.map((res) => ({
        qualification_id: res.qualification_id,
        qualification: res.qualification,
        short_code: res.short_code,
      }));
      const qualificationJob = qualiJobData.data.map((res) => ({
        qualification_job_id: res.qualification_job_id,
        qualification: res.qualification,
        short_code: res.short_code,
      }));
      setDocOption(document);
      setinfoOption(information);
      setQualiOption(qualificationData);
      setQualiJobOption(qualificationJob);
    };
    if (id) load();
  }, []);

  const handleDocChange = (value, obj) => {
    const doc = obj.map((item) => ({
      doc_id: item.value,
      doc_name: item.children,
      doc_type: item.name,
    }));
    setDocument(doc);
  };

  const handleInfoChange = (value, obj) => {
    const info = obj.map((item) => ({
      info_id: item.value,
      info_name: item.children,
      info_type: item.name,
    }));
    setInformation(info);
  };

  const handleQualiChange = (value, obj) => {
    const data = obj.map((item) => ({
      qualification_id: item.value,
      qualification: item.children,
      short_code: item.name,
    }));
    setQualification(data);
  };

  const handleQualiJobChange = (value, obj) => {
    const job = obj.map((item) => ({
      qualification_job_id: item.value,
      qualification: item.children,
      short_code: item.name,
    }));
    setQualificationjob(job);
  };

  const onFormSubmit = async (values) => {
    await client.put(`/job_posting/temporary_positions/${router.query.id}/`, {
      temp_position_id: initialState.temp_position_id,
      temp_position_master: {
        position_id: initialState.temp_position_master.position_id,
        position_name: values.position_name,
        position_display_name: values.position_display_name,
        min_age: values.min_age,
        max_age: values.max_age,
        qualification_desc: values.qualification_desc,
        documents_required: document,
        information_required: information,
        qualification: qualificationData,
        qualification_job_history: qualificationJob,
      },
      allowance: values.allowance,
      salary: values.salary,
    });
    message.success('Position Updated Successfully');
    router.push('/admin/admin-section/job-position-master/temporary/');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }
  if (!initialState) return null;

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
                      label='Position Display Name'
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
                    <Form.Item name='documents_required' label='Required Documents' labelCol={{ span: 24 }}>
                      <Select
                        placeholder='Select Required Documents'
                        allowClear
                        onChange={handleDocChange}
                        mode='multiple'
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {docOption.map((doc) => (
                          <Option value={doc.doc_id} name={doc.doc_type}>
                            {doc.doc_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name='information_required' label='Required Information' labelCol={{ span: 24 }}>
                      <Select
                        placeholder='Select Required Information'
                        mode='multiple'
                        allowClear
                        onChange={handleInfoChange}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {infoOption.map((info) => (
                          <Option value={info.info_id} name={info.info_type}>
                            {info.info_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name='salary' label='Salary Amount' labelCol={{ span: 24 }}>
                      <InputNumber placeholder='Enter Salary' type='number' />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name='min_age'
                      label='Minimum Age'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          type: 'number',
                          min: 0,
                          max: 99,
                        },
                      ]}
                    >
                      <InputNumber placeholder='Enter Min Age' type='number' maxLength='2' />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name='max_age'
                      label='Maximum Age'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          type: 'number',
                          min: 0,
                          max: 99,
                        },
                      ]}
                    >
                      <InputNumber placeholder='Enter Max Age' type='number' maxLength='2' />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name='qualification_desc' label='Qualification Description' labelCol={{ span: 24 }}>
                      <TextArea placeholder='Enter Qualification Description' allowClear rows={4} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name='qualification' label='Qualifications Degrees' labelCol={{ span: 24 }}>
                      <Select
                        placeholder='Select Qualification Degrees'
                        mode='multiple'
                        allowClear
                        onChange={handleQualiChange}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {qualiOption.map((quali) => (
                          <Option value={quali.qualification_id} name={quali.short_code}>
                            {quali.qualification}
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
                    >
                      <Select
                        placeholder='Select Qualification Job History'
                        mode='multiple'
                        allowClear
                        onChange={handleQualiJobChange}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {qualijobOption.map((qualiJob) => (
                          <Option value={qualiJob.qualification_job_id} name={qualiJob.short_code}>
                            {qualiJob.qualification}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name='allowance' initialValue='hra' style={{ display: 'none' }}>
                      <Input type='hidden' name='allowance' initialValue='hra' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/admin-section/job-position-master/temporary'>
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
