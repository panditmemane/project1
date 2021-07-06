import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Space, Row, Col, Popconfirm, message } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import { InputSearch } from '@iso/components/uielements/input';
import PageHeader from '@iso/components/utility/pageHeader';
import { useAuthState } from '../../../../src/components/auth/hook';
import useUser from '../../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const QualificationMaster = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [qualifications, setQualification] = useState([]);
  const [searchList, setSearchList] = useState();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const { Column } = Table;

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/job_posting/qualification_list/');
      const dataSource = response.data.map((res) => ({
        key: res.qualification_id,
        qualification: res.qualification,
        short_code: res.short_code,
      }));
      setQualification(dataSource);
      setSearchList(dataSource);
      setLoading(false);
    };
    load();
  }, []);

  const onConfirmDelete = async (id) => {
    await client.delete(`/job_posting/delete_qualification/${id}/ `);
    const data = qualifications.filter((qualification) => qualification.key !== id);
    setQualification(data);
    setSearchList(data);
    message.success('Qualification Deleted Successfully');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = qualifications.filter(
        (entry) =>
          entry.qualification.toLowerCase().includes(e.target.value) ||
          entry.short_code.toLowerCase().includes(e.target.value)
      );
      setQualification(filteredData);
    } else {
      setQualification(searchList);
    }
  };

  return (
    <>
      <Head>
        <title>Qualification List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Qualification List</PageHeader>
                <Row className='action-bar'>
                  <Col span={12}>
                    <InputSearch
                      placeholder='Search Qualification'
                      style={{ width: '100%' }}
                      value={value}
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/admin-section/qualification-master/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={qualifications}>
                        <Column title='Sr.No' key='index' render={(text, record, index) => index + 1} />
                        <Column title='Qualification' dataIndex='qualification' key='qualification' />
                        <Column title='Short Code' dataIndex='short_code' key='short_code' />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/admin-section/qualification-master/edit?id=${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this Qualification?'
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

export default QualificationMaster;
