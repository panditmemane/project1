import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Checkbox, Select, DatePicker, message, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import FormStyles from '../../../styled/Form.styles';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';

const Experience = ({ onNext, onPrevious }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialData, setInitialData] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isNoExperienceYet, setIsNoExperienceYet] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/user/public/applicant_experiences/${user.user_id}/`);

      setInitialData({
        ...(response.data.isEmpty && response.data.isEmpty === 'true'
          ? { past_employment_details: [] }
          : {
              past_employment_details: response.data.map((data) => ({
                ...data,
                employed_from: moment(data.employed_from),
                employed_to: moment(data.employed_to),
              })),
            }),
      });
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onSubmitForm = async (values) => {
    try {
      if (!isNoExperienceYet) {
        if (values.past_employment_details.length === 0) {
          message.error('Please fill experience details');
          return;
        }
        if (initialData.past_employment_details.length === 0) {
          await client.post(
            `/user/public/applicant_experience_create/${user.user_id}/`,
            values.past_employment_details.map((data) => ({
              ...data,
              employed_from: moment(data.employed_from).format('YYYY-MM-DD'),
              employed_to: moment(data.employed_to).format('YYYY-MM-DD'),
            }))
          );
          message.success(`Experience details added successfully.`);
        } else {
          await client.put(
            `/user/public/applicant_experience_update/${user.user_id}/`,
            values.past_employment_details.map((data) => ({
              ...data,
              employed_from: moment(data.employed_from).format('YYYY-MM-DD'),
              employed_to: moment(data.employed_to).format('YYYY-MM-DD'),
            }))
          );
          message.success(`Experience details updated successfully.`);
        }
      }
      onNext();
      setShowConfirm(false);
    } catch (error) {
      setShowConfirm(false);
    }
  };

  const onDeleteEmploymentDetails = async (index) => {
    const { getFieldsValue } = form;
    const data = getFieldsValue().past_employment_details[index];
    if (data && data.id) {
      await client.delete(`/user/public/applicant_experience_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Experience details deleted successfully.`);
  };

  const onNoExperienceYetChange = (e) => {
    setIsNoExperienceYet(e.target.checked);
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  if (!initialData) return null;

  return (
    <FormStyles>
      <Row gutter={[16, 0]}>
        <Col span={16}>
          <PageHeader>Experience Details</PageHeader>
        </Col>
        <Col span={8}>
          <Form.Item name='no_experience_yet' label='' labelCol={{ span: 24 }}>
            <Checkbox checked={isNoExperienceYet} onChange={onNoExperienceYetChange} style={{ lineHeight: '32px' }}>
              No Experience yet
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Box>
        <Form form={form} name='form' onFinish={onSubmitForm} initialValues={{ ...initialData }} scrollToFirstError>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Past Employment Details</PageHeader>
            </Col>
          </Row>

          <Form.List name='past_employment_details'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <>
                    <Row gutter={[16, 0]}>
                      <Form.Item {...field} name={[field.name, 'id']} fieldKey={[field.fieldKey, 'id']}>
                        <Input type='hidden' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label='Employer'
                        labelCol={{ span: 24 }}
                        name={[field.name, 'employer_name']}
                        fieldKey={[field.fieldKey, 'employer_name']}
                        rules={[
                          {
                            required: true,
                            message: "Employer name can't be empty",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Col span={10}>
                        <Form.Item
                          {...field}
                          label='Designation'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'post']}
                          fieldKey={[field.fieldKey, 'post']}
                          rules={[{ required: true, message: "Post can't be empty" }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label='Currently working'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'currently_working']}
                          fieldKey={[field.fieldKey, 'currently_working']}
                          valuePropName='checked'
                        >
                          <Checkbox style={{ lineHeight: '32px' }} />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label='Employed From'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'employed_from']}
                          fieldKey={[field.fieldKey, 'employed_from']}
                          rules={[{ required: true, message: 'Please select date' }]}
                        >
                          <DatePicker format='DD-MM-YYYY' disabledDate={(d) => !d || d.isAfter(moment())} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label='Employed To'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'employed_to']}
                          fieldKey={[field.fieldKey, 'employed_to']}
                          rules={[{ required: true, message: 'Please select date' }]}
                        >
                          <DatePicker format='DD-MM-YYYY' disabledDate={(d) => !d || d.isAfter(moment())} />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label='Employment Type'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'employment_type']}
                          fieldKey={[field.fieldKey, 'employment_type']}
                          rules={[
                            {
                              required: true,
                              message: 'Please select employment type',
                            },
                          ]}
                        >
                          <Select placeholder='Select Employment Type'>
                            <Option value='permanent'>Permanent</Option>
                            <Option value='temporary'>Temporary</Option>
                            <Option value='contract'>Contract</Option>
                            <Option value='payroll'>Payroll</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...field}
                          label='Salary'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'salary']}
                          fieldKey={[field.fieldKey, 'salary']}
                          rules={[
                            {
                              required: true,
                              message: "Salary can't be empty",
                            },
                            {
                              pattern: new RegExp(/^[0-9\b]+$/),
                              message: 'Salary must be numeric',
                            },
                          ]}
                        >
                          <Input type='tel' maxLength={8} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...field}
                          label='Grade'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'grade']}
                          fieldKey={[field.fieldKey, 'grade']}
                          rules={[
                            {
                              required: true,
                              message: "Grade to can't be empty",
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
                            onDeleteEmploymentDetails(index);
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
                  <Button
                    disabled={isNoExperienceYet}
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Past Employment Details
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
                <Button type='primary' htmlType='submit' disabled={isNoExperienceYet}>
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

Experience.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default Experience;
