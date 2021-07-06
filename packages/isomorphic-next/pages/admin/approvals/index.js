import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Space, Row, Col, Popconfirm, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import PageHeader from '@iso/components/utility/pageHeader';
import { useAuthState } from '../../../src/components/auth/hook';
import useUser from '../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../containers/Admin/ManageJobPost/ManageJobPost.styles';
import { approveStatus, approveStatusFilters } from '../../../src/constants';

const RequirementApproval = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [posData, setPosData] = useState([]);
  const searchInputRef = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const { Column } = Table;

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/job_posting/project_requirements_list/');
      const dataSource = response.data.map((res, index) => ({
        sr_no: index + 1,
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
    if (user && user.isLoggedIn) load();
    positions();
  }, [user, client]);

  const onConfirmDelete = async (id) => {
    await client.delete(`/job_posting/delete_project_requirement/${id}/ `);
    const data = requirements.filter((requirement) => requirement.key !== id);
    setRequirements(data);
    message.success('Successfully Deleted');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    render: (text) => (searchedColumn === dataIndex ? <div>{text ? text.toString() : ''}</div> : text),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

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
                  <Col span={24}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/approvals/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={requirements}>
                        <Column title='Sr.No' key='sr_no' dataIndex='sr_no' />
                        <Column
                          title='Project No'
                          dataIndex='project_number'
                          key='project_number'
                          {...getColumnSearchProps('project_number')}
                        />
                        <Column
                          title='Project Title'
                          dataIndex='project_title'
                          key='project_title'
                          sorter={(a, b) => a.project_title.length - b.project_title.length}
                          {...getColumnSearchProps('project_title')}
                        />
                        <Column
                          title='Department'
                          dataIndex='division_name'
                          key='saldivision_nameary'
                          {...getColumnSearchProps('division_name')}
                        />
                        <Column
                          title='Zone'
                          dataIndex='zonal_lab_name'
                          key='zonal_lab_name'
                          {...getColumnSearchProps('zonal_lab_name')}
                        />
                        <Column title='Start Date' dataIndex='project_start_date' key='project_start_date' />
                        <Column title='End Date' dataIndex='project_end_date' key='project_end_date' />
                        <Column title='Cost' dataIndex='total_estimated_amount' key='total_estimated_amount' />
                        <Column
                          title='Status'
                          dataIndex='status'
                          key='status'
                          filters={approveStatusFilters}
                          onFilter={(value, record) => record.status.indexOf(value) === 0}
                          render={(text, record) => approveStatus[record.status]}
                        />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/approvals/edit/${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this approval?'
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
