import React, { useEffect, useState, useRef } from 'react';
import { useAuthState } from '../../../../src/components/auth/hook';
import Table from '@iso/components/uielements/table';
import useUser from '../../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Head from 'next/head';
import Button from '@iso/components/uielements/button';
import { Space, Row, Col, Popconfirm, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { DropdownMenu, MenuItem } from '@iso/components/uielements/dropdown';
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';
import Link from 'next/link';
import PageHeader from '@iso/components/utility/pageHeader';

const menuClicked = (
  <DropdownMenu>
    <MenuItem key='1'>1st menu item</MenuItem>
    <MenuItem key='2'>2nd menu item</MenuItem>
    <MenuItem key='3'>3d menu item</MenuItem>
  </DropdownMenu>
);

const NeeriUsers = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const router = useRouter();
  const [userlist, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const { Column } = Table;

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/user/public/neeri_user_personal_info/');
      const dataSource = response.data.map((res, index) => ({
        key: res.user_id,
        sr_no: index + 1,
        first_name: res.first_name,
        last_name: res.last_name,
        email: res.email,
        mobile_no: res.mobile_no,
        date_of_birth: res.date_of_birth,
      }));
      setUsers(dataSource);
      setLoading(false);
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onConfirmDelete = async (id) => {
    await client.delete(`/user/public/neeri_user_personal_info/${id}/ `);
    const data = userlist.filter((user) => user.key !== id);
    setUsers(data);
    message.success('User Deleted Successfully');
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
        <title>NEERI Users</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ListingStyles>
                <PageHeader>User List</PageHeader>
                <Row className='action-bar'>
                  <Col span={24}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Button
                          type='primary'
                          onClick={() => router.push('/admin/admin-section/neeri-users-master/add-user')}
                        >
                          Add New
                        </Button>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Table dataSource={userlist}>
                      <Column title='Sr.No.' key='sr_no' dataIndex='sr_no' />
                      <Column
                        title='First Name'
                        dataIndex='first_name'
                        key='first_name'
                        sorter={(a, b) => a.first_name.length - b.first_name.length}
                        {...getColumnSearchProps('first_name')}
                      />
                      <Column
                        title='Last Name'
                        dataIndex='last_name'
                        key='last_name'
                        sorter={(a, b) => a.last_name.length - b.last_name.length}
                        {...getColumnSearchProps('last_name')}
                      />
                      <Column
                        title='Email'
                        dataIndex='email'
                        key='email'
                        sorter={(a, b) => a.email.length - b.email.length}
                        {...getColumnSearchProps('email')}
                      />
                      <Column
                        title='Mobile No'
                        dataIndex='mobile_no'
                        key='mobile_no'
                        sorter={(a, b) => a.mobile_no - b.mobile_no}
                      />
                      <Column title='Date of Birth' dataIndex='date_of_birth' key='date_of_birth' />
                      {/* <Column title="Applied" dataIndex="applied" key="applied" />
                      <Column
                        title="Status"
                        key="status"
                        render={(text, record) => (
                          <Tag color="blue" key={record.status}>
                            {record.status}
                          </Tag>
                        )}
                      /> */}
                      <Column
                        title='Action'
                        key='user_id'
                        width='5%'
                        render={(text, record) => (
                          <Space size='middle'>
                            <Link href={`/admin/admin-section/neeri-users-master/edit?id=${record.key}`}>
                              <EditTwoTone />
                            </Link>
                            <Popconfirm
                              title='Are you sure to delete this User?'
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
            )}
          </ManageJobPostStyles>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default NeeriUsers;
