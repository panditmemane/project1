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
  const [initialData, setInitialData] = useState();
  const [documents, setDocuments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/user/public/documents/${user.user_id}/`);
      setInitialData({
        ...(response.data.length === 0 ? { documents_attachments: [{}] } : { documents_attachments: response.data }),
      });
      if (!response.data.isEmpty && response.data.isEmpty !== 'true') {
        setDocuments(response.data.map((res) => ({ doc_id: res.doc_id, doc_file_path: res.doc_file_path })));
      }
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onSubmitForm = async (values) => {
    try {
      await client.post(
        `/user/public/documents/${user.user_id}/`,
        values.documents_attachments.map((data, index) => ({
          doc_id: documents[index].doc_id,
          doc_name: data.doc_name,
          doc_file_path: documents[index].doc_file_path,
        }))
      );
      message.success(`Published paper details added successfully.`);
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

  console.log(initialData);

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
                    <Form.Item {...field} name={[field.name, 'id']} fieldKey={[field.fieldKey, 'id']}>
                      <Input type='hidden' />
                    </Form.Item>
                    <Row gutter={[16, 0]}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label='Document Title'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'doc_name']}
                          fieldKey={[field.fieldKey, 'doc_name']}
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
                          name={[field.name, 'doc_file_path']}
                          fieldKey={[field.fieldKey, 'doc_file_path']}
                          rules={[{ required: true, message: 'Please upload' }]}
                        >
                          <Upload
                            listType='file'
                            showUploadList={false}
                            action={`${process.env.NEXT_PUBLIC_BASE_API_URL}/user/public/file_upload/?doc_type=applicant&user_id=${user.user_id}`}
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
                              newDocs[index] = { doc_id: data.doc_id, doc_file_path: data.doc_file_path };
                              setDocuments(newDocs);
                            }}
                          >
                            <Button icon={<UploadOutlined />}>
                              {documents[index]
                                ? documents[index].doc_file_path.split('/')[
                                    documents[index].doc_file_path.split('/').length - 1
                                  ]
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
