import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Space, Row, Col, Popconfirm, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import { useAuthState } from '../../../../src/components/auth/hook';
import PageHeader from '@iso/components/utility/pageHeader';
import useUser from '../../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';
import { initialize } from 'react-ga';

const DocumentMaster = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [documents, setDocuments] = useState();
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [docStatusFilters, setDocStatusFilters] = useState([]);
  const { Column } = Table;

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/document/docs/');
      if (!response.data.isEmpty) {
        const dataSource = response.data.map((res, index) => ({
          key: res.doc_id,
          sr_no: index + 1,
          doc_name: res.doc_name,
          doc_type: res.doc_type,
        }));
        const doc_types = response.data.map((res) => ({
          text: res.doc_type,
          value: res.doc_type,
        }));
        setDocStatusFilters(doc_types.filter((obj, id, a) => a.findIndex((t) => t.value === obj.value) === id));
        setDocuments(dataSource);
        setLoading(false);
        console.log(response.data);
      }
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onConfirmDelete = async (id) => {
    await client.delete(`/document/docs/${id}/ `);
    const data = documents.filter((document) => document.key !== id);
    setDocuments(data);
    message.success('Document Deleted Successfully');
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
        <title>Document List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Document List</PageHeader>
                <Row className='action-bar'>
                  <Col span={24}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/admin-section/document-master/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={documents}>
                        <Column title='Sr.No.' key='sr_no' dataIndex='sr_no' />
                        <Column
                          title='Document Name'
                          dataIndex='doc_name'
                          key='doc_name'
                          sorter={(a, b) => a.doc_name.length - b.doc_name.length}
                          {...getColumnSearchProps('doc_name')}
                        />
                        <Column
                          title='Document Type'
                          key='doc_type'
                          dataIndex='doc_type'
                          filters={docStatusFilters}
                          onFilter={(value, record) => record.doc_type.indexOf(value) === 0}
                        />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/admin-section/document-master/edit/${record.key}`}>
                                <a href={`/admin/admin-section/document-master/edit/${record.key}`}>
                                  <EditTwoTone />
                                </a>
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this Document?'
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

export default DocumentMaster;
