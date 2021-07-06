import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import moment from 'moment';
import Link from 'next/link';
import { CSVLink } from 'react-csv';
// Components
import { Space, Row, Col, Input, message, Popconfirm, Typography } from 'antd';
import Table from '@iso/components/uielements/table';
import Tag from '@iso/components/uielements/tag';
import Button from '@iso/components/uielements/button';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import { SearchOutlined } from '@ant-design/icons';
// Hooks / API Calls
import { useAuthState } from '../../../../src/components/auth/hook';
import useUser from '../../../../src/components/auth/useUser';
import { deleteJobPost, getJobPostContractBasis } from '../../../../src/apiCalls';
import { jobStatus, jobStatusFilters } from '../../../../src/constants';
// Styles
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

import { JOB_POSTING_T, APPLICATION_SCRUTINY } from '../../../../static/constants/userRoles';

const csvHeaders = [
  { label: 'Notification ID', key: 'notificationID' },
  { label: 'Title', key: 'title' },
  { label: 'Date of Opening', key: 'dateOfOpening' },
  { label: 'Date of Closing', key: 'dateOfClosing' },
  { label: 'Applied', key: 'applied' },
  { label: 'Status', key: 'status' },
];

const JobPostTemporary = () => {
  const { client } = useAuthState();
  const { user, roles } = useUser({});
  const userRole = roles && roles.length ? roles : '';
  const router = useRouter();

  const searchInputRef = useRef(null);

  const [jobPosts, setJobPostsData] = useState();
  const [csvData, setCsvDataData] = useState({});
  const [searchedColumn, setSearchedColumn] = useState('');

  const { Title } = Typography;
  const { Column } = Table;

  const getJobPostList = useCallback(async () => {
    const response = await getJobPostContractBasis(client);
    const filteredData = response.map((post, index) => ({
      key: index,
      jobPostID: post.job_posting_id,
      notificationID: post.notification_id,
      title: post.notification_title,
      dateOfOpening: post.publication_date ? moment(post.publication_date).format('DD-MM-YYYY') : '-',
      dateOfClosing: post.end_date ? moment(post.end_date).format('DD-MM-YYYY') : '-',
      applied: post.applied_applicants,
      // TODO: require all status and color code
      status: post.status,
    }));

    const csvFilteredData = response.map((post) => ({
      notificationID: post.notification_id,
      title: post.notification_title,
      dateOfOpening: post.publication_date ? moment(post.publication_date).format('DD-MM-YYYY') : '-',
      dateOfClosing: post.end_date ? moment(post.end_date).format('DD-MM-YYYY') : '-',
      applied: post.applied_applicants,
      // TODO: require all status and color code
      status: post.status,
    }));

    setJobPostsData(filteredData);
    setCsvDataData(csvFilteredData);
  }, []);

  useEffect(() => {
    if (user && user.isLoggedIn) getJobPostList();
  }, [user, client]);

  const deleteJobPostHandler = async (id) => {
    console.log(id);
    const formRequest = {
      is_deleted: true,
    };
    const formResponse = await deleteJobPost(client, formRequest, id);
    console.log(formResponse);

    if (formResponse.is_deleted) {
      message.success(`Job post deleted successfully.`);
      getJobPostList();
    }
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
    render: (text) =>
      searchedColumn === dataIndex ? (
        <div>{dataIndex === 'title' || 'notificationID' ? <a>{text.toString()}</a> : text.toString()}</div>
      ) : (
        <div>{dataIndex === 'title' || 'notificationID' ? <a>{text.toString()}</a> : text}</div>
      ),
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
        <title>Manage Jobs (Temporary Jobs)</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            <ListingStyles>
              <Row className='action-bar'>
                <Col span={12}>
                  <Title level={3} type='primary'>
                    Manage Jobs (Temporary Jobs)
                  </Title>
                </Col>
                <Col span={12}>
                  <Row justify='end'>
                    <Col span={12}>{/* <DropdownButton overlay={menuClicked}>Dropdown</DropdownButton> */}</Col>
                    <Row span={12}>
                      {csvData && csvData.length > 0 && (
                        <CSVLink data={csvData} headers={csvHeaders}>
                          <Button className='ant-btn-secondary' type='button'>
                            Export to CSV
                          </Button>
                        </CSVLink>
                      )}
                      {[JOB_POSTING_T].some((r) => userRole.indexOf(r) >= 0) && (
                        <Button type='primary' onClick={() => router.push('/admin/manage-job-post/temporary/add')}>
                          Add New
                        </Button>
                      )}
                    </Row>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Table dataSource={jobPosts}>
                    <Column
                      title='Sr.No'
                      key='key'
                      dataIndex='key'
                      width='8%'
                      sorter={(a, b) => a.key - b.key}
                      render={(text, record) => record.key + 1}
                    />
                    <Column
                      title='Notification ID'
                      dataIndex='notificationID'
                      key='notificationID'
                      width='20%'
                      sorter={(a, b) => a.notificationID.length - b.notificationID.length}
                      {...getColumnSearchProps('notificationID')}
                      onCell={(record) => {
                        return {
                          onClick: () => {
                            router.push(`/admin/manage-job-post/details/${record.jobPostID}`);
                          },
                        };
                      }}
                    />
                    <Column
                      title='Title'
                      dataIndex='title'
                      key='title'
                      width='35%'
                      sorter={(a, b) => a.title.length - b.title.length}
                      // render={(text, record) => <a>{record.title}</a>}
                      {...getColumnSearchProps('title')}
                      onCell={(record) => {
                        return {
                          onClick: () => {
                            router.push(`/admin/manage-job-post/details/${record.jobPostID}`);
                          },
                        };
                      }}
                    />
                    <Column title='Date of Opening' dataIndex='dateOfOpening' key='dateOfOpening' width='140px' />
                    <Column title='Date of Closing' dataIndex='dateOfClosing' key='dateOfClosing' width='140px' />
                    <Column title='Applied' dataIndex='applied' key='applied' />
                    <Column
                      title='Status'
                      key='status'
                      filters={jobStatusFilters}
                      onFilter={(value, record) => record.status.indexOf(value) === 0}
                      render={(text, record) => (
                        <Tag className={`ant-tag-${record.status}`} key={record.status}>
                          {jobStatus[record.status]}
                        </Tag>
                      )}
                    />
                    <Column
                      title='Action'
                      key='action'
                      width='5%'
                      render={(text, record) => (
                        <Space size='small'>
                          {[JOB_POSTING_T].some((r) => userRole.indexOf(r) >= 0) && (
                            <Link href={`/admin/manage-job-post/temporary/edit/${record.jobPostID}`}>
                              <a href={`/admin/manage-job-post/temporary/edit/${record.jobPostID}`}>
                                <EditTwoTone />
                              </a>
                            </Link>
                          )}
                          {[JOB_POSTING_T].some((r) => userRole.indexOf(r) >= 0) && (
                            <Popconfirm
                              title='Are you sure delete this task?'
                              okText='Yes'
                              cancelText='No'
                              onConfirm={() => deleteJobPostHandler(record.jobPostID)}
                            >
                              <DeleteTwoTone />
                            </Popconfirm>
                          )}
                          {[APPLICATION_SCRUTINY].some((r) => userRole.indexOf(r) >= 0) && (
                            <Button
                              type='text'
                              onClick={() => {
                                router.push(`/admin/manage-job-post/applicants/${record.jobPostID}`);
                              }}
                            >
                              Applicants
                            </Button>
                          )}
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

JobPostTemporary.propTypes = {
  response: PropTypes.arrayOf(PropTypes.object),
};

JobPostTemporary.defaultProps = {
  response: [],
};

export default JobPostTemporary;
