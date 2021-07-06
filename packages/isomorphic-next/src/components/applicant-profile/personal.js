import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
  Radio,
  Checkbox,
  Space,
  Popconfirm,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import FormStyles from '../../../styled/Form.styles';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';
import moment from 'moment';

const Personal = ({ onNext }) => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialData, setInitialData] = useState();
  const [personalForm] = Form.useForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const { Option } = Select;
  const { Dragger } = Upload;

  const onDocumentUpload = (info) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/user/public/personal_info/${user.user_id}/`);
      setInitialData(response.data);
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onSubmitForm = async (values) => {
    try {
      if (initialData.isEmpty === 'true') {
        await client.post(`/user/public/personal_info_create/${user.user_id}/`, {
          user_id: user.user_id,
          ...values,
          date_of_birth: moment(values.date_of_birth).format('YYYY-MM-DD'),
          passport_expiry: moment(values.passport_expiry).format('YYYY-MM-DD'),
        });
        message.success(`Personal information added successfully.`);
      } else {
        await client.put(`/user/public/personal_info_update/${user.user_id}/`, {
          user_id: user.user_id,
          ...values,
          date_of_birth: moment(values.date_of_birth).format('YYYY-MM-DD'),
          passport_expiry: moment(values.passport_expiry).format('YYYY-MM-DD'),
          date_of_birth_in_words: 'inword',
          status: 'Inporgress',
        });
        message.success(`Personal information updated successfully.`);
      }
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
      <PageHeader>Personal Information</PageHeader>
      <Box>
        <Form
          form={personalForm}
          name='personalForm'
          onFinish={onSubmitForm}
          initialValues={
            !initialData.isEmpty
              ? {
                  ...initialData,
                  date_of_birth: moment(initialData.date_of_birth),
                  passport_expiry: moment(initialData.passport_expiry),
                }
              : { ...initialData }
          }
          scrollToFirstError
        >
          <Row gutter={[16, 0]}>
            <Col span={18}>
              <Row gutter={[16, 0]}>
                <Col span={8}>
                  <Form.Item
                    name='first_name'
                    label='First Name'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter first name',
                      },
                      {
                        max: 50,
                        message: 'First name should not be greater then 50 characters',
                      },
                    ]}
                  >
                    <Input maxLength={50} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='middle_name'
                    label='Middle Name'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter middle name',
                      },
                      {
                        max: 50,
                        message: 'Middle name should not be greater then 50 characters',
                      },
                    ]}
                  >
                    <Input maxLength={50} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='last_name'
                    label='Last Name'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter last name',
                      },
                      {
                        max: 50,
                        message: 'Last name should not be greater then 50 characters',
                      },
                    ]}
                  >
                    <Input maxLength={50} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='gender'
                    label='Gender'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select gender',
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value='male'>Male</Radio>
                      <Radio value='female'>Female</Radio>
                      <Radio value='others'>Others</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='date_of_birth'
                    label='Date of Birth'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please Select date of birth',
                      },
                    ]}
                  >
                    <DatePicker format='DD-MM-YYYY' disabledDate={(d) => !d || d.isAfter(moment())} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='place_of_birth'
                    label='Place of birth'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter place of birth',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='mobile_no'
                    label='Mobile Number'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter mobile number',
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='whatsapp_id' label='Whatsapp Id/No.' labelCol={{ span: 24 }}>
                    <Input type='number' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='skype_id' label='Skype Id' labelCol={{ span: 24 }}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='passport_number'
                    label='Passport Number'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter passport number',
                      },
                      {
                        min: 8,
                        message: 'Passport number length should be of 8 characters',
                      },
                      {
                        max: 8,
                        message: 'Passport number length should be of 8 characters',
                      },
                    ]}
                  >
                    <Input maxLength={8} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='passport_expiry'
                    label='Passport Expiry Date'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select passport expiry date',
                      },
                    ]}
                  >
                    <DatePicker format='DD-MM-YYYY' disabledDate={(d) => !d || d.isBefore(moment())} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='fax_number' label='Fax Number' labelCol={{ span: 24 }}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='father_name'
                    label="Father's Full Name"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter Father name',
                      },
                    ]}
                  >
                    <Input maxLength={50} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='father_occupation' label="Father's Occupation" labelCol={{ span: 24 }}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='is_indian_citizen'
                    valuePropName='checked'
                    label='Are You Indian Citizen'
                    labelCol={{ span: 24 }}
                  >
                    <Checkbox style={{ lineHeight: '32px' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='religion'
                    label='Religion'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter religion',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='caste'
                    label='Caste'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select caste',
                      },
                    ]}
                  >
                    <Select placeholder='Select Caste'>
                      <Option value='sc'>SC</Option>
                      <Option value='st'>ST</Option>
                      <Option value='obc'>OBC</Option>
                      <Option value='gen'>GEN</Option>
                      <Option value='pwd'>PWD</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='relaxation_category'
                    label='Relaxation Category'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select Category',
                      },
                    ]}
                  >
                    <Select placeholder='Select Category'>
                      {/* <Option value='sc'>SC</Option>
                      <Option value='st'>ST</Option>
                      <Option value='obc'>OBC</Option>
                      <Option value='gen'>GEN</Option>
                      <Option value='pwd'>PWD</Option> */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Form.Item name='profile_photo' label='Take Profile Picture' labelCol={{ span: 24 }}>
                <Dragger onChange={onDocumentUpload}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
          <Row justify='end'>
            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Save
                </Button>
                <Button type='primary' htmlType='button' onClick={() => personalForm.resetFields()}>
                  Reset
                </Button>
                <Popconfirm
                  title='Do you need to save the data?'
                  okText='Yes'
                  cancelText='No'
                  visible={showConfirm}
                  onConfirm={() => personalForm.submit()}
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

Personal.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Personal;
