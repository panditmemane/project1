import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Row, Col, Form, Input, Button, Space, DatePicker, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import { DropdownButtons, DropdownMenu, MenuItem } from '@iso/components/uielements/dropdown';
// Layouts
import DashboardLayout from '../../../containers/DashboardLayout/DashboardLayout';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
// Components
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
// Styles
import FormStyles from '../../../styled/Form.styles';
//Providers
import { useAuthState } from '../../../src/components/auth/hook';
import useUser from '../../../src/components/auth/useUser';
import { response } from 'express';

const Edit = () => {
  const { client } = useAuthState();
  const [department, setDept] = useState({});
  const [initialState, setInitialState] = useState();
  const [deptOptions, setDepartment] = useState([]);
  const [zonalOptions, setZonal] = useState([]);
  const [zonal, setZon] = useState({});
  const [position, setPos] = useState({});
  const [posOptions, setPosition] = useState([]);
  const [value, setValue] = useState(false);
  const { user } = useUser({});
  const router = useRouter();

  const onFormSubmit = async (values) => {
    await client.put(`/job_posting/create_project_requirement/${router.query.id}/`, {
      ...values,
      department: department,
      zonal: zonal,
      project_number: values.project_number,
      project_title: values.project_title,
      project_start_date: values.project_start_date,
      roject_end_date: values.roject_end_date,
      position: position,
      // manpower_position : [{ position_name: values.position_name, salary: values.salary, total_cost: values.total_cost, count: values.count }],
      total_estimated_amount: values.total_estimated_amount,
      provisions_made: values.provisions_made,
      min_essential_qualification: values.min_essential_qualification,
      job_requirements: values.job_requirements,
      desired_qualification: values.desired_qualification,
    });
    message.success('Successfully Updated');
    router.push('/admin/admin-section/requirement-approval');
  };

  useEffect(() => {
    const { id } = router.query;
    const load = async () => {
      const getresponse = await client.get(`/template/get_template/${id}/`);
      const response = await client.get('/job_posting/division_list_and_create/');
      const zonalLab = await client.get('/job_posting/zonal_lab_list_and_create/');
      const positionData = await client.get('/job_posting/temporary_positions/ ');
      setInitialState({
        ...getresponse.data,
      });
      const department = response.data.map((div) => ({
        value: div.division_id,
        label: div.division_name,
      }));
      const zonal = zonalLab.data.map((zon) => ({
        value: zon.zonal_lab_id,
        label: zon.zonal_lab_name,
      }));
      const position = positionData.data.map((pos) => ({
        value: pos.temp_position_id,
        label: pos.temp_position_master.position_name,
        salary: pos.salary,
      }));
      setDepartment(department);
      setZonal(zonal);
      setPosition(position);
      console.log(positionData);
    };
    load();
  }, []);

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const onChangeRadio = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const handleDivChange = (value, obj) => {
    const divObj = { division_id: value, division_name: obj.name };
    setDept(divObj);
  };

  const handleZonalChange = (value, obj) => {
    const ZonalObj = { zonal_lab_id: value, zonal_lab_name: obj.name };
    setZon(ZonalObj);
  };
  const handlePositionChange = (value, obj, salary) => {
    const PosObj = {
      temp_position_id: value,
      position_name: obj.name,
      // salary:salary,
      // count:values.count,
      // total_cost:values.total_cost
    };
    setPos(PosObj);
  };

  if (!initialState) return null;

  return (
    <>
      <Head>
        <title>Update Approval</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <FormStyles>
            <PageHeader>Update Approval</PageHeader>
            <Box>
              <Form name='formStep1' onFinish={onFormSubmit} initialValues={{ initialState }} scrollToFirstError>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <Form.Item
                      //name='division_name'
                      label='Department Name'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Department Name',
                        },
                      ]}
                    >
                      <Select placeholder='Select Department Name' onChange={handleDivChange}>
                        {deptOptions.map((div) => (
                          <Option value={div.value} name={div.label}>
                            {div.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      //  name='zonal_lab'
                      label='Zonal Lab'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Zonal Lab',
                        },
                      ]}
                    >
                      <Select placeholder='Select Zonal Lab' onChange={handleZonalChange}>
                        {zonalOptions.map((zon) => (
                          <Option value={zon.value} name={zon.label}>
                            {zon.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='project_number'
                      label='Project Number'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Project Number',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Project Number' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='project_title'
                      label='Project Title'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Project Title',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Project Title' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='startDate'
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
                  <Col span={12}>
                    <Form.Item
                      name='endDate'
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
                  <Col span={24}>
                    <Form.Item label='Position'></Form.Item>
                    <Form name='positions' onFinish={onFormSubmit} initialValues={{ initialState }} scrollToFirstError>
                      <Form.List name='users'>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                                <Form.Item
                                  {...restField}
                                  // name={[name, 'position']}
                                  // fieldKey={[fieldKey, 'position']}
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please Select Position Name',
                                    },
                                  ]}
                                >
                                  <Select placeholder='Please select Position Name' onChange={handlePositionChange}>
                                    {posOptions.map((pos) => (
                                      <Option value={pos.value} name={pos.label}>
                                        {pos.label}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'salary']}
                                  fieldKey={[fieldKey, 'salary']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please Enter Salary',
                                    },
                                  ]}
                                >
                                  <Input placeholder='Salary' />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'count']}
                                  fieldKey={[fieldKey, 'count']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Count',
                                    },
                                  ]}
                                >
                                  <Input placeholder='Enter Count' />
                                </Form.Item>
                                <Form.Item
                                  name={[name, 'total_cost']}
                                  fieldKey={[fieldKey, 'total_cost']}
                                  rules={[{ required: true, message: 'Enter Cost' }]}
                                >
                                  <Input placeholder='Cost' />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                              </Space>
                            ))}
                            <Form.Item>
                              <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                                Add field
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='provisions_made'
                      label='Select Qualification*'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Select Qualification',
                        },
                      ]}
                    >
                      <Radio.Group onChange={onChangeRadio} value={value}>
                        <Radio value={true}>YES</Radio>
                        <Radio value={false}>NO</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item>
                      <Form.Item
                        name='total_estimate_cost'
                        label='Total Cost'
                        labelCol={{ span: 20 }}
                        rules={[
                          {
                            required: true,
                            message: 'Total Cost',
                          },
                        ]}
                      >
                        <Input placeholder='Total Cost' />
                      </Form.Item>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='min_essential_qualification'
                      label='Subject Wise'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Subject Wise',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Subject Wise' />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='job_requirement'
                      label='Job Requirement'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Job Requirement',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Job Requirement' />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name='desired_qualification'
                      label='Desired Qualification/Specification'
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Desired Qualification/Specification',
                        },
                      ]}
                    >
                      <Input placeholder='Enter Desired Qualification/Specification' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify='space-around'>
                  <Form.Item>
                    <Space size='middle'>
                      <Link href='/admin/approvals'>
                        <Button type='secondary' htmlType='button'>
                          Back
                        </Button>
                      </Link>
                      <Button type='primary' htmlType='submit'>
                        Save
                      </Button>
                    </Space>
                  </Form.Item>
                </Row>
              </Form>
            </Box>
          </FormStyles>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default Edit;
