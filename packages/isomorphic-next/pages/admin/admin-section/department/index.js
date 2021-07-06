import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Space, Row, Col, Popconfirm, message } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import { InputSearch } from '@iso/components/uielements/input';
import { useAuthState } from '../../../../src/components/auth/hook';
import PageHeader from '@iso/components/utility/pageHeader';
import useUser from '../../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const Department = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [value, setValue] = useState('');
  const [searchList, setSearchList] = useState();
  const [department, setDepartment] = useState();
  const [loading, setLoading] = useState(true);
  const { Column } = Table;

  if (!user || !user.isLoggedIn) {
    return null;
  }

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/job_posting/division_list_and_create/');
      if (!response.data.isEmpty) {
        const dataSource = response.data.map((res) => ({
          key: res.division_id,
          division_name: res.division_name,
        }));
        console.log(dataSource);
        setSearchList(dataSource);
        setDepartment(dataSource);
        setLoading(false);
      }
    };
    load();
  }, []);

  const onConfirmDelete = async (id) => {
    await client.delete(`/job_posting/division/${id}/ `);
    const data = department.filter((document) => document.key !== id);
    setSearchList(data);
    setDepartment(data);
    message.success('Department Deleted Successfully');
  };

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = department.filter((entry) => entry.division_name.toLowerCase().includes(e.target.value));
      setDepartment(filteredData);
    } else {
      setDepartment(searchList);
    }
  };

  return (
    <>
      <Head>
        <title>Department List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Department List</PageHeader>
                <Row className='action-bar'>
                  <Col span={12}>
                    <InputSearch
                      placeholder='Search Department'
                      style={{ width: '100%' }}
                      value={value}
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/admin-section/department/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={department}>
                        <Column title='Sr.No.' key='index' render={(text, record, index) => index + 1} />
                        <Column title='Department Name' dataIndex='division_name' key='division_name' />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/admin-section/department/edit?id=${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this Department?'
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

export default Department;
