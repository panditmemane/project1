import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Divider, Select, DatePicker, message, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import FormStyles from '../../../styled/Form.styles';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';
import moment from 'moment';

const Others = ({ onNext, onPrevious }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialData, setInitialData] = useState();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const responseRelations = await client.get(`/user/public/neeri_relations/${user.user_id}/`);
      const responseLanguages = await client.get(`/user/public/applicant_languages/${user.user_id}/`);
      const responseReferences = await client.get(`/user/public/applicant_references/${user.user_id}/`);
      const responseOverseasVisits = await client.get(`/user/public/overseas_visits/${user.user_id}/`);
      const responseOtherInfo = await client.get(`/user/public/other_info/${user.user_id}/`);

      setInitialData({
        ...(responseRelations.data.isEmpty && responseRelations.data.isEmpty === 'true'
          ? { relation_with_neeri_employee: [] }
          : {
              relation_with_neeri_employee: responseRelations.data,
            }),
        ...(responseLanguages.data.isEmpty && responseLanguages.data.isEmpty === 'true'
          ? { known_languages: [] }
          : {
              known_languages: responseLanguages.data,
            }),
        ...(responseOverseasVisits.data.isEmpty && responseOverseasVisits.data.isEmpty === 'true'
          ? { overseas_visits: [] }
          : {
              overseas_visits: responseOverseasVisits.data.map((data) => ({
                ...data,
                date_of_visit: moment(data.date_of_visit),
              })),
            }),
        ...(responseReferences.data.isEmpty && responseReferences.data.isEmpty === 'true'
          ? { reference: [{}, {}, {}] }
          : {
              reference: responseReferences.data.map((ref) => ({
                ...ref,
                address1: ref.address.address1,
                address2: ref.address.address2,
                address3: ref.address.address3,
                city: ref.address.city,
                state: ref.address.state,
                country: ref.address.country,
                postcode: ref.address.postcode,
                telephone_no: ref.address.telephone_no,
              })),
            }),

        ...{
          ...responseOtherInfo.data,
          bond_start_date:
            responseOtherInfo.data.bond_start_date && responseOtherInfo.data.bond_start_date !== null
              ? moment(responseOtherInfo.data.bond_start_date)
              : '',
          bond_end_date:
            responseOtherInfo.data.bond_end_date && responseOtherInfo.data.bond_end_date !== null
              ? moment(responseOtherInfo.data.bond_end_date)
              : '',
        },
      });
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onSubmitForm = async (values) => {
    try {
      if (initialData.relation_with_neeri_employee) {
        if (initialData.relation_with_neeri_employee.length === 0) {
          await client.post(`/user/public/neeri_relation_create/${user.user_id}/`, values.relation_with_neeri_employee);
          message.success(`Relation added successfully.`);
        } else {
          await client.put(`/user/public/neeri_relation_update/${user.user_id}/`, values.relation_with_neeri_employee);
          message.success(`Relation updated successfully.`);
        }
      }

      if (initialData.known_languages) {
        if (initialData.known_languages.length === 0) {
          await client.post(`/user/public/applicant_language_create/${user.user_id}/`, values.known_languages);
          message.success(`Languages added successfully.`);
        } else {
          await client.put(`/user/public/applicant_language_update/${user.user_id}/`, values.known_languages);
          message.success(`Languages updated successfully.`);
        }
      }

      if (initialData.overseas_visits) {
        if (initialData.overseas_visits.length === 0) {
          await client.post(
            `/user/public/overseas_visit_create/${user.user_id}/`,
            values.overseas_visits.map((visit) => ({
              ...visit,
              date_of_visit: moment(visit.date_of_visit).format('YYYY-MM-DD'),
            }))
          );
          message.success(`Overseas visit added successfully.`);
        } else {
          await client.put(
            `/user/public/overseas_visit_update/${user.user_id}/`,
            values.overseas_visits.map((visit) => ({
              ...visit,
              date_of_visit: moment(visit.date_of_visit).format('YYYY-MM-DD'),
            }))
          );
          message.success(`Overseas visit updated successfully.`);
        }
      }

      if (initialData.bond_title !== null) {
        try {
          await client.post(`/user/public/other_info_create/${user.user_id}/`, {
            bond_title: values.bond_title,
            bond_details: values.bond_details,
            organisation_name: values.organisation_name,
            bond_start_date: moment(values.bond_start_date).format('YYYY-MM-DD'),
            bond_end_date: moment(values.bond_end_date).format('YYYY-MM-DD'),
            notice_period_min: values.notice_period_min,
            notice_period_max: values.notice_period_max,
          });
          message.success(`Overseas visit added successfully.`);
        } catch (error) {
          setShowConfirm(false);
          message.error(`Error.`);
        }
      } else {
        try {
          await client.put(`/user/public/other_info_update/${user.user_id}/`, {
            bond_title: values.bond_title,
            bond_details: values.bond_details,
            organisation_name: values.organisation_name,
            bond_start_date: moment(values.bond_start_date).format('YYYY-MM-DD'),
            bond_end_date: moment(values.bond_end_date).format('YYYY-MM-DD'),
            notice_period_min: values.notice_period_min,
            notice_period_max: values.notice_period_max,
          });
          message.success(`Overseas visit updated successfully.`);
        } catch (error) {
          message.error(`Error.`);
          setShowConfirm(false);
        }
      }
      onNext();
      setShowConfirm(false);
    } catch (error) {
      setShowConfirm(false);
    }
  };

  const onDeleteRelation = async (index) => {
    const { getFieldsValue } = form;
    const data = getFieldsValue().relation_with_neeri_employee[index];
    if (data && data.id) {
      await client.delete(`/user/public/neeri_relation_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onDeleteLanguage = async (index) => {
    const { getFieldsValue } = form;
    const data = getFieldsValue().known_languages[index];
    if (data && data.id) {
      await client.delete(`/user/public/applicant_language_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  if (!initialData) return null;

  return (
    <FormStyles>
      <PageHeader>Others Details</PageHeader>
      <Box>
        <Form form={form} name='form' onFinish={onSubmitForm} initialValues={{ ...initialData }} scrollToFirstError>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Relation with Neeri Employee</PageHeader>
            </Col>
          </Row>
          <Form.List name='relation_with_neeri_employee'>
            {(fields, { add, remove }) => (
              <>
                {' '}
                {fields.map((field, index) => (
                  <>
                    <Row gutter={[16, 0]}>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Name of the relation'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'name_of_the_relation']}
                          fieldKey={[field.fieldKey, 'name_of_the_relation']}
                          rules={[
                            {
                              required: true,
                              message: "Relation name can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Designation'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'designation']}
                          fieldKey={[field.fieldKey, 'designation']}
                          rules={[
                            {
                              required: true,
                              message: "Designation can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Work Loc. Centre Name'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'centre_name']}
                          fieldKey={[field.fieldKey, 'centre_name']}
                          rules={[
                            {
                              required: true,
                              message: "Center name can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Relationship'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'relationship']}
                          fieldKey={[field.fieldKey, 'relationship']}
                          rules={[
                            {
                              required: true,
                              message: "Relation to can't be empty",
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
                            onDeleteRelation(index);
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
                    Add Relation with Neeri Employee
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Overseas Visits</PageHeader>
            </Col>
          </Row>
          <Form.List name='overseas_visits'>
            {(fields, { add, remove }) => (
              <>
                {' '}
                {fields.map((field) => (
                  <>
                    <Row gutter={[16, 0]}>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Employer'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'employer']}
                          fieldKey={[field.fieldKey, 'employer']}
                          rules={[
                            {
                              required: true,
                              message: "Country visited can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Visit Date'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'visit_date']}
                          fieldKey={[field.fieldKey, 'visit_date']}
                          rules={[
                            {
                              required: true,
                              message: "Designation can't be empty",
                            },
                          ]}
                        >
                          <DatePicker format='DD-MM-YYYY' disabledDate={(d) => !d || d.isAfter(moment())} />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Duration'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'duration']}
                          fieldKey={[field.fieldKey, 'duration']}
                          rules={[
                            {
                              required: true,
                              message: "Duration of visit can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Purpose'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'purpose']}
                          fieldKey={[field.fieldKey, 'purpose']}
                          rules={[
                            {
                              required: true,
                              message: "Purpose of visit to can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[16, 0]} justify='end' style={{ marginBottom: '25px' }}>
                      <Col>
                        <Button type='danger' htmlType='button' onClick={() => remove(field.name)}>
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Overseas Visits
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Known Languages</PageHeader>
            </Col>
          </Row>
          <Form.List name='known_languages'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <>
                    <Row gutter={[16, 0]}>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Language Name'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={[{ required: true, message: "Name can't be empty" }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label='Read Level'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'read_level']}
                          fieldKey={[field.fieldKey, 'read_level']}
                          rules={[
                            {
                              required: true,
                              message: "Read level can't be empty",
                            },
                          ]}
                        >
                          <Select placeholder='Select Level'>
                            <Option value='beginner'>Beginner</Option>
                            <Option value='intermediate'>Intermediate</Option>
                            <Option value='expert'>Expert</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label='Write Level'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'write_level']}
                          fieldKey={[field.fieldKey, 'write_level']}
                          rules={[
                            {
                              required: true,
                              message: "Write level can't be empty",
                            },
                          ]}
                        >
                          <Select placeholder='Select Level'>
                            <Option value='beginner'>Beginner</Option>
                            <Option value='intermediate'>Intermediate</Option>
                            <Option value='expert'>Expert</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label='Speak Level'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'speak_level']}
                          fieldKey={[field.fieldKey, 'speak_level']}
                          rules={[
                            {
                              required: true,
                              message: "Speak level can't be empty",
                            },
                          ]}
                        >
                          <Select placeholder='Select Level'>
                            <Option value='beginner'>Beginner</Option>
                            <Option value='intermediate'>Intermediate</Option>
                            <Option value='expert'>Expert</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...field}
                          label='Exam Passed'
                          labelCol={{ span: 24 }}
                          name={[field.name, 'exam_passed']}
                          fieldKey={[field.fieldKey, 'exam_passed']}
                          rules={[
                            {
                              required: true,
                              message: "Exam passed can't be empty",
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
                            onDeleteLanguage(index);
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
                    Add Known Languages
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Other Details</PageHeader>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                name='bond_title'
                label='Bond Name'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Bond title can't be empty",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name='bond_details'
                label='Bond Details'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Bond details can't be empty",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='organisation_name'
                label='Organisation Name'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Organisation Name can't be empty",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='bond_start_date'
                label='Bond Start Date'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Bond Start Date can't be empty",
                  },
                ]}
              >
                <DatePicker format='DD-MM-YYYY' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='bond_end_date'
                label='Bond End Date'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Bond End Date can't be empty",
                  },
                ]}
              >
                <DatePicker format='DD-MM-YYYY' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name='notice_period_min'
                label='Min Notice Period (Day)'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Min Notice Period can't be empty",
                  },
                  {
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: 'Min Notice must be numeric',
                  },
                ]}
              >
                <Input type='tel' maxLength={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='notice_period_max'
                label='Max Notice Period'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Max Notice Period can't be empty",
                  },
                  {
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: 'Max Notice must be numeric',
                  },
                ]}
              >
                <Input type='tel' maxLength={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <PageHeader>Reference Details</PageHeader>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Form.List
              name='reference'
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 3) {
                      return Promise.reject(new Error('At least 3 references required'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <>
                      <Col span={24}>
                        <Divider orientation='left'>
                          {' '}
                          <h4>Reference Details {index + 1}</h4>
                        </Divider>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'reference_name']}
                          fieldKey={[field.fieldKey, 'reference_name']}
                          label='Reference Name'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: "Reference name can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'position']}
                          fieldKey={[field.fieldKey, 'position']}
                          label='Position'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: "Position can't be empty",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'telephone_no']}
                          fieldKey={[field.fieldKey, 'telephone_no']}
                          label='Phone Number'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: "Telephone no. can't be empty",
                            },
                            {
                              pattern: new RegExp(/^[0-9\b]+$/),
                              message: 'Telephone no. must be numeric',
                            },
                          ]}
                        >
                          <Input type='tel' maxLength={13} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'address1']}
                          fieldKey={[field.fieldKey, 'address1']}
                          label='Address 1'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter Address 1',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'address2']}
                          fieldKey={[field.fieldKey, 'address2']}
                          label='Address 2'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter Address 2',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'address3']}
                          fieldKey={[field.fieldKey, 'address3']}
                          label='Address 3'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter Address 3',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'city']}
                          fieldKey={[field.fieldKey, 'city']}
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
                          {...field}
                          name={[field.name, 'state']}
                          fieldKey={[field.fieldKey, 'state']}
                          label='State'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please setect state',
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
                          {...field}
                          name={[field.name, 'country']}
                          fieldKey={[field.fieldKey, 'country']}
                          label='Country'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please setect state',
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
                          {...field}
                          name={[field.name, 'postcode']}
                          fieldKey={[field.fieldKey, 'postcode']}
                          label='Post Code'
                          labelCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter post code',
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
                    </>
                  ))}
                </>
              )}
            </Form.List>
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

Others.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default Others;
