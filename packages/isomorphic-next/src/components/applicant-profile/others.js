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
  const [formRelations] = Form.useForm();
  const [formLanguages] = Form.useForm();
  const [formReferences] = Form.useForm();
  const [formOverseasVisits] = Form.useForm();
  const [formOtherInfo] = Form.useForm();

  const { Option } = Select;
  const { client } = useAuthState();
  const { user } = useUser({});
  const [showConfirm, setShowConfirm] = useState(false);

  const [initialRelations, setInitialRelations] = useState();
  const [initialLanguages, setInitialLanguages] = useState();
  const [initialReferences, setInitialReferences] = useState();
  const [initialOverseasVisits, setInitialOverseasVisits] = useState();
  const [initialOtherInfo, setInitialOtherInfo] = useState();

  const [isRelationsSubmitted, setRelationsSubmitted] = useState();
  const [isLanguagesSubmitted, setLanguagesSubmitted] = useState();
  const [isOverseasSubmitted, setOverseasSubmitted] = useState();
  const [isOtherInfoSubmitted, setOtherInfoSubmitted] = useState();
  const [isReferencesSubmitted, setReferencesSubmitted] = useState();

  useEffect(() => {
    const load = async () => {
      const responseRelations = await client.get(`/user/public/neeri_relations/${user.user_id}/`);
      const responseLanguages = await client.get(`/user/public/applicant_languages/${user.user_id}/`);
      const responseReferences = await client.get(`/user/public/applicant_references/${user.user_id}/`);
      const responseOverseasVisits = await client.get(`/user/public/overseas_visits/${user.user_id}/`);
      const responseOtherInfo = await client.get(`/user/public/other_info/${user.user_id}/`);

      setInitialRelations({
        ...(responseRelations.data.isEmpty && responseRelations.data.isEmpty === 'true'
          ? { relation_with_neeri_employee: [] }
          : {
              relation_with_neeri_employee: responseRelations.data,
            }),
      });

      setInitialLanguages({
        ...(responseLanguages.data.isEmpty && responseLanguages.data.isEmpty === 'true'
          ? { known_languages: [] }
          : {
              known_languages: responseLanguages.data,
            }),
      });

      setInitialReferences({
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
      });

      setInitialOverseasVisits({
        ...(responseOverseasVisits.data.isEmpty && responseOverseasVisits.data.isEmpty === 'true'
          ? { overseas_visits: [] }
          : {
              overseas_visits: responseOverseasVisits.data.map((data) => ({
                ...data,
                date_of_visit: moment(data.date_of_visit),
              })),
            }),
      });

      setInitialOtherInfo({
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

      // setInitialData({
      //   ...(responseRelations.data.isEmpty && responseRelations.data.isEmpty === 'true'
      //     ? { relation_with_neeri_employee: [] }
      //     : {
      //         relation_with_neeri_employee: responseRelations.data
      //       }),
      //   ...(responseLanguages.data.isEmpty && responseLanguages.data.isEmpty === 'true'
      //     ? { known_languages: [] }
      //     : {
      //         known_languages: responseLanguages.data
      //       }),
      //   ...(responseOverseasVisits.data.isEmpty && responseOverseasVisits.data.isEmpty === 'true'
      //     ? { overseas_visits: [] }
      //     : {
      //         overseas_visits: responseOverseasVisits.data.map((data) => ({
      //           ...data,
      //           date_of_visit: moment(data.date_of_visit)
      //         }))
      //       }),
      //   ...(responseReferences.data.isEmpty && responseReferences.data.isEmpty === 'true'
      //     ? { reference: [{}, {}, {}] }
      //     : {
      //         reference: responseReferences.data.map((ref) => ({
      //           ...ref,
      //           address1: ref.address.address1,
      //           address2: ref.address.address2,
      //           address3: ref.address.address3,
      //           city: ref.address.city,
      //           state: ref.address.state,
      //           country: ref.address.country,
      //           postcode: ref.address.postcode,
      //           telephone_no: ref.address.telephone_no
      //         }))
      //       }),

      //   ...{
      //     ...responseOtherInfo.data,
      //     bond_start_date:
      //       responseOtherInfo.data.bond_start_date && responseOtherInfo.data.bond_start_date !== null
      //         ? moment(responseOtherInfo.data.bond_start_date)
      //         : '',
      //     bond_end_date:
      //       responseOtherInfo.data.bond_end_date && responseOtherInfo.data.bond_end_date !== null
      //         ? moment(responseOtherInfo.data.bond_end_date)
      //         : ''
      //   }
      // });
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  // const onSubmitForm = async (values) => {
  //   try {
  //     // if (initialData.relation_with_neeri_employee) {
  //     //   if (initialData.relation_with_neeri_employee.length === 0) {
  //     //     await client.post(`/user/public/neeri_relation_create/${user.user_id}/`, values.relation_with_neeri_employee);
  //     //     message.success(`Relation added successfully.`);
  //     //   } else {
  //     //     await client.put(`/user/public/neeri_relation_update/${user.user_id}/`, values.relation_with_neeri_employee);
  //     //     message.success(`Relation updated successfully.`);
  //     //   }
  //     // }

  //     // if (initialData.known_languages) {
  //     //   if (initialData.known_languages.length === 0) {
  //     //     await client.post(`/user/public/applicant_language_create/${user.user_id}/`, values.known_languages);
  //     //     message.success(`Languages added successfully.`);
  //     //   } else {
  //     //     await client.put(`/user/public/applicant_language_update/${user.user_id}/`, values.known_languages);
  //     //     message.success(`Languages updated successfully.`);
  //     //   }
  //     // }

  //     // if (initialData.overseas_visits) {
  //     //   if (initialData.overseas_visits.length === 0) {
  //     //     await client.post(
  //     //       `/user/public/overseas_visit_create/${user.user_id}/`,
  //     //       values.overseas_visits.map((visit) => ({
  //     //         ...visit,
  //     //         date_of_visit: moment(visit.date_of_visit).format('YYYY-MM-DD')
  //     //       }))
  //     //     );
  //     //     message.success(`Overseas visit added successfully.`);
  //     //   } else {
  //     //     await client.put(
  //     //       `/user/public/overseas_visit_update/${user.user_id}/`,
  //     //       values.overseas_visits.map((visit) => ({
  //     //         ...visit,
  //     //         date_of_visit: moment(visit.date_of_visit).format('YYYY-MM-DD')
  //     //       }))
  //     //     );
  //     //     message.success(`Overseas visit updated successfully.`);
  //     //   }
  //     // }

  //     // if (initialData.bond_title !== null) {
  //     //   try {
  //     //     await client.post(`/user/public/other_info_create/${user.user_id}/`, {
  //     //       bond_title: values.bond_title,
  //     //       bond_details: values.bond_details,
  //     //       organisation_name: values.organisation_name,
  //     //       bond_start_date: moment(values.bond_start_date).format('YYYY-MM-DD'),
  //     //       bond_end_date: moment(values.bond_end_date).format('YYYY-MM-DD'),
  //     //       notice_period_min: values.notice_period_min,
  //     //       notice_period_max: values.notice_period_max
  //     //     });
  //     //     message.success(`Overseas visit added successfully.`);
  //     //   } catch (error) {
  //     //     setShowConfirm(false);
  //     //     message.error(`Error.`);
  //     //   }
  //     // } else {
  //     //   try {
  //     //     await client.put(`/user/public/other_info_update/${user.user_id}/`, {
  //     //       bond_title: values.bond_title,
  //     //       bond_details: values.bond_details,
  //     //       organisation_name: values.organisation_name,
  //     //       bond_start_date: moment(values.bond_start_date).format('YYYY-MM-DD'),
  //     //       bond_end_date: moment(values.bond_end_date).format('YYYY-MM-DD'),
  //     //       notice_period_min: values.notice_period_min,
  //     //       notice_period_max: values.notice_period_max
  //     //     });
  //     //     message.success(`Overseas visit updated successfully.`);
  //     //   } catch (error) {
  //     //     message.error(`Error.`);
  //     //     setShowConfirm(false);
  //     //   }
  //     // }
  //     onNext();
  //     setShowConfirm(false);
  //   } catch (error) {
  //     setShowConfirm(false);
  //   }
  // };

  const onDeleteRelation = async (index) => {
    const { getFieldsValue } = formRelations;
    const data = getFieldsValue().relation_with_neeri_employee[index];
    if (data && data.id) {
      await client.delete(`/user/public/neeri_relation_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onDeleteLanguage = async (index) => {
    const { getFieldsValue } = formLanguages;
    const data = getFieldsValue().known_languages[index];
    if (data && data.id) {
      await client.delete(`/user/public/applicant_language_delete/${user.user_id}/`, { data: { id: data.id } });
    }
    message.success(`Record deleted successfully.`);
  };

  const onNextSubmit = async () => {
    setShowConfirm(false);

    if (
      formRelations.isFieldsTouched() &&
      formRelations.getFieldsValue().relation_with_neeri_employee &&
      formRelations.getFieldsValue().relation_with_neeri_employee.length > 0
    ) {
      await formRelations
        .validateFields()
        .then(() => formRelations.submit())
        .catch((x) => {
          message.error('Please fill relation details');
          throw x;
        });
    }

    if (
      formLanguages.isFieldsTouched() &&
      formLanguages.getFieldsValue().known_languages &&
      formLanguages.getFieldsValue().known_languages.length > 0
    ) {
      await formLanguages
        .validateFields()
        .then(() => formLanguages.submit())
        .catch((x) => {
          message.error('Please fill languages details');
          throw x;
        });
    }

    if (
      formOverseasVisits.isFieldsTouched() &&
      formOverseasVisits.getFieldsValue().overseas_visits &&
      formOverseasVisits.getFieldsValue().overseas_visits.length > 0
    ) {
      await formOverseasVisits
        .validateFields()
        .then(() => formOverseasVisits.submit())
        .catch((x) => {
          message.error('Please fill overseas visits details');
          throw x;
        });
    }

    if (
      formReferences.isFieldsTouched() &&
      formReferences.getFieldsValue().reference &&
      formReferences.getFieldsValue().reference.length > 0
    ) {
      await formReferences
        .validateFields()
        .then(() => formReferences.submit())
        .catch((x) => {
          message.error('Please fill reference details');
          throw x;
        });
    }

    if (formOtherInfo.isFieldsTouched() && formOtherInfo.getFieldsValue()) {
      await formOtherInfo
        .validateFields()
        .then(() => formOtherInfo.submit())
        .catch((x) => {
          message.error('Please fill other details');
          throw x;
        });
    }

    if (
      !formRelations.getFieldsValue().relation_with_neeri_employee ||
      formRelations.getFieldsValue().relation_with_neeri_employee.length === 0
    ) {
      message.error('Please add relationship details');
      return;
    }

    if (
      !formLanguages.getFieldsValue().known_languages ||
      formLanguages.getFieldsValue().known_languages.length === 0
    ) {
      message.error('Please add language details');
      return;
    }

    if (
      !formOverseasVisits.getFieldsValue().overseas_visits ||
      formOverseasVisits.getFieldsValue().overseas_visits.length === 0
    ) {
      message.error('Please add overseas visits details');
      return;
    }

    onNext();
  };

  const onSubmitRelationsForm = async (values) => {
    if (!isRelationsSubmitted || formRelations.isFieldsTouched()) {
      if (initialRelations.relation_with_neeri_employee) {
        if (initialRelations.relation_with_neeri_employee.length === 0) {
          await client.post(`/user/public/neeri_relation_create/${user.user_id}/`, values.relation_with_neeri_employee);
          message.success(`Relation added successfully.`);
        } else {
          const updateData = values.relation_with_neeri_employee.filter((dt) => !!dt.id);
          const createData = values.relation_with_neeri_employee.filter((dt) => !dt.id);
          if (updateData.length > 0) {
            await client.put(`/user/public/neeri_relation_update/${user.user_id}/`, updateData);
          }
          if (createData.length > 0) {
            await client.post(`/user/public/neeri_relation_create/${user.user_id}/`, createData);
          }
          message.success(`Relation updated successfully.`);
        }
      }
      setRelationsSubmitted(true);
    }
  };
  const onSubmitOverseasVisitsForm = async (values) => {
    if (!isOverseasSubmitted || formOverseasVisits.isFieldsTouched()) {
      if (initialOverseasVisits.overseas_visits) {
        if (initialOverseasVisits.overseas_visits.length === 0) {
          await client.post(
            `/user/public/overseas_visit_create/${user.user_id}/`,
            values.overseas_visits.map((visit) => ({
              ...visit,
              date_of_visit: moment(visit.date_of_visit).format('YYYY-MM-DD'),
            }))
          );
          message.success(`Overseas visit added successfully.`);
        } else {
          const updateData = values.overseas_visits.filter((dt) => !!dt.id);
          const createData = values.overseas_visits.filter((dt) => !dt.id);
          if (updateData.length > 0) {
            await client.put(
              `/user/public/overseas_visit_update/${user.user_id}/`,
              updateData.map((visit) => ({
                ...visit,
                date_of_visit: moment(visit.date_of_visit).format('YYYY-MM-DD'),
              }))
            );
          }
          if (createData.length > 0) {
            await client.post(
              `/user/public/overseas_visit_create/${user.user_id}/`,
              createData.map((visit) => ({
                ...visit,
                date_of_visit: moment(visit.date_of_visit).format('YYYY-MM-DD'),
              }))
            );
          }
          message.success(`Overseas visit updated successfully.`);
        }
      }
      setOverseasSubmitted(true);
    }
  };
  const onSubmitLanguagesForm = async (values) => {
    if (!isLanguagesSubmitted) {
      if (initialLanguages.known_languages || formLanguages.isFieldsTouched()) {
        if (initialLanguages.known_languages.length === 0) {
          await client.post(`/user/public/applicant_language_create/${user.user_id}/`, values.known_languages);
          message.success(`Languages added successfully.`);
        } else {
          const updateData = values.known_languages.filter((dt) => !!dt.id);
          const createData = values.known_languages.filter((dt) => !dt.id);
          if (updateData.length > 0) {
            await client.put(`/user/public/applicant_language_update/${user.user_id}/`, updateData);
          }
          if (createData.length > 0) {
            await client.post(`/user/public/applicant_language_create/${user.user_id}/`, createData);
          }
          message.success(`Languages updated successfully.`);
        }
      }
      setLanguagesSubmitted(true);
    }
  };
  const onSubmitOtherInfoForm = async (values) => {
    if (!isOtherInfoSubmitted || formOtherInfo.isFieldsTouched()) {
      if (initialOtherInfo.bond_title !== null && !values.id) {
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
          message.success(`Other Info added successfully.`);
        } catch (error) {
          setShowConfirm(false);
          message.error(`Error.`);
        }
      } else {
        try {
          await client.put(`/user/public/other_info_update/${user.user_id}/`, {
            id: values.id,
            bond_title: values.bond_title,
            bond_details: values.bond_details,
            organisation_name: values.organisation_name,
            bond_start_date: moment(values.bond_start_date).format('YYYY-MM-DD'),
            bond_end_date: moment(values.bond_end_date).format('YYYY-MM-DD'),
            notice_period_min: values.notice_period_min,
            notice_period_max: values.notice_period_max,
          });
          message.success(`Other Info updated successfully.`);
        } catch (error) {
          message.error(`Error.`);
          setShowConfirm(false);
        }
      }
      setOtherInfoSubmitted(true);
    }
  };
  const onSubmitReferencesForm = async (values) => {
    if (!isReferencesSubmitted || formReferences.isFieldsTouched()) {
      if (initialReferences.reference) {
        if (initialReferences.reference.length === 0) {
          await client.post(
            `/user/public/applicant_reference_create/${user.user_id}/`,
            values.reference.map((ref) => ({
              reference_name: ref.reference_name,
              position: ref.position,
              address: {
                address1: ref.address1,
                address2: ref.address2,
                address3: ref.address3,
                city: ref.city,
                state: ref.state,
                country: ref.country,
                postcode: ref.postcode,
                telephone_no: ref.telephone_no,
              },
            }))
          );
          message.success(`Reference added successfully.`);
        } else {
          const updateData = values.reference.filter((dt) => !!dt.id);
          const createData = values.reference.filter((dt) => !dt.id);
          if (updateData.length > 0) {
            await client.put(
              `/user/public/applicant_reference_update/${user.user_id}/`,
              updateData.map((ref) => ({
                id: ref.id,
                reference_name: ref.reference_name,
                position: ref.position,
                address: {
                  address1: ref.address1,
                  address2: ref.address2,
                  address3: ref.address3,
                  city: ref.city,
                  state: ref.state,
                  country: ref.country,
                  postcode: ref.postcode,
                  telephone_no: ref.telephone_no,
                },
              }))
            );
          }
          if (createData.length > 0) {
            await client.post(
              `/user/public/applicant_reference_create/${user.user_id}/`,
              createData.map((ref) => ({
                reference_name: ref.reference_name,
                position: ref.position,
                address: {
                  address1: ref.address1,
                  address2: ref.address2,
                  address3: ref.address3,
                  city: ref.city,
                  state: ref.state,
                  country: ref.country,
                  postcode: ref.postcode,
                  telephone_no: ref.telephone_no,
                },
              }))
            );
          }
          message.success(`Reference updated successfully.`);
        }
      }
      setReferencesSubmitted(true);
    }
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  if (!initialRelations || !initialLanguages || !initialReferences || !initialOverseasVisits || !initialOtherInfo) {
    return null;
  }

  return (
    <FormStyles>
      <PageHeader>Others Details</PageHeader>
      <>
        <>
          <Box>
            <Form
              form={formRelations}
              name='formRelations'
              onFinish={onSubmitRelationsForm}
              initialValues={{ ...initialRelations }}
              scrollToFirstError
            >
              <Row gutter={[16, 0]}>
                <Col span={16}>
                  <h3>Relation with Neeri Employee</h3>
                </Col>
              </Row>
              <Form.List name='relation_with_neeri_employee'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Box>
                        <Row gutter={[16, 0]}>
                          <Col span={6}>
                            <Form.Item
                              {...field}
                              label='Name of the relation'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'relation_name']}
                              fieldKey={[field.fieldKey, 'relation_name']}
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
                              name={[field.name, 'center_name']}
                              fieldKey={[field.fieldKey, 'center_name']}
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
                              name={[field.name, 'relation']}
                              fieldKey={[field.fieldKey, 'relation']}
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
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Box>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Relation with Neeri Employee
                      </Button>
                    </Form.Item>
                    <Row justify='end'>
                      <Form.Item>
                        <Space>
                          <Button type='primary' htmlType='submit'>
                            Save
                          </Button>
                          <Button type='primary' htmlType='button' onClick={() => formRelations.resetFields()}>
                            Reset
                          </Button>
                        </Space>
                      </Form.Item>
                    </Row>
                  </>
                )}
              </Form.List>
            </Form>{' '}
          </Box>
          <Box>
            <Form
              form={formOverseasVisits}
              name='formOverseasVisits'
              onFinish={onSubmitOverseasVisitsForm}
              initialValues={{ ...initialOverseasVisits }}
              scrollToFirstError
            >
              <Row gutter={[16, 0]}>
                <Col span={16}>
                  <h3>Overseas Visits</h3>
                </Col>
              </Row>
              <Form.List name='overseas_visits'>
                {(fields, { add, remove }) => (
                  <>
                    {' '}
                    {fields.map((field) => (
                      <Box>
                        <Row gutter={[16, 0]}>
                          <Col span={6}>
                            <Form.Item
                              {...field}
                              label='Country Visited'
                              labelCol={{ span: 24 }}
                              name={[field.name, 'country_visited']}
                              fieldKey={[field.fieldKey, 'country_visited']}
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
                              name={[field.name, 'date_of_visit']}
                              fieldKey={[field.fieldKey, 'date_of_visit']}
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
                              name={[field.name, 'duration_of_visit']}
                              fieldKey={[field.fieldKey, 'duration_of_visit']}
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
                              name={[field.name, 'purpose_of_visit']}
                              fieldKey={[field.fieldKey, 'purpose_of_visit']}
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
                        <Row gutter={[16, 0]} justify='end' style={{ marginBottom: '5px' }}>
                          <Col>
                            <Button type='danger' htmlType='button' onClick={() => remove(field.name)}>
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Box>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Overseas Visits
                      </Button>
                    </Form.Item>
                    <Row justify='end'>
                      <Form.Item>
                        <Space>
                          <Button type='primary' htmlType='submit'>
                            Save
                          </Button>
                          <Button type='primary' htmlType='button' onClick={() => formOverseasVisits.resetFields()}>
                            Reset
                          </Button>
                        </Space>
                      </Form.Item>
                    </Row>
                  </>
                )}
              </Form.List>
            </Form>{' '}
          </Box>
          <Box>
            <Form
              form={formLanguages}
              name='formLanguages'
              onFinish={onSubmitLanguagesForm}
              initialValues={{ ...initialLanguages }}
              scrollToFirstError
            >
              <Row gutter={[16, 0]}>
                <Col span={16}>
                  <h3>Known Languages</h3>
                </Col>
              </Row>
              <Form.List name='known_languages'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Box>
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
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Box>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Known Languages
                      </Button>
                    </Form.Item>
                    <Row justify='end'>
                      <Form.Item>
                        <Space>
                          <Button type='primary' htmlType='submit'>
                            Save
                          </Button>
                          <Button type='primary' htmlType='button' onClick={() => formLanguages.resetFields()}>
                            Reset
                          </Button>
                        </Space>
                      </Form.Item>
                    </Row>
                  </>
                )}
              </Form.List>
            </Form>
          </Box>
          <Box>
            <Form
              form={formOtherInfo}
              name='formOtherInfo'
              onFinish={onSubmitOtherInfoForm}
              initialValues={{ ...initialOtherInfo }}
              scrollToFirstError
            >
              <Row gutter={[16, 0]}>
                <Col span={16}>
                  <h3>Other Details</h3>
                </Col>
              </Row>
              <Form.Item name='id'>
                <Input type='hidden' />
              </Form.Item>
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
              <Row justify='end'>
                <Form.Item>
                  <Space>
                    <Button type='primary' htmlType='submit'>
                      Save
                    </Button>
                    <Button type='primary' htmlType='button' onClick={() => formOtherInfo.resetFields()}>
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Row>
            </Form>{' '}
          </Box>
          <Box>
            <Form
              form={formReferences}
              name='formReferences'
              onFinish={onSubmitReferencesForm}
              initialValues={{ ...initialReferences }}
              scrollToFirstError
            >
              <Row gutter={[16, 0]}>
                <Col span={16}>
                  <h3>Reference Details</h3>
                </Col>
              </Row>
              <Form.List name='reference'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Box>
                        <Row gutter={[16, 0]}>
                          <Col span={24}>
                            <h4>Reference Details {index + 1}</h4>
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
                        </Row>
                      </Box>
                    ))}
                  </>
                )}
              </Form.List>
              <Row justify='end'>
                <Form.Item>
                  <Space>
                    <Button type='primary' htmlType='submit'>
                      Save
                    </Button>
                    <Button type='primary' htmlType='button' onClick={() => formReferences.resetFields()}>
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Row>
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

Others.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default Others;
