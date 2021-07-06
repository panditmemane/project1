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

const InformationMaster = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [searchList, setSearchList] = useState();
  const [value, setValue] = useState('');
  const [informations, setInformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Column } = Table;

  if (!user || !user.isLoggedIn) {
    return null;
  }

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/document/info/');
      if (!response.data.isEmpty) {
        const dataSource = response.data.map((res) => ({
          key: res.info_id,
          info_name: res.info_name,
          info_type: res.info_type,
        }));
        setSearchList(dataSource);
        setInformations(dataSource);
        setLoading(false);
      }
    };
    load();
  }, []);

  const onConfirmDelete = async (id) => {
    await client.delete(`/document/info/${id}/ `);
    const data = informations.filter((information) => information.key !== id);
    setSearchList(data);
    setInformations(data);
    message.success('Information Deleted Successfully');
  };

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = informations.filter(
        (entry) =>
          entry.info_name.toLowerCase().includes(e.target.value) ||
          entry.info_type.toLowerCase().includes(e.target.value)
      );
      setInformations(filteredData);
    } else {
      setInformations(searchList);
    }
  };

  return (
    <>
      <Head>
        <title>Information List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Information List</PageHeader>
                <Row className='action-bar'>
                  <Col span={12}>
                    <InputSearch
                      placeholder='Search Information & Type'
                      style={{ width: '100%' }}
                      value={value}
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/admin-section/information-master/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={informations}>
                        <Column title='Sr.No.' key='index' render={(text, record, index) => index + 1} />
                        <Column title='Information Name' dataIndex='info_name' key='info_name' />
                        <Column title='Information Type' dataIndex='info_type' key='info_type' />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/admin-section/information-master/edit?id=${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this Information?'
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

export default InformationMaster;
