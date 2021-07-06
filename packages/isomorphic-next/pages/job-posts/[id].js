import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import moment from 'moment';
import draftToHtml from 'draftjs-to-html';
// Components
import { Descriptions, Typography, Divider } from 'antd';
import Box from '@iso/components/utility/box';
import Table from '@iso/components/uielements/table';
import Button from '@iso/ui/Antd/Button/Button';
import PageHeader from '@iso/components/utility/pageHeader';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
// Hooks / API Calls / Helper functions
import useUser from '../../src/components/auth/useUser';
import { createMarkup } from '../../src/helper';
// Styles
import JobPostsStyles from '../../src/components/job-posts/JobPosts.styles';
import { jobTypes } from '../../src/constants';

const styles = {
  row: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
};

const ViewJobPosts = () => {
  const { user } = useUser({});
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { Title } = Typography;

  const [positions, setPositions] = useState([]);
  const [jobPostDetails, setJobPostDetails] = useState(null);

  const columns = [
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Age Limit',
      dataIndex: 'age_limit',
      key: 'age_limit',
    },
    {
      title: 'Qualifications',
      dataIndex: 'qualification',
      key: 'qualification',
      render: (qualification) => (
        <>
          {qualification.map((v) => {
            return <div key={v}>{v.qualification}</div>;
          })}
        </>
      ),
    },
    {
      title: 'Salary Information',
      dataIndex: 'monthly_emolements',
      key: 'monthly_emolements',
    },
  ];

  useEffect(() => {
    const data = [];
    const load = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/job_posting/applicant/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      response &&
        response.data.manpower_positions.map((res) => {
          data.push({
            key: res.id,
            position: res.position,
            age_limit: res.min_age && res.max_age && `${res.min_age}-${res.max_age}`,
            qualification: res.qualification,
            monthly_emolements: res.monthly_emolements,
          });
        });
      setJobPostDetails(response.data);
      setPositions(data);
    };
    if (user && user.isLoggedIn) load();
  }, [user]);

  if (!jobPostDetails) return null;

  return (
    <>
      <Head>
        <title>Job Post Details</title>
      </Head>
      <JobPostsStyles>
        <DashboardLayout>
          <LayoutWrapper>
            <PageHeader>Job Post Details</PageHeader>
            <Box>
              <Descriptions bordered stylle={{ marginBottom: 20 }}>
                <Descriptions.Item label='Notification ID' span={3}>
                  {jobPostDetails.notification_id}
                </Descriptions.Item>
                <Descriptions.Item label='Notification Title' span={3}>
                  {jobPostDetails.notification_title}
                </Descriptions.Item>
                <Descriptions.Item label='Recruitment type' span={2}>
                  {jobTypes[jobPostDetails.job_type]}
                </Descriptions.Item>
                <Descriptions.Item label='Divison / Zonal' span={2}>
                  {jobPostDetails.division.division_name} / {jobPostDetails.zonal_lab.zonal_lab_name}
                </Descriptions.Item>
                <Descriptions.Item label='Opening Date' span={2}>
                  {moment(jobPostDetails.publication_date).format('DD-MM-YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label='Closing Date' span={2}>
                  {moment(jobPostDetails.end_date).format('DD-MM-YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Box>
            <Box>
              <div
                className='isoDescription'
                dangerouslySetInnerHTML={createMarkup(draftToHtml(JSON.parse(jobPostDetails.pre_ad_description)))}
              />
              <Divider />
              <Title level={4}>Positions</Title>
              <Table
                bordered
                dataSource={positions}
                columns={columns}
                rowSelection={{ type: 'checkbox' }}
                pagination={false}
              />
              <Divider />
              <div
                className='isoDescription'
                dangerouslySetInnerHTML={createMarkup(draftToHtml(JSON.parse(jobPostDetails.post_ad_description)))}
              />
              <Divider />
              <div style={styles.button}>
                <Button type='primary' shape='round'>
                  Apply for Job Post
                </Button>
                <Button
                  type='default'
                  shape='round'
                  style={{ marginLeft: '10px' }}
                  onClick={() => {
                    router.push({
                      pathname: '/job-posts',
                    });
                  }}
                >
                  Go Back
                </Button>
              </div>
            </Box>
          </LayoutWrapper>
        </DashboardLayout>
      </JobPostsStyles>
    </>
  );
};

export default ViewJobPosts;
