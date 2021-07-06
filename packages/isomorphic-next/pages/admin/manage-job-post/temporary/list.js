import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import moment from 'moment';
import { CSVLink } from 'react-csv';
// Components
import { Space, Row, Col } from 'antd';
import Table from '@iso/components/uielements/table';
import Tag from '@iso/components/uielements/tag';
import Button from '@iso/components/uielements/button';
import { InputSearch } from '@iso/components/uielements/input';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { DropdownButtons, DropdownMenu, MenuItem } from '@iso/components/uielements/dropdown';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
// Hooks / API Calls
import { useAuthState } from '../../../../src/components/auth/hook';
import useUser from '../../../../src/components/auth/useUser';
import { getJobPostContractBasis } from '../../../../src/apiCalls';
// Styles
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';
// import { getServerSideData } from '../../../../containers/Admin/ManageJobPost/helpers';

// export const getServerSideProps = getServerSideData;

// export const getStaticProps = async ({ params }) => {
//   console.log('params', params);
//   const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/job_posting/job_posting_list/`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'TOKEN 1b1e0fa5309235ab56d03038eac42bae75c9755878b52694880b332234881c7a'
//     }
//   });
//   console.log('response.data1', response.data);

//   return { props: { response: response.data } };
// };

const csvHeaders = [
  { label: 'Notification ID', key: 'notificationID' },
  { label: 'Title', key: 'title' },
  { label: 'Department', key: 'department' },
  { label: 'Date of Opening', key: 'dateOfOpening' },
  { label: 'Date of Closing', key: 'dateOfClosing' },
  { label: 'Applied', key: 'applied' },
  { label: 'Status', key: 'status' },
];

const JobPostTemporary = () => {
  // console.log('response', response);
  const { client } = useAuthState();
  const { user } = useUser({});
  const router = useRouter();

  const [jobPosts, setJobPostsData] = useState();
  const [csvData, setCsvDataData] = useState({});

  const { Column } = Table;
  const DropdownButton = DropdownButtons;

  useEffect(() => {
    const load = async () => {
      const response = await getJobPostContractBasis(client);
      const filteredData = response.map((post, index) => ({
        key: index,
        notificationID: post.notification_id,
        title: post.notification_title,
        department: post.department.department ? post.department.department : '-',
        dateOfOpening: post.publication_date ? moment(post.publication_date).format('DD-MM-YYYY') : '-',
        dateOfClosing: post.end_date ? moment(post.end_date).format('DD-MM-YYYY') : '-',
        // TODO: applied value static
        applied: '344 Applications',
        // TODO: require all status and color code
        status: post.status,
      }));

      const csvFilteredData = response.map((post) => ({
        notificationID: post.notification_id,
        title: post.notification_title,
        department: post.department.department ? post.department.department : '-',
        dateOfOpening: post.publication_date ? moment(post.publication_date).format('DD-MM-YYYY') : '-',
        dateOfClosing: post.end_date ? moment(post.end_date).format('DD-MM-YYYY') : '-',
        // TODO: applied value static
        applied: '344 Applications',
        // TODO: require all status and color code
        status: post.status,
      }));

      console.log(csvFilteredData);
      setJobPostsData(filteredData);
      setCsvDataData(csvFilteredData);
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const menuClicked = (
    <DropdownMenu>
      <MenuItem key='1'>1st menu item</MenuItem>
      <MenuItem key='2'>2nd menu item</MenuItem>
      <MenuItem key='3'>3d menu item</MenuItem>
    </DropdownMenu>
  );

  return (
    <>
      <Head>
        <title>Manage Job Post (T)</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            <ListingStyles>
              <Row className='action-bar'>
                <Col span={12}>
                  <InputSearch placeholder='input search text' />
                </Col>
                <Col span={12}>
                  <Row justify='end'>
                    <Col span={12}>
                      <DropdownButton overlay={menuClicked}>Dropdown</DropdownButton>
                    </Col>
                    <Row span={12}>
                      {csvData && csvData.length > 0 && (
                        <CSVLink data={csvData} headers={csvHeaders}>
                          <Button className='ant-btn-secondary' type='button'>
                            Export to CSV
                          </Button>
                        </CSVLink>
                      )}
                      <Button type='primary' onClick={() => router.push('/admin/manage-job-post/temporary/add')}>
                        Add New
                      </Button>
                    </Row>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Table dataSource={jobPosts}>
                    <Column title='Sr.No' key='index' render={(text, record, index) => index + 1} />
                    <Column title='Notification ID' dataIndex='notificationID' key='notificationID' />
                    <Column title='Title' dataIndex='title' key='title' />
                    <Column title='Department' dataIndex='department' key='department' />
                    <Column title='Date of Opening' dataIndex='dateOfOpening' key='dateOfOpening' />
                    <Column title='Date of Closing' dataIndex='dateOfClosing' key='dateOfClosing' />
                    <Column title='Applied' dataIndex='applied' key='applied' />
                    <Column
                      title='Status'
                      key='status'
                      render={(text, record) => (
                        <Tag className={`ant-tag-${record.status}`} key={record.status}>
                          {record.status}
                        </Tag>
                      )}
                    />
                    <Column
                      title='Action'
                      key='action'
                      width='5%'
                      render={(text, record) => (
                        <Space size='middle'>
                          <a>
                            <EditTwoTone />
                          </a>
                          <a>
                            {' '}
                            <DeleteTwoTone />
                          </a>
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
