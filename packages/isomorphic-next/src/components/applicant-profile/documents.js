import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Upload, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import FormStyles from '../../../styled/Form.styles';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';

const Documents = ({ onNext, onPrevious }) => {
  const [form] = Form.useForm();
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialData, setInitialData] = useState({ documents: [{}] });
  const [documents, setDocuments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/document/doc_list/`);
      console.log(response.data);
      // setInitialData({
      //   ...(response.data.isEmpty && response.data.isEmpty === "true"
      //     ? { documents_attachments: [] }
      //     : { documents_attachments: response.data }),
      // });
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onSubmitForm = async (values) => {
    try {
      console.log('Received values of form: ', values);
      onNext();
      setShowConfirm(false);
    } catch (error) {
      setShowConfirm(false);
    }
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  if (!initialData) return null;

  return (
    <FormStyles>
      <PageHeader>Documents Attachments</PageHeader>
      <Box>
        <Form form={form} name='form' onFinish={onSubmitForm} initialValues={{ ...initialData }} scrollToFirstError>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Documents List</PageHeader>
            </Col>
          </Row>
          <Form.List name='documents_attachments'>
            {(fields, { add, remove }) => (
              <>
                {' '}
                {fields.map((field, index) => (
                  <>
                    <Row gutter={[16, 0]}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label='Document Title'
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
                          rules={[{ required: true, message: 'Please upload' }]}
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

                      <Col span={4}>
                        <Space>
                          <PlusOutlined onClick={() => add()} />
                          {fields.length > 1 && <DeleteOutlined onClick={() => remove(field.name)} />}
                        </Space>
                      </Col>
                    </Row>
                  </>
                ))}
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

Documents.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default Documents;
