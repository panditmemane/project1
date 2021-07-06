import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Row, Col } from 'antd';
import Box from '@iso/components/utility/box';
import Table from '@iso/components/uielements/table';
import Button from '@iso/ui/Antd/Button/Button';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';

import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import useUser from '../../src/components/auth/useUser';

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

  const [positions, setPositions] = useState([]);
  const [jobPostDetails, setJobPostDetails] = useState([]);

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
        response.data &&
        response.data.manpower_positions &&
        response.data.manpower_positions.length &&
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
  }, []);

  return (
    <>
      <Head>
        <title>View Job Post</title>
      </Head>
      <DashboardLayout>
        <LayoutWrapper>
          <Box>
            <Row gutter={[16, 12]}>
              <Col span={24}>
                <b>{jobPostDetails.job_posting_id}</b>
              </Col>
              <Col span={8}>
                <b>Recruitment type:</b> {jobPostDetails.job_type}
              </Col>
              <Col span={8}>
                <b>Start Date:</b> {jobPostDetails.publication_date}
              </Col>
              <Col span={8}>
                <b>End Date:</b> {jobPostDetails.end_date}
              </Col>
            </Row>
          </Box>
          <Box>
            <p className='isoDescription'>{jobPostDetails.description}</p>
            <Table dataSource={positions} columns={columns} rowSelection={{ type: 'checkbox' }} />
            <p>
              TBD: B. Selection Process A Selection Committee of the following composition (minimum) would be
              constituted by the Head of the local Institution for selection of the candidate/s: Selection Committee for
              ProIect Assistants / Associates 1) Dean R&D or nominee 2) Dean R&D or nominee 3) Dean R&D or nominee 4)
              Dean R&D or nominee Selection Committee for Project Scientists / Coordinator / Manager 1) Dean R&D or
              nominee 2) Dean R&D or nominee 3) Dean R&D or nominee 4) Dean R&D or nominee C. Service conditions of
              Scientific / Technical manpower (i) DA & CCA: Scientific / Technical Manpower in projects are not entitled
              to DA & CCA. (ii) House Rent Allowance (HRA)· HRA Is allowed to all categories, except for Project
              Investigator (Pl) / Project Coordinators in Non-Governmental I Voluntary Organizations (NGONO) I Project
              Manager as per Central Government norms applicable in the city/location where they are working. The
              percentage required for calculating HRA will be based on the remuneration. (iii) Medical Benefits: The
              Scientific I Technical manpower will be entitled for medical benefits as applicable in the implementing
              institution (iv) Leave and other entitlements The Scientific/ Technical manpower are entitled to leave as
              per rules of the host institution Maternity leave as per the Govt. of India instructions issued from time
              to time would be available to all categories. The travel entitlement is as per Institute norms. (v) Bonus,
              Gratuity & Leave Travel Concession: The Scientific/ Technical manpower will not be entitled to these
              allowances.
            </p>
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
    </>
  );
};

export default ViewJobPosts;
