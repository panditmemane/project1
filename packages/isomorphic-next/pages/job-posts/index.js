import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import Head from 'next/head';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import { InputSearch } from '@iso/components/uielements/input';
import Table from '@iso/components/uielements/table';

import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import useUser from '../../src/components/auth/useUser';

const styles = {
  row: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
};

const JobPosts = () => {
  const { user } = useUser({});
  const [jobs, setJobs] = useState([]);
  const { Column } = Table;
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      // For Public API use axios directly
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/job_posting/job_posting_list/applicant/`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data =
        response &&
        response.data.length > 0 &&
        response.data.map((res) => {
          return {
            key: res.job_posting_id,
            description: res.description,
            publication_date: res.publication_date && moment(res.publication_date).format('MMMM Do, YYYY'),
            end_date: res.end_date && moment(res.end_date).format('MMMM Do, YYYY'),
            job_type: res.job_type,
            manpower_positions: res.manpower_positions,
          };
        });
      setJobs(data);
    };
    if (user && user.isLoggedIn) load();
  }, []);

  return (
    <>
      <Head>
        <title>Job Posts</title>
      </Head>
      <DashboardLayout>
        <LayoutWrapper>
          <div style={styles.row}>
            <InputSearch placeholder='Search' style={{ width: '50%', marginBottom: '10px' }} />
            <Table
              dataSource={jobs}
              onRow={(record) => {
                return {
                  onClick: () => {
                    router.push(`/job-posts/${record.key}`);
                  },
                };
              }}
            >
              <Column title='Description' dataIndex='description' key='description' />
              <Column title='Date of Opening' dataIndex='publication_date' key='publication_date' />
              <Column title='Date of Closing' dataIndex='end_date' key='end_date' />
              <Column title='Recruitment Type' dataIndex='job_type' key='job_type' />
            </Table>
          </div>
        </LayoutWrapper>
      </DashboardLayout>
    </>
  );
};

export default JobPosts;
