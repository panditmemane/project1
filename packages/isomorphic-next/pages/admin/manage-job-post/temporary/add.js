import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { palette } from 'styled-theme';
import { useRouter } from 'next/router';
import { Row, Col, Form, Input, Button, DatePicker, Select, Upload, message, Typography } from 'antd';
// Icons
import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// Layouts
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
// Components
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
// Hooks / API Calls
import { useAuthState } from '../../../../src/components/auth/hook';
import useUser from '../../../../src/components/auth/useUser';
import {
  createJobPost,
  getDivisions,
  getZonals,
  getQualification,
  getTemporaryPositions,
  getQualificationJobHistory,
  getInformationRequired,
  getDocuments,
  uploadFile,
} from '../../../../src/apiCalls';
// Styles
import FormStyles from '../../../../styled/Form.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const JobPostTemporaryAdd = () => {
  const router = useRouter();

  const { Text } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const { Dragger } = Upload;

  const { client } = useAuthState();
  const { user } = useUser({});

  const [token, setToken] = useState('');
  const [zonals, setZonals] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [positions, setPositions] = useState([]);
  const [qualificationJobHistory, setQualificationJobHistory] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [informationRequired, setInformationRequired] = useState([]);
  const [documentsUploaded, setDocumentsUploaded] = useState([]);
  const [documentsUploadedRequired, setDocumentsUploadedRequired] = useState([]);
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();

  const form2InitialValues = {
    manpower_positions: [{}],
  };

  useEffect(() => {
    const getZonalList = async () => {
      const response = await getZonals(client);

      setZonals(response);
    };

    const getDivisionList = async () => {
      const response = await getDivisions(client);

      setDivisions(response);
    };

    const getQualificationList = async () => {
      const response = await getQualification(client);

      setQualifications(response);
    };

    const getTemporaryPositionsList = async () => {
      const response = await getTemporaryPositions(client);

      setPositions(response);
    };

    const getQualificationJobHistoryList = async () => {
      const response = await getQualificationJobHistory(client);

      setQualificationJobHistory(response);
    };

    const getInformationRequiredList = async () => {
      const response = await getInformationRequired(client);

      setInformationRequired(response);
    };

    const getDocumentsList = async () => {
      const response = await getDocuments(client);

      setRequiredDocuments(response);
    };

    if (user && user.isLoggedIn) {
      setToken(localStorage.getItem('token'));
      getZonalList();
      getDivisionList();
      getQualificationList();
      getTemporaryPositionsList();
      getQualificationJobHistoryList();
      getDocumentsList();
      getInformationRequiredList();
    }
  }, [user]);

  const onSubmitStep1 = (values) => {
    setStep1(false);
    setStep2(true);
  };

  const onSubmitStep2 = async (values) => {
    const formStep1Values = formStep1.getFieldsValue(true);
    const formRequest = {
      ...formStep1Values,
      publication_date: `${formStep1Values['publication_date'].format('YYYY-MM-DD')} 00:00:00`,
      end_date: `${formStep1Values['end_date'].format('YYYY-MM-DD')} 00:00:00`,
      dept_id: '4ce9df38-fc8c-42f8-b4a4-da2479105474',
      status: 'draft',
      job_type: 'Contract_Basis',
      // TODO: @pending from backend doc_file_path is missing in documents_required
      // documents_required: documentsUploadedRequired,
      documents_required: [],
      documents_uploaded: documentsUploaded,
      ...values,
    };

    const formResponse = await createJobPost(client, formRequest);

    if (formResponse.job_posting_id) {
      message.success(`Personal information updated successfully.`);
      router.push('/admin/manage-job-post/temporary/list/');
    }
  };

  const onSuccessDocumentsUploaded = (data) => {
    const newDocsUploaded = documentsUploaded;

    if (data.messege === 'File uploaded successfully') {
      message.success(`${data.doc_name} file uploaded successfully.`);
      newDocsUploaded.push({
        doc_id: data.doc_id,
        doc_file_path: data.doc_file_path,
        doc_name: data.doc_name,
      });
    }

    setDocumentsUploaded(newDocsUploaded);
  };

  const onSuccessDocumentsUploadedRequired = (data) => {
    const newDocsUploaded = documentsUploadedRequired;

    if (data.messege === 'File uploaded successfully') {
      message.success(`${data.doc_name} file uploaded successfully.`);
      newDocsUploaded.push({
        doc_id: data.doc_id,
        doc_file_path: data.doc_file_path,
        doc_name: data.doc_name,
      });
    }

    setDocumentsUploadedRequired(newDocsUploaded);
  };

  // Handler for pre fill position values
  const handleOnChangePosition = (value, key, name) => {
    const selectedPositionData = positions.filter((position) => position.temp_position_id === value);
    const fields = formStep2.getFieldsValue();
    const { manpower_positions } = fields;

    const selectedQualifications = selectedPositionData[0].temp_position_master.qualification.map(
      (qualification) => qualification.qualification_id
    );

    const selectedQualificationJobHistory = selectedPositionData[0].temp_position_master.qualification_job_history.map(
      (jobHistory) => jobHistory.qualification_job_id
    );

    const selectedDocumentsRequired = selectedPositionData[0].temp_position_master.documents_required.map(
      (documents) => documents.doc_id
    );

    const selectedInformationRequired = selectedPositionData[0].temp_position_master.information_required.map(
      (information) => information.info_id
    );

    manpower_positions[key].id = key;
    manpower_positions[key].position = selectedPositionData[0].temp_position_master.position_name;
    manpower_positions[key].max_age = selectedPositionData[0].temp_position_master.max_age;
    manpower_positions[key].min_age = selectedPositionData[0].temp_position_master.min_age;
    manpower_positions[key].extra_note = selectedPositionData[0].temp_position_master.qualification_desc;
    manpower_positions[key].grade = selectedPositionData[0].grade;
    manpower_positions[key].level = selectedPositionData[0].level;
    manpower_positions[key].qualification = selectedQualifications;
    manpower_positions[key].qualification_job_history = selectedQualificationJobHistory;
    manpower_positions[key].documents_required = selectedDocumentsRequired;
    manpower_positions[key].information_required = selectedInformationRequired;

    formStep2.setFieldsValue({ manpower_positions });
  };

  return (
    <>
      <Head>
        <title>Manage Job Post (P)</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            <FormStyles>
              <PageHeader>Add Admin Job Posting</PageHeader>
              {step1 && (
                <Box>
                  <Form
                    form={formStep1}
                    name='formStep1'
                    onFinish={onSubmitStep1}
                    initialValues={{}}
                    scrollToFirstError
                  >
                    <Row gutter={[16, 0]}>
                      <Col span={24}>
                        <Form.Item
                          name='notification_title'
                          label='Advertisement Title*'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Input Advertisement Title',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name='publication_date'
                          label='Start Date*'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Select Start Date',
                            },
                          ]}
                        >
                          <DatePicker format='YYYY/MM/DD' />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name='end_date'
                          label='End Date*'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Select End Date',
                            },
                          ]}
                        >
                          <DatePicker format='YYYY/MM/DD' />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name='zonal_lab_id'
                          label='Select Zone*'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Select Zone',
                            },
                          ]}
                        >
                          <Select placeholder='Please Select Zone'>
                            {zonals.map((zonal) => (
                              <Option key={zonal.zonal_lab_id} value={zonal.zonal_lab_id}>
                                {zonal.zonal_lab_name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name='division_id'
                          label='Select Division*'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Select Division',
                            },
                          ]}
                        >
                          <Select placeholder='Please Select Division'>
                            {divisions.map((division) => (
                              <Option key={division.division_id} value={division.division_id}>
                                {division.division_name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name='notification_id'
                          label='Notification ID'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Input Notification ID',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name='ad_approval_id'
                          label='Advertisement Approval ID'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Input Advertisement Approval ID',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name='documents_uploaded' label='Advertisement Document*' labelCol={{ span: 24 }}>
                          <Dragger
                            action={`${process.env.NEXT_PUBLIC_BASE_API_URL}/user/public/file_upload/?doc_type=job_docs`}
                            headers={{
                              authorization: `Token ${token}`,
                            }}
                            multiple
                            onSuccess={onSuccessDocumentsUploaded}
                          >
                            <p className='ant-upload-drag-icon'>
                              <InboxOutlined />
                            </p>
                            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                          </Dragger>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name='documents_required' label='Additional Documents*' labelCol={{ span: 24 }}>
                          <Dragger
                            action={`${process.env.NEXT_PUBLIC_BASE_API_URL}/user/public/file_upload/?doc_type=job_docs`}
                            headers={{
                              authorization: `Token ${token}`,
                            }}
                            multiple
                            onSuccess={onSuccessDocumentsUploadedRequired}
                          >
                            <p className='ant-upload-drag-icon'>
                              <InboxOutlined />
                            </p>
                            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                          </Dragger>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name='pre_ad_description'
                          label='Pre-Advertisement Description'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Input Pre-Advertisement Description',
                            },
                          ]}
                        >
                          <TextArea placeholder='textarea with clear icon' allowClear rows={4} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name='post_ad_description'
                          label='Post-Advertisement Description'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please Input Post-Advertisement Description',
                            },
                          ]}
                        >
                          <TextArea placeholder='textarea with clear icon' allowClear rows={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row justify='end'>
                      <Form.Item>
                        <Button type='primary' htmlType='submit'>
                          Save & Go to Manage Job Positions
                        </Button>
                      </Form.Item>
                    </Row>
                  </Form>
                </Box>
              )}
              {step2 && (
                <Form
                  form={formStep2}
                  name='formStep2'
                  onFinish={onSubmitStep2}
                  initialValues={form2InitialValues}
                  scrollToFirstError
                >
                  <Form.List name='manpower_positions'>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => {
                          return (
                            <Box key={key}>
                              <Row gutter={[16, 0]}>
                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'selectPosition']}
                                    fieldKey={[fieldKey, 'selectPosition']}
                                    label='Select Position Name'
                                    labelCol={{ span: 24 }}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please Select Position Name',
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder='Please select Position Name'
                                      onChange={(value) => handleOnChangePosition(value, fieldKey, name)}
                                    >
                                      {positions &&
                                        positions.map((position) => (
                                          <Option value={position.temp_position_id} key={position.temp_position_id}>
                                            {position.temp_position_master.position_name}
                                          </Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'position']}
                                    fieldKey={[fieldKey, 'position']}
                                    label='Position Display Name*'
                                    labelCol={{ span: 24 }}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please Input Position Display Name',
                                      },
                                    ]}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'documents_required']}
                                    fieldKey={[fieldKey, 'documents_required']}
                                    label='Required Documents'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Select placeholder='Select'>
                                      {requiredDocuments &&
                                        requiredDocuments.map((documentItem) => (
                                          <Option value={documentItem.doc_id} key={documentItem.doc_id}>
                                            {documentItem.doc_name}
                                          </Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'information_required']}
                                    fieldKey={[fieldKey, 'information_required']}
                                    label='Required Information'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Select placeholder='Select'>
                                      {informationRequired &&
                                        informationRequired.map((informationItem) => (
                                          <Option value={informationItem.info_id} key={informationItem.info_id}>
                                            {informationItem.info_name}
                                          </Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'min_age']}
                                    fieldKey={[fieldKey, 'min_age']}
                                    label='Minimum Age'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'max_age']}
                                    fieldKey={[fieldKey, 'max_age']}
                                    label='Maximum Age'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'grade']}
                                    fieldKey={[fieldKey, 'grade']}
                                    label='Grade'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'level']}
                                    fieldKey={[fieldKey, 'level']}
                                    label='Level'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'monthly_emolements']}
                                    fieldKey={[fieldKey, 'monthly_emolements']}
                                    label='Salary Amount'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'number_of_vacancies']}
                                    fieldKey={[fieldKey, 'number_of_vacancies']}
                                    label='Number of Vacancies'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={24}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'extra_note']}
                                    fieldKey={[fieldKey, 'extra_note']}
                                    label='Qualification Description'
                                    labelCol={{ span: 24 }}
                                  >
                                    <TextArea placeholder='textarea with clear icon' allowClear rows={4} />
                                  </Form.Item>
                                </Col>
                                <Col span={24}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'qualification']}
                                    fieldKey={[fieldKey, 'qualification']}
                                    label='Select Qualifications Degrees'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Select placeholder='Qualifications: Degrees' mode='multiple'>
                                      {qualifications &&
                                        qualifications.map((qualification) => (
                                          <Option
                                            value={qualification.qualification_id}
                                            key={qualification.qualification_id}
                                          >
                                            {qualification.qualification}
                                          </Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={24}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'qualification_job_history']}
                                    fieldKey={[fieldKey, 'qualification_job_history']}
                                    label='Select Qualifications Job History'
                                    labelCol={{ span: 24 }}
                                  >
                                    <Select placeholder='Qualifications: Job History' mode='multiple'>
                                      {qualificationJobHistory &&
                                        qualificationJobHistory.map((jobHistory) => (
                                          <Option
                                            value={jobHistory.qualification_job_id}
                                            key={jobHistory.qualification_job_id}
                                          >
                                            {jobHistory.qualification}
                                          </Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row align='middle' justify='end'>
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                  style={{
                                    marginRight: 8,
                                    color: palette('error', 0),
                                  }}
                                />
                                <Text type='danger' style={{ color: palette('error', 0) }}>
                                  Remove
                                </Text>
                              </Row>
                            </Box>
                          );
                        })}
                        <Form.Item>
                          <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Position
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  {/* <Box>
                    <Table
                      dataSource={dataSource}
                      columns={columns}
                      pagination={false}
                    />
                    <pre>
                      {JSON.stringify(formStep2.getFieldsValue(true), null, 2)}
                    </pre>
                  </Box> */}
                  <Row justify='end'>
                    <Form.Item>
                      <Button type='primary' htmlType='submit'>
                        Save
                      </Button>
                    </Form.Item>
                  </Row>
                </Form>
              )}
            </FormStyles>
          </ManageJobPostStyles>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default JobPostTemporaryAdd;
