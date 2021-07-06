import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Space, Row, Col, Popconfirm, message, Select, DatePicker } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import PageHeader from '@iso/components/utility/pageHeader';
import { InputSearch } from '@iso/components/uielements/input';
import { useAuthState } from '../../../src/components/auth/hook';
import useUser from '../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const RequirementApproval = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [value, setValue] = useState('');
  const [searchList, setSearchList] = useState();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDateLabel, setStartDateLabel] = useState('');
  const [endDateLabel, setEndDateLabel] = useState('');
  const [titleLabel, setTitleLabel] = useState('');
  const [positionLabel, setPositionLabel] = useState('');
  const [statusLabel, setStatusLabel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [posData, setPosData] = useState([]);
  const { Column } = Table;

  if (!user || !user.isLoggedIn) {
    return null;
  }

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/job_posting/project_requirements_list/');
      console.log(response);
      const dataSource = response.data.map((res) => ({
        key: res.id,
        project_number: res.project_number,
        project_title: res.project_title,
        division_name: res.division_name.division_name,
        zonal_lab_name: res.zonal_lab.zonal_lab_name,
        project_start_date: res.project_start_date,
        project_end_date: res.project_end_date,
        total_estimated_amount: res.total_estimated_amount,
        status: res.status,
      }));
      setSearchList(dataSource);
      setRequirements(dataSource);
      setLoading(false);
    };
    const positions = async () => {
      const pos = await client.get('/job_posting/temporary_positions/');
      const dataSource1 = pos.data.map((pos) => ({
        value: pos.position_name,
        label: pos.position_id,
      }));
      setPosData(dataSource1);
    };
    load();
    positions();
  }, []);

  const onConfirmDelete = async (id) => {
    await client.delete(`/job_posting/delete_project_requirement/${id}/ `);
    const data = requirements.filter((requirement) => requirement.key !== id);
    setSearchList(dataSource);
    setRequirements(data);
    message.success('Successfully Deleted');
  };

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = requirements.filter(
        (entry) =>
          entry.project_title.toLowerCase().includes(e.target.value) ||
          entry.division_name.toLowerCase().includes(e.target.value) ||
          entry.zonal_lab_name.toLowerCase().includes(e.target.value)
      );
      setRequirements(filteredData);
    } else {
      setRequirements(searchList);
    }
  };

  const handleFilter = async () => {
    const res = await client.get(`/job_posting/filter_temporary_positions/?project_title=${titleLabel}
    &project_start_date=${startDateLabel}&project_end_date=${endDateLabel}&status=${statusLabel}&position_name=${positionLabel}`);
    console.log(res);
    const dataSource = res.data.map((res) => ({
      key: res.id,
      project_title: res.project_title,
      project_start_date: res.project_start_date,
      project_end_date: res.project_end_date,
      status: res.status,
      // position_name:res.manpower_position.position_name
    }));
    setRequirements(dataSource);
    setSearchList(dataSource);
  };

  const handleTitleChange = (value, obj) => {
    setTitleLabel(obj.name);
  };

  const handleStartChange = (value, obj) => {
    setStartDateLabel(obj.name);
    handleFilter();
  };

  const handleEndChange = (value, obj) => {
    setEndDateLabel(obj.name);
    handleFilter();
  };

  const handleStatusChange = (value, obj) => {
    setStatusLabel(obj.name);
    handleFilter();
  };

  // const handlePositionChange = (value, obj) => {
  //   setPositionLabel(obj.name);
  //   const PosObj = { temp_position_id: value, position_name: obj.children}
  //   handleFilter(PosObj);
  // };

  return (
    <>
      <Head>
        <title>Approval List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Approval List</PageHeader>
                <Row className='action-bar'>
                  <Col span={12}>
                    <InputSearch
                      placeholder='input search text'
                      style={{ width: '100%' }}
                      value={value}
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/approvals/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <Row className='action-bar' justify='space-between'>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Title' onChange={handleTitleChange}>
                      {requirements.length > 0
                        ? requirements.map((title) => (
                            <Option value={title.id} name={title.project_title}>
                              {title.project_title}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  {/* <Col span={4}>
                  <Select placeholder='Please select Position Name' onChange={handlePositionChange}>
                                    {posData.map((pos) => (
                                      <Option value={pos.value} name={pos.salary}>{pos.label}</Option>
                                    ))}
                                  </Select>
                  </Col> */}
                  <Col span={4}>
                    <Select placeholder='Select Status Type' onChange={handleStatusChange}>
                      <Option value='cancel'>CANCEL</Option>
                      <Option value='draft'>DRAFT</Option>
                      <Option value='lock'>LOCK</Option>
                      <Option value='reject'>REJECT</Option>
                      <Option value='submit'>SUBMIT</Option>
                      <Option value='suspended'>SUSPENDED</Option>
                    </Select>
                  </Col>
                  <Col span={4}>
                    <DatePicker
                      value={startDate}
                      placeholder='Approval Start Date'
                      format='YYYY-MM-DD'
                      onChange={handleStartChange}
                    />
                  </Col>
                  <Col span={4}>
                    <DatePicker
                      value={endDate}
                      placeholder='Approval End Date'
                      format='YYYY-MM-DD'
                      onChange={handleEndChange}
                    />
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={requirements}>
                        <Column title='Sr.No' key='index' render={(text, record, index) => index + 1} />
                        <Column title='Project No' dataIndex='project_number' key='project_number' />
                        <Column title='Project Title' dataIndex='project_title' key='project_title' />
                        <Column title='Name Of Department' dataIndex='division_name' key='saldivision_nameary' />
                        <Column title='Zonal Lab' dataIndex='zonal_lab_name' key='zonal_lab_name' />
                        <Column title='Start Date' dataIndex='project_start_date' key='project_start_date' />
                        <Column title='End Date' dataIndex='project_end_date' key='project_end_date' />
                        <Column title='Cost' dataIndex='total_estimated_amount' key='total_estimated_amount' />
                        <Column title='Status' dataIndex='status' key='status' />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/approvals/edit?id=${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this task?'
                                onConfirm={() => onConfirmDelete(record.key)}
                                onCancel={() => {}}
                              >
                                <a href='#'>
                                  <DeleteTwoTone />
                                </a>
                              </Popconfirm>
                            </Space>
                          )}
                        />
                      </Table>
                    </Col>
                  </Row>
                </ListingStyles>
              </Space>
            )}
          </ManageJobPostStyles>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default RequirementApproval;
