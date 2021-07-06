import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, DatePicker, Select, Upload, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Box from '@iso/components/utility/box';
import moment from 'moment';
import PageHeader from '@iso/components/utility/pageHeader';
import FormStyles from '../../../styled/Form.styles';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';

const Qualification = ({ onNext, onPrevious }) => {
  const [formEducation] = Form.useForm();
  const [formProfessionalTraining] = Form.useForm();
  const [formPublishedPaper] = Form.useForm();

  const { Option } = Select;
  const { client } = useAuthState();
  const { user } = useUser({});
  const [documents, setDocuments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [initialEducationData, setinitialEducationData] = useState();
  const [initialProfessionalTraining, setinitialProfessionalTraining] = useState();
  const [initialPublishedPaper, setinitialPublishedPaper] = useState();

  const [isEducationDataSubmitted, setEducationDataSubmitted] = useState();
  const [isProfessionalTrainingSubmitted, setProfessionalTrainingSubmitted] = useState();
  const [isPublishedPaperSubmitted, setPublishedPaperSubmitted] = useState();
  const [showEducationSave, setShowEducationSave] = useState(true);

  useEffect(() => {
    const load = async () => {
      const responseQualifications = await client.get(`/user/public/applicant_qualifications/${user.user_id}/`);
      const responsePapers = await client.get(`/user/public/published_papers/${user.user_id}/`);
      const responseTrainings = await client.get(`/user/public/professional_trainings/${user.user_id}/`);

      if (!responsePapers.data.isEmpty && responsePapers.data.isEmpty !== 'true') {
        const documents = responsePapers.data.map((doc) => doc.attachments);
        setDocuments(documents);
      }

      setinitialEducationData({
        ...(responseQualifications.data.isEmpty && responseQualifications.data.isEmpty === 'true'
          ? { education_details: [] }
          : { education_details: responseQualifications.data }),
      });

      setinitialProfessionalTraining({
        ...(responseTrainings.data.isEmpty && responseTrainings.data.isEmpty === 'true'
          ? { professional_training: [] }
          : {
              professional_training: responseTrainings.data.map((data) => ({
                ...data,
                from_date: moment(data.from_date),
                to_date: moment(data.to_date),
                training_period: [moment(data.from_date), moment(data.to_date)],
              })),
            }),
      });

      setinitialPublishedPaper({
        ...(responsePapers.data.isEmpty && responsePapers.data.isEmpty === 'true'
          ? { published_paper: [] }
          : { published_paper: responsePapers.data }),
      });

      setinitialPublishedPaper({
        ...(responsePapers.data.isEmpty && responsePapers.data.isEmpty === 'true'
          ? { published_paper: [] }
          : { published_paper: responsePapers.data }),
      });

      setinitialPublishedPaper({
        ...(responsePapers.data.isEmpty && responsePapers.data.isEmpty === 'true'
          ? { published_paper: [] }
          : { published_paper: responsePapers.data }),
      });
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onNextSubmit = async () => {
    setShowConfirm(false);

    if (
      formEducation.isFieldsTouched() &&
      formEducation.getFieldsValue().education_details &&
      formEducation.getFieldsValue().education_details.length > 0
    ) {
      await formEducation
        .validateFields()
        .then(() => formEducation.submit())
        .catch((x) => {
          message.error('Please fill education details');
          throw x;
        });
    }
    if (
      formProfessionalTraining.isFieldsTouched() &&
      formProfessionalTraining.getFieldsValue().professional_training &&
      formProfessionalTraining.getFieldsValue().professional_training.length > 0
    ) {
      await formProfessionalTraining
        .validateFields()
        .then(() => formProfessionalTraining.submit())
        .catch((x) => {
          message.error('Please fill professional details');
          throw x;
        });
    }
    if (
      formPublishedPaper.isFieldsTouched() &&
      formPublishedPaper.getFieldsValue().published_paper &&
      formPublishedPaper.getFieldsValue().published_paper.length > 0
    ) {
      await formPublishedPaper
        .validateFields()
        .then(() => formPublishedPaper.submit())
        .catch((x) => {
          message.error('Please fill published paper details');
          throw x;
        });
    }

    if (
      !formEducation.getFieldsValue().education_details ||
      formEducation.getFieldsValue().education_details.length === 0
    ) {
      message.error('Please add education details');
      return;
    }
    if (
      !formProfessionalTraining.getFieldsValue().professional_training ||
      formProfessionalTraining.getFieldsValue().professional_training.length === 0
    ) {
      message.error('Please add professional training details');
      return;
    }
    if (
      !formPublishedPaper.getFieldsValue().published_paper ||
      formPublishedPaper.getFieldsValue().published_paper.length === 0
    ) {
      message.error('Please add published paper details');
      return;
    }
    onNext();
  };

  const onSubmitEducationForm = async (values) => {
    if (!isEducationDataSubmitted || formEducation.isFieldsTouched()) {
      if (initialEducationData.education_details.length === 0) {
        await client.post(`/user/public/applicant_qualification_create/${user.user_id}/`, values.education_details);
        message.success(`Qualification details added successfully.`);
      } else {
        const updateData = values.education_details.filter((dt) => !!dt.id);
        const createData = values.education_details.filter((dt) => !dt.id);
        if (updateData.length > 0) {
          await client.put(`/user/public/applicant_qualification_update/${user.user_id}/`, updateData);
        }
        if (createData.length > 0) {
          await client.post(`/user/public/applicant_qualification_create/${user.user_id}/`, createData);
        }
        message.success(`Qualification details updated successfully.`);
      }
      setEducationDataSubmitted(true);
    }
  };

  const onSubmitProfessionalTraining = async (values) => {
    if (!isProfessionalTrainingSubmitted || formProfessionalTraining.isFieldsTouched()) {
      if (initialProfessionalTraining.professional_training.length === 0) {
        await client.post(
          `/user/public/professional_training_create/${user.user_id}/`,
          values.professional_training.map((data) => ({
            ...data,
            from_date: moment(data.training_period[0]).format('YYYY-MM-DD'),
            to_date: moment(data.training_period[1]).format('YYYY-MM-DD'),
          }))
        );
        message.success(`Professional training details added successfully.`);
      } else {
        const updateData = values.professional_training.filter((dt) => !!dt.id);
        const createData = values.professional_training.filter((dt) => !dt.id);
        if (updateData.length > 0) {
          await client.put(
            `/user/public/professional_training_update/${user.user_id}/`,
            updateData.map((data) => ({
              ...data,
              from_date: moment(data.training_period[0]).format('YYYY-MM-DD'),
              to_date: moment(data.training_period[1]).format('YYYY-MM-DD'),
            }))
          );
        }
        if (createData.length > 0) {
          await client.post(
            `/user/public/professional_training_create/${user.user_id}/`,
            createData.map((data) => ({
              ...data,
              from_date: moment(data.training_period[0]).format('YYYY-MM-DD'),
              to_date: moment(data.training_period[1]).format('YYYY-MM-DD'),
            }))
          );
        }
        message.success(`Professional training details updated successfully.`);
      }
      setProfessionalTrainingSubmitted(true);
    }
  };

  const onSubmitPublishedPaper = async (values) => {
    if (!isPublishedPaperSubmitted || formPublishedPaper.isFieldsTouched()) {
      if (initialPublishedPaper.published_paper.length === 0) {
        await client.post(
          `/user/public/published_paper_create/${user.user_id}/`,
          values.published_paper.map((data, index) => ({
            paper_title: data.paper_title,
            attachments: [
              {
                doc_id: documents[index][0].doc_id,
                doc_file_path: documents[index][0].doc_file_path,
                doc_name: documents[index][0].doc_name,
              },
            ],
          }))
        );
        message.success(`Published paper details added successfully.`);
      } else {
        await client.put(
          `/user/public/published_paper_update/${user.user_id}/`,
          values.published_paper.map((data, index) => ({
            id: initialPublishedPaper.published_paper[index].id,
            paper_title: data.paper_title,
            attachments: [
              {
                doc_id: documents[index][0].doc_id,
                doc_file_path: documents[index][0].doc_file_path,
                doc_name: documents[index][0].doc_name,
              },
            ],
          }))
        );
        message.success(`Published paper details updated successfully.`);
      }
      setPublishedPaperSubmitted(true);
    }
  };

  const onDeleteEducationalDetails = async (index) => {
    const { getFieldsValue } = formEducation;
    const data = getFieldsValue().education_details[index];
    if (data && data.id) {
      await client.delete(`/user/public/applicant_qualification_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onDeleteProfessionalTraining = async (index) => {
    const { getFieldsValue } = formProfessionalTraining;
    const data = getFieldsValue().professional_training[index];
    if (data && data.id) {
      await client.delete(`/user/public/professional_training_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onDeletePaper = async (index) => {
    const { getFieldsValue } = formPublishedPaper;
    const data = getFieldsValue().published_paper[index];
    if (data && data.id) {
      await client.delete(`/user/public/published_paper_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onChange = (value, key) => {
    const fields = formEducation.getFieldsValue();
    const { education_details } = fields;
    Object.assign(education_details[key], { specialization: value === 'ssc' ? 'NA' : undefined });
    formEducation.setFieldsValue({ education_details });
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  if (!initialEducationData || !initialProfessionalTraining || !initialPublishedPaper) return null;

  return (
    <FormStyles>
      <PageHeader>Technical Qualification Details</PageHeader>
      <>
        <>
          <Box>
            <Form
              form={formEducation}
              name='formEducation'
              onFinish={onSubmitEducationForm}
              initialValues={{ ...initialEducationData }}
              scrollToFirstError
            >
              <Row gutter={[16, 0]}>
                <Col span={16}>
                  <h3>Education Details</h3>
                </Col>
              </Row>

              <Form.List name='education_details'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Box>
                        <Row gutter={[16, 0]}>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              label='Exam. Name'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'exam_name']}
                              fieldKey={[field.fieldKey, 'exam_name']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Exam name must be selected',
                                },
                              ]}
                            >
                              <Select placeholder='Select Examination' onChange={(e) => onChange(e, field.key)}>
                                <Option value='ssc'>SSC/10</Option>
                                <Option value='hsc'>HSC/12</Option>
                                <Option value='graduation'>Graduation</Option>
                                <Option value='postgraduation'>Post Graduation</Option>
                                <Option value='phd'>P.H.D</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              label='University'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'university']}
                              fieldKey={[field.fieldKey, 'university']}
                              rules={[
                                {
                                  required: true,
                                  message: "University can't be empty",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              label='Institute Name'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'college_name']}
                              fieldKey={[field.fieldKey, 'college_name']}
                              rules={[
                                {
                                  required: true,
                                  message: "Institute name can't be empty",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...field}
                              label='Passing Year'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'passing_year']}
                              fieldKey={[field.fieldKey, 'passing_year']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter passing year',
                                },
                                {
                                  pattern: new RegExp(/^[0-9\b]+$/),
                                  message: 'Passing year must be numeric',
                                },
                              ]}
                            >
                              <Input type='tel' maxLength={4} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...field}
                              label='Score'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'score']}
                              fieldKey={[field.fieldKey, 'score']}
                              rules={[
                                { required: true, message: 'Please enter Score' },
                                {
                                  pattern: new RegExp(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                                  message: 'Please enter valid score',
                                },
                                {
                                  pattern: new RegExp(/^(\d{0,2}(\.\d{1,2})?|100(\.00?)?)$/),
                                  message: 'Score must be between 0 to 100',
                                },
                              ]}
                            >
                              <Input min={0} max={100} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...field}
                              label='Score Unit'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'score_unit']}
                              fieldKey={[field.fieldKey, 'score_unit']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Score unit must be selected',
                                },
                              ]}
                            >
                              <Select placeholder='Select Examination'>
                                <Option value='%'>%</Option>
                                <Option value='division'>Division</Option>
                                <Option value='class'>Class</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              label='Specialization'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'specialization']}
                              fieldKey={[field.fieldKey, 'specialization']}
                              rules={[
                                {
                                  required: true,
                                  message: "specialization can't be empty",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={[16, 0]} mb={5} justify='end' style={{ marginBottom: '25px' }}>
                          <Col>
                            <Button
                              type='danger'
                              htmlType='button'
                              onClick={() => {
                                onDeleteEducationalDetails(index);
                                remove(field.name);
                              }}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                        {index === fields.length - 1 && (
                          <Row justify='end'>
                            <Form.Item>
                              <Space>
                                <Button type='primary' htmlType='submit'>
                                  Save
                                </Button>
                                <Button type='primary' htmlType='button' onClick={() => formEducation.resetFields()}>
                                  Reset
                                </Button>
                              </Space>
                            </Form.Item>
                          </Row>
                        )}
                      </Box>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Education Details
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </Box>
          <Box>
            <Form
              form={formProfessionalTraining}
              name='formProfessionalTraining'
              onFinish={onSubmitProfessionalTraining}
              initialValues={{ ...initialProfessionalTraining }}
              scrollToFirstError
            >
              <Box>
                <Row gutter={[16, 0]}>
                  <Col span={16}>
                    <h3>Professional Training</h3>
                  </Col>
                </Row>

                <Form.List name='professional_training'>
                  {(fields, { add, remove }) => (
                    <>
                      {' '}
                      {fields.map((field, index) => (
                        <Box>
                          <Row gutter={[16, 0]}>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label='Title'
                                labelCol={{ span: 24 }}
                                name={[field.name, 'title']}
                                fieldKey={[field.fieldKey, 'title']}
                                rules={[{ required: true, message: 'Please enter title' }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                label='From - To'
                                labelCol={{ span: 24 }}
                                name={[field.name, 'training_period']}
                                fieldKey={[field.fieldKey, 'training_period']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please select dates',
                                  },
                                ]}
                              >
                                <DatePicker.RangePicker format='DD-MM-YYYY' renderExtraFooter={() => 'extra footer'} />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label='Description'
                                labelCol={{ span: 24 }}
                                name={[field.name, 'description']}
                                fieldKey={[field.fieldKey, 'description']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter description',
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={[16, 0]} justify='end' style={{ marginBottom: '25px' }}>
                            <Col>
                              <Button
                                type='danger'
                                htmlType='button'
                                onClick={() => {
                                  onDeleteProfessionalTraining(index);
                                  remove(field.name);
                                }}
                              >
                                Delete
                              </Button>
                            </Col>
                          </Row>
                          {index === fields.length - 1 && (
                            <Row justify='end'>
                              <Form.Item>
                                <Space>
                                  <Button type='primary' htmlType='submit'>
                                    Save
                                  </Button>
                                  <Button
                                    type='primary'
                                    htmlType='button'
                                    onClick={() => formProfessionalTraining.resetFields()}
                                  >
                                    Reset
                                  </Button>
                                </Space>
                              </Form.Item>
                            </Row>
                          )}
                        </Box>
                      ))}
                      <Form.Item>
                        <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Professional Training
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Box>
            </Form>
          </Box>{' '}
          <Box>
            <Form
              form={formPublishedPaper}
              name='formPublishedPaper'
              onFinish={onSubmitPublishedPaper}
              initialValues={{ ...initialPublishedPaper }}
              scrollToFirstError
            >
              <Row gutter={[16, 0]}>
                <Col span={16}>
                  <h3>Published Paper</h3>
                </Col>
              </Row>
              <Form.List name='published_paper'>
                {(fields, { add, remove }) => (
                  <>
                    {' '}
                    {fields.map((field, index) => (
                      <Box>
                        <Row gutter={[16, 0]}>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              label='Paper Title'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'paper_title']}
                              fieldKey={[field.fieldKey, 'paper_title']}
                              rules={[{ required: true, message: 'Please enter title' }]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              label='File'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'published_file']}
                              fieldKey={[field.fieldKey, 'published_file']}
                              //getValueFromEvent={normFile}
                              //valuePropName='fileList'
                              //rules={[{ required: true, message: "Please upload" }]}
                            >
                              <Upload
                                listType='file'
                                showUploadList={false}
                                action={`${process.env.NEXT_PUBLIC_BASE_API_URL}/user/public/file_upload/?doc_type=paper_attachment&user_id=${user.user_id}`}
                                headers={{
                                  authorization: `Token ${localStorage.getItem('token')}`,
                                }}
                                onChange={(info) => {
                                  if (info.file.status !== 'uploading') {
                                    //console.log(info.file, info.fileList);
                                  }
                                  if (info.file.status === 'done') {
                                    message.success(`${info.file.name} file uploaded successfully`);
                                  } else if (info.file.status === 'error') {
                                    message.error(`${info.file.name} file upload failed.`);
                                  }
                                }}
                                onSuccess={(data) => {
                                  const newDocs = [...documents];
                                  newDocs[index] = [
                                    {
                                      doc_id: data.doc_id,
                                      doc_file_path: data.doc_file_path,
                                      doc_name: data.doc_name,
                                    },
                                  ];
                                  setDocuments(newDocs);
                                }}
                              >
                                <Button icon={<UploadOutlined />}>
                                  {' '}
                                  {documents[index] && documents[index][0]?.doc_name
                                    ? documents[index][0].doc_name
                                    : 'Upload File'}{' '}
                                </Button>
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={[16, 0]} justify='end' style={{ marginBottom: '25px' }}>
                          <Col>
                            <Button
                              type='danger'
                              htmlType='button'
                              onClick={() => {
                                onDeletePaper(index);
                                remove(field.name);
                              }}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                        {index === fields.length - 1 && (
                          <Row justify='end'>
                            <Form.Item>
                              <Space>
                                <Button type='primary' htmlType='submit'>
                                  Save
                                </Button>
                                <Button
                                  type='primary'
                                  htmlType='button'
                                  onClick={() => formPublishedPaper.resetFields()}
                                >
                                  Reset
                                </Button>
                              </Space>
                            </Form.Item>
                          </Row>
                        )}
                      </Box>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Published Paper
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </Box>
          <Row justify='end'>
            <Form.Item>
              <Space>
                <Button type='primary' htmlType='button' onClick={onPrevious}>
                  Previous
                </Button>

                <Popconfirm
                  title='Do you need to save the data?'
                  okText='Yes'
                  cancelText='No'
                  visible={showConfirm}
                  onConfirm={onNextSubmit}
                  onCancel={onNext}
                >
                  <Button type='primary' htmlType='button' onClick={() => setShowConfirm(true)}>
                    Next
                  </Button>
                </Popconfirm>
              </Space>
            </Form.Item>
          </Row>
        </>
      </>
    </FormStyles>
  );
};

Qualification.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default Qualification;
