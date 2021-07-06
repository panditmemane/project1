import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Space, Row, Col, Popconfirm, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Tag from '@iso/components/uielements/tag';
import Button from '@iso/components/uielements/button';
import PageHeader from '@iso/components/utility/pageHeader';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import { DropdownButtons, DropdownMenu, MenuItem } from '@iso/components/uielements/dropdown';
import { useAuthState } from '../../../../../src/components/auth/hook';
import useUser from '../../../../../src/components/auth/useUser';
import DashboardLayout from '../../../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const PositionMasterTemporary = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [positions, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const { Column } = Table;

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/job_posting/temporary_positions/');
      const dataSource = response.data.map((res, index) => ({
        ...res,
        sr_no: index + 1,
        key: res.temp_position_id,
        position_name: res.temp_position_master.position_name,
        position_display_name: res.temp_position_master.position_display_name,
        qualification_desc: res.temp_position_master.qualification_desc,
        min_age: res.temp_position_master.min_age == null ? '' : res.temp_position_master.min_age + ' + ',
        salary: res.salary,
      }));
      setPosition(dataSource);
      setLoading(false);
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onConfirmDelete = async (id) => {
    await client.delete(`/job_posting/temporary_positions/${id}/`);
    const data = positions.filter((position) => position.key !== id);
    setPosition(data);
    message.success('Position Deleted Successfully');
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
        <title>Temporary Position List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Temporary Position List</PageHeader>
                <Row className='action-bar'>
                  <Col span={24}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/admin-section/job-position-master/temporary/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={positions}>
                        <Column title='Sr.No.' key='sr_no' dataIndex='sr_no' />
                        <Column
                          title='Position Name'
                          dataIndex='position_name'
                          key='position_name'
                          sorter={(a, b) => a.position_name.length - b.position_name.length}
                          {...getColumnSearchProps('position_name')}
                        />
                        <Column
                          title='Display Name'
                          dataIndex='position_display_name'
                          key='position_display_name'
                          sorter={(a, b) => a.position_display_name.length - b.position_display_name.length}
                          {...getColumnSearchProps('position_display_name')}
                        />
                        <Column
                          title='Qualification Desc'
                          dataIndex='qualification_desc'
                          key='qualification_desc'
                          {...getColumnSearchProps('qualification_desc')}
                        />
                        <Column title='Age' dataIndex='min_age' key='min_age' {...getColumnSearchProps('min_age')} />
                        <Column title='Salary' dataIndex='salary' key='salary' {...getColumnSearchProps('salary')} />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/admin-section/job-position-master/temporary/edit/${record.key}`}>
                                <a href={`/admin/admin-section/job-position-master/temporary/edit/${record.key}`}>
                                  <EditTwoTone />
                                </a>
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this Position?'
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

export default PositionMasterTemporary;
