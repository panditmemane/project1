import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Select, message, Checkbox, Space, Popconfirm } from 'antd';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import FormStyles from '../../../styled/Form.styles';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';
import {
  mapAddressGetData,
  mapLocalAddressPostData,
  mapFatherAddressPostData,
  mapPermanentAddressPostData,
} from './helpers';

const Address = ({ onNext, onPrevious }) => {
  const [form] = Form.useForm();
  const { getFieldProps, getFieldError, getFieldValue, validateFields } = form;
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialData, setInitialData] = useState();
  const { Option } = Select;
  const [isPermAddressSame, setIsPermAddressSame] = useState(false);
  const [isFatherAddressSameAsPermAddress, setIsFatherAddressSameAsPermAddress] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const responseFatherAddress = await client.get(
        `/user/public/applicant_address/${user.user_id}/?address_type=father_address`
      );
      const responseLocalAddress = await client.get(
        `/user/public/applicant_address/${user.user_id}/?address_type=local_address`
      );
      const responsePermanentAddress = await client.get(
        `/user/public/applicant_address/${user.user_id}/?address_type=permanent_address`
      );

      setIsPermAddressSame(responseLocalAddress.data.is_permenant_address_same_as_local);
      setIsFatherAddressSameAsPermAddress(responseLocalAddress.data.is_father_address_same_as_local);
      setInitialData(
        mapAddressGetData(responseLocalAddress.data, responsePermanentAddress.data, responseFatherAddress.data)
      );
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onIsPermAddressSameChange = async (e) => {
    await setIsPermAddressSame(e.target.checked);
    validateFields(['isPermAddressSame']);
    validateFields();
  };

  const onIsFatherAddressSameAsPermAddress = async (e) => {
    await setIsFatherAddressSameAsPermAddress(e.target.checked);
    validateFields(['isFatherAddressSameAsPermAddress']);
    validateFields();
  };

  const onSubmitForm = async (values) => {
    try {
      if (initialData.local_isEmpty === 'true') {
        await client.post(
          `/user/public/applicant_address_create/${user.user_id}/?address_type=local_address`,
          mapLocalAddressPostData(values, user.userid)
        );
        message.success(`Local address added successfully.`);
      } else {
        await client.put(
          `/user/public/applicant_address_update/${user.user_id}/?address_type=local_address`,
          mapLocalAddressPostData(values, user.userid)
        );
        message.success(`Local address updated successfully.`);
      }

      if (!isPermAddressSame) {
        if (initialData.permanent_isEmpty === 'true') {
          await client.post(
            `/user/public/applicant_address_create/${user.user_id}/?address_type=permanent_address`,
            mapPermanentAddressPostData(values, user.userid)
          );
          message.success(`Permanent address added successfully.`);
        } else {
          await client.put(
            `/user/public/applicant_address_update/${user.user_id}/?address_type=permanent_address`,
            mapPermanentAddressPostData(values, user.userid)
          );
          message.success(`Permanent address updated successfully.`);
        }
      }
      if (!isFatherAddressSameAsPermAddress) {
        if (initialData.father_isEmpty === 'true') {
          await client.post(
            `/user/public/applicant_address_create/${user.user_id}/?address_type=father_address`,
            mapFatherAddressPostData(values, user.userid)
          );
          message.success(`Father address added successfully.`);
        } else {
          await client.put(
            `/user/public/applicant_address_update/${user.user_id}/?address_type=father_address`,
            mapFatherAddressPostData(values, user.userid)
          );
          message.success(`Father address updated successfully.`);
        }
      }
      setShowConfirm(false);
      onNext();
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
      <PageHeader>Address Details</PageHeader>
      <Box>
        <Form form={form} name='form' onFinish={onSubmitForm} initialValues={{ ...initialData }} scrollToFirstError>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Residential Address</PageHeader>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={6}>
                  <Form.Item
                    name='local_address1'
                    label='Address1'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter address 1',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='local_address2'
                    label='Address2'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter address 2',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='local_address3'
                    label='Address3'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter address 3',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='local_telephone_no'
                    label='Phone Number'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter phone number',
                      },
                      {
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: 'Phone number must be number',
                      },
                      {
                        min: 10,
                        message: 'Phone mumber must be at least 10 digits',
                      },
                    ]}
                  >
                    <Input maxLength={13} type='tel' />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='local_country'
                    label='Country'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select Country',
                      },
                    ]}
                  >
                    <Select placeholder='Select Country'>
                      <Option value='in'>India</Option>
                      <Option value='uk'>UK</Option>
                      <Option value='usa'>USA</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='local_state'
                    label='State'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select State',
                      },
                    ]}
                  >
                    <Select placeholder='Select State'>
                      <Option value='maharashtra'>Maharashtra</Option>
                      <Option value='goa'>Goa</Option>
                      <Option value='karnataka'>Karnataka</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='local_city'
                    label='City'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter city',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='local_postcode'
                    label='Pincode'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter pincode',
                      },
                      {
                        min: 6,
                        message: 'Please enter valid pincode',
                      },
                      {
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: 'Pincode must be numeric',
                      },
                    ]}
                  >
                    <Input maxLength={6} type='tel' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Permanent Address</PageHeader>
            </Col>
            <Col span={8}>
              <Form.Item name='isPermAddressSame' label='' labelCol={{ span: 24 }}>
                <Checkbox
                  checked={isPermAddressSame}
                  onChange={onIsPermAddressSameChange}
                  style={{ lineHeight: '32px' }}
                >
                  Do you want this same as residential address
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={6}>
                  <Form.Item
                    name='permanent_address1'
                    label='Address1'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please enter address 1',
                      },
                    ]}
                  >
                    <Input disabled={isPermAddressSame} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='permanent_address2'
                    label='Address2'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please enter address 2',
                      },
                    ]}
                  >
                    <Input disabled={isPermAddressSame} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='permanent_address3'
                    label='Address3'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please enter address 3',
                      },
                    ]}
                  >
                    <Input disabled={isPermAddressSame} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='permanent_telephone_no'
                    label='Phone Number'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please enter phone number',
                      },
                      {
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: 'Phone number must be number',
                      },
                      {
                        min: 10,
                        message: 'Phone mumber must be at least 10 digits',
                      },
                    ]}
                  >
                    <Input maxLength={13} type='tel' disabled={isPermAddressSame} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='permanent_country'
                    label='Country'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please select Country',
                      },
                    ]}
                  >
                    <Select placeholder='Select Country' disabled={isPermAddressSame}>
                      <Option value='in'>India</Option>
                      <Option value='uk'>UK</Option>
                      <Option value='usa'>USA</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='permanent_state'
                    label='State'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please select State',
                      },
                    ]}
                  >
                    <Select placeholder='Select State' disabled={isPermAddressSame}>
                      <Option value='maharashtra'>Maharashtra</Option>
                      <Option value='goa'>Goa</Option>
                      <Option value='karnataka'>Karnataka</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='permanent_city'
                    label='City'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please enter city',
                      },
                    ]}
                  >
                    <Input disabled={isPermAddressSame} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='permanent_postcode'
                    label='Pincode'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isPermAddressSame,
                        message: 'Please enter pincode',
                      },
                      {
                        min: 6,
                        message: 'Please enter valid pincode',
                      },
                      {
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: 'Pincode must be numeric',
                      },
                    ]}
                  >
                    <Input maxLength={6} type='tel' disabled={isPermAddressSame} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Father Address</PageHeader>
            </Col>
            <Col span={8}>
              <Form.Item name='isFatherAddressSameAsPermAddress' label='' labelCol={{ span: 24 }}>
                <Checkbox
                  checked={isFatherAddressSameAsPermAddress}
                  onChange={onIsFatherAddressSameAsPermAddress}
                  style={{ lineHeight: '32px' }}
                >
                  Do you want this same as permamant address
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={6}>
                  <Form.Item
                    name='father_address1'
                    label='Address1'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please enter address 1',
                      },
                    ]}
                  >
                    <Input disabled={isFatherAddressSameAsPermAddress} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='father_address2'
                    label='Address2'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please enter address 2',
                      },
                    ]}
                  >
                    <Input disabled={isFatherAddressSameAsPermAddress} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='father_address3'
                    label='Address3'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please enter address 3',
                      },
                    ]}
                  >
                    <Input disabled={isFatherAddressSameAsPermAddress} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='father_telephone_no'
                    label='Phone Number'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please enter phone number',
                      },
                      {
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: 'Phone number must be number',
                      },
                      {
                        min: 10,
                        message: 'Phone mumber must be at least 10 digits',
                      },
                    ]}
                  >
                    <Input maxLength={13} type='tel' disabled={isFatherAddressSameAsPermAddress} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='father_country'
                    label='Country'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please select Country',
                      },
                    ]}
                  >
                    <Select placeholder='Select Country' disabled={isFatherAddressSameAsPermAddress}>
                      <Option value='in'>India</Option>
                      <Option value='uk'>UK</Option>
                      <Option value='usa'>USA</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='father_state'
                    label='State'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please select State',
                      },
                    ]}
                  >
                    <Select placeholder='Select State' disabled={isFatherAddressSameAsPermAddress}>
                      <Option value='maharashtra'>Maharashtra</Option>
                      <Option value='goa'>Goa</Option>
                      <Option value='karnataka'>Karnataka</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='father_city'
                    label='City'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please enter city',
                      },
                    ]}
                  >
                    <Input disabled={isFatherAddressSameAsPermAddress} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='father_postcode'
                    label='Pincode'
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: !isFatherAddressSameAsPermAddress,
                        message: 'Please enter pincode',
                      },
                      {
                        min: 6,
                        message: 'Please enter valid pincode',
                      },
                      {
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: 'Pincode must be numeric',
                      },
                    ]}
                  >
                    <Input maxLength={6} type='tel' disabled={isFatherAddressSameAsPermAddress} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

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

Address.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default Address;
