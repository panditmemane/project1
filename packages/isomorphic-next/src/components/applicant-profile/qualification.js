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
  const [form] = Form.useForm();
  const { Option } = Select;
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialData, setInitialData] = useState();
  const [documents, setDocuments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const responseQualifications = await client.get(`/user/public/applicant_qualifications/${user.user_id}/`);
      const responsePapers = await client.get(`/user/public/published_papers/${user.user_id}/`);
      const responseTrainings = await client.get(`/user/public/professional_trainings/${user.user_id}/`);

      if (!responsePapers.data.isEmpty && responsePapers.data.isEmpty !== 'true') {
        const documents = responsePapers.data.map((doc) => doc.attachments);
        setDocuments(documents);
      }

      setInitialData({
        ...(responseQualifications.data.isEmpty && responseQualifications.data.isEmpty === 'true'
          ? { education_details: [] }
          : { education_details: responseQualifications.data }),
        ...(responsePapers.data.isEmpty && responsePapers.data.isEmpty === 'true'
          ? { published_paper: [] }
          : { published_paper: responsePapers.data }),
        ...(responseTrainings.data.isEmpty && responseTrainings.data.isEmpty === 'true'
          ? { professional_training: [] }
          : {
              professional_training: responseTrainings.data.map((data) => ({
                ...data,
                from_date: moment(data.from_date),
                to_date: moment(data.to_date),
              })),
            }),
      });
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onSubmitForm = async (values) => {
    try {
      if (
        values.education_details.length === 0 ||
        values.professional_training.length === 0 ||
        values.published_paper.length === 0
      ) {
        message.error('Please fill all details');
        return;
      }
      if (initialData.education_details.length === 0) {
        await client.post(`/user/public/applicant_qualification_create/${user.user_id}/`, values.education_details);
        message.success(`Qualification details added successfully.`);
      } else {
        await client.put(`/user/public/applicant_qualification_update/${user.user_id}/`, values.education_details);
        message.success(`Qualification details updated successfully.`);
      }
      if (initialData.professional_training.length === 0) {
        await client.post(
          `/user/public/professional_training_create/${user.user_id}/`,
          values.professional_training.map((data) => ({
            ...data,
            from_date: moment(data.from_date).format('YYYY-MM-DD'),
            to_date: moment(data.to_date).format('YYYY-MM-DD'),
          }))
        );
        message.success(`Professional training details added successfully.`);
      } else {
        await client.put(
          `/user/public/professional_training_update/${user.user_id}/`,
          values.professional_training.map((data) => ({
            ...data,
            from_date: moment(data.from_date).format('YYYY-MM-DD'),
            to_date: moment(data.to_date).format('YYYY-MM-DD'),
          }))
        );
        message.success(`Professional training details updated successfully.`);
      }
      if (initialData.published_paper.length === 0) {
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
            id: initialData.published_paper[index].id,
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
      onNext();
      setShowConfirm(false);
    } catch (error) {
      setShowConfirm(false);
    }
  };

  const onDeleteEducationalDetails = async (index) => {
    const { getFieldsValue } = form;
    const data = getFieldsValue().education_details[index];
    if (data && data.id) {
      await client.delete(`/user/public/applicant_qualification_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onDeleteProfessionalTraining = async (index) => {
    const { getFieldsValue } = form;
    const data = getFieldsValue().professional_training[index];
    if (data && data.id) {
      await client.delete(`/user/public/professional_training_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onDeletePaper = async (index) => {
    const { getFieldsValue } = form;
    const data = getFieldsValue().professional_training[index];
    if (data && data.id) {
      await client.delete(`/user/public/published_paper_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  if (!initialData) return null;

  return (
    <FormStyles>
      <PageHeader>Technical Qualification Details</PageHeader>
      <Box>
        <Form form={form} name='form' onFinish={onSubmitForm} initialValues={{ ...initialData }} scrollToFirstError>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Education Details</PageHeader>
            </Col>
          </Row>

          <Form.List name='education_details'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <>
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
                          <Select placeholder='Select Examination'>
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
                          label='College Name'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'college_name']}
                          fieldKey={[field.fieldKey, 'college_name']}
                          rules={[
                            {
                              required: true,
                              message: "College name can't be empty",
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
                          rules={[{ required: true, message: 'Please enter Score' }]}
                        >
                          <Input />
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
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Education Details
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Professional Training</PageHeader>
            </Col>
          </Row>

          <Form.List name='professional_training'>
            {(fields, { add, remove }) => (
              <>
                {' '}
                {fields.map((field, index) => (
                  <>
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
                          label='From'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'from_date']}
                          fieldKey={[field.fieldKey, 'from_date']}
                          rules={[
                            {
                              required: true,
                              message: 'Please select from date',
                            },
                          ]}
                        >
                          <DatePicker format='DD-MM-YYYY' />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='To'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'to_date']}
                          fieldKey={[field.fieldKey, 'to_date']}
                          rules={[
                            {
                              required: true,
                              message: 'Please select to date',
                            },
                          ]}
                        >
                          <DatePicker format='DD-MM-YYYY' />
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
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Professional Training
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Published Paper</PageHeader>
            </Col>
          </Row>
          <Form.List name='published_paper'>
            {(fields, { add, remove }) => (
              <>
                {' '}
                {fields.map((field, index) => (
                  <>
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
                              //setDocuments(data);
                              const newDocs = [...documents];
                              newDocs[index] = [
                                {
                                  doc_id: data.doc_id,
                                  doc_file_path: data.doc_file_path,
                                  doc_name: data.doc_name,
                                },
                              ];

                              console.log('newDocs', { ...newDocs });
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
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Published Paper
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row justify='end'>
            <Form.Item>
              <Space>
                <Button type='primary' htmlType='button' onClick={onPrevious}>
                  Previous
                </Button>
                <Button type='primary' htmlType='submit'>
                  Save
                </Button>
                <Button type='primary' htmlType='button' onClick={() => form.resetFields()}>
                  Reset
                </Button>
                <Popconfirm
                  title='Do you need to save the data?'
                  okText='Yes'
                  cancelText='No'
                  visible={showConfirm}
                  onConfirm={() => form.submit()}
                  onCancel={onNext}
                >
                  <Button type='primary' htmlType='button' onClick={() => setShowConfirm(true)}>
                    Next
                  </Button>
                </Popconfirm>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </Box>
    </FormStyles>
  );
};

Qualification.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default Qualification;
