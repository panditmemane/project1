import React, { useEffect, useState } from 'react';
import { useAuthState } from '../../../../src/components/auth/hook';
import Table from '@iso/components/uielements/table';
import useUser from '../../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Head from 'next/head';
import Button from '@iso/components/uielements/button';
import { Space, Row, Col, Popconfirm, message } from 'antd';
import { useRouter } from 'next/router';
import { DropdownButtons, DropdownMenu, MenuItem } from '@iso/components/uielements/dropdown';
import { InputSearch } from '@iso/components/uielements/input';
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';
import Link from 'next/link';
import PageHeader from '@iso/components/utility/pageHeader';

const NeeriUsers = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [userlist, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableList, setTableList] = useState();
  const [value, setValue] = useState('');

  const { Column } = Table;
  const DropdownButton = DropdownButtons;

  const menuClicked = (
    <DropdownMenu>
      <MenuItem key='1'>1st menu item</MenuItem>
      <MenuItem key='2'>2nd menu item</MenuItem>
      <MenuItem key='3'>3d menu item</MenuItem>
    </DropdownMenu>
  );

  if (!user || !user.isLoggedIn) {
    return null;
  }
  const router = useRouter();
  useEffect(() => {
    const load = async () => {
      const response = await client.get('/user/public/neeri_user_personal_info/');
      const dataSource = response.data.map((res) => ({
        key: res.user_id,
        first_name: res.first_name,
        last_name: res.last_name,
        email: res.email,
        mobile_no: res.mobile_no,
        date_of_birth: res.date_of_birth,
      }));
      setUsers(dataSource);
      setTableList(dataSource);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>loading...</p>;

  const onConfirmDelete = async (id) => {
    await client.delete(`/user/public/neeri_user_personal_info/${id}/ `);
    const data = userlist.filter((user) => user.key !== id);
    setUsers(data);
    message.success('User Deleted Successfully');
  };

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = userlist.filter((entry) => entry.first_name.toLowerCase().includes(e.target.value));
      setUsers(filteredData);
    } else {
      setTableList(tableList);
    }
  };

  return (
    <>
      <Head>
        <title>NEERI Users</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            <ListingStyles>
              <PageHeader>User List</PageHeader>
              <Row className='action-bar'>
                <Col span={12}>
                  <InputSearch placeholder='Search By First Name' value={value} onChange={handleSearch} />
                </Col>
                <Col span={12}>
                  <Row justify='end'>
                    <Col span={12}>
                      <DropdownButton overlay={menuClicked}>Dropdown</DropdownButton>
                    </Col>
                    <Row span={12}>
                      <Button className='ant-btn-secondary'>Export to CSV</Button>
                      <Button type='primary' onClick={() => router.push('/admin/admin-section/neeri-users/add-user')}>
                        Add New
                      </Button>
                    </Row>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Table dataSource={userlist}>
                    <Column title='Sr.No.' key='index' render={(text, record, index) => index + 1} />
                    <Column title='First Name' dataIndex='first_name' key='first_name' />
                    <Column title='Last Name' dataIndex='last_name' key='last_name' />
                    <Column title='Email' dataIndex='email' key='email' />
                    <Column title='Mobile No' dataIndex='mobile_no' key='mobile_no' />
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
                          <Link href={`/admin/admin-section/neeri-users/edit?id=${record.key}`}>
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
          </ManageJobPostStyles>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default NeeriUsers;
