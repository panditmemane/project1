import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Divider, Row, Col } from 'antd';
import { EyeFilled, PhoneFilled, MessageFilled } from '@ant-design/icons';

import { StyledButton } from '../../../style/commonStyle';

const styles = {
  mainSection: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  container: {
    padding: '20px',
    background: '#fff',
    borderRadius: '4px',
    width: '100%',
  },
  row: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    display: 'flex',
    width: '100%',
    padding: '40px 20px',
  },
  iconWrapper: {
    background: '#F93A0B26 0% 0% no-repeat padding-box',
    borderRadius: 60,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#6E6E6E',
    fontSize: 14,
  },
  title: {
    color: '#01111C',
    fontSize: 20,
  },
};

const dashboardData = [
  {
    label: 'Job Post Views',
    count: '94',
    icon: (
      <EyeFilled
        style={{
          color: '#F93A0B',
          fontSize: '24px',
        }}
      />
    ),
  },
  {
    label: 'Active Job Post',
    count: '25',
    icon: (
      <MessageFilled
        style={{
          color: '#F93A0B',
          fontSize: '24px',
        }}
      />
    ),
  },
  {
    label: 'Active Applications',
    count: '874',
    icon: (
      <EyeFilled
        style={{
          color: '#F93A0B',
          fontSize: '24px',
        }}
      />
    ),
  },
  {
    label: 'Total hired till date',
    count: '2500',
    icon: (
      <EyeFilled
        style={{
          color: '#F93A0B',
          fontSize: '24px',
        }}
      />
    ),
  },
  {
    label: 'Total Job Posts',
    count: '221',
    icon: (
      <EyeFilled
        style={{
          color: '#F93A0B',
          fontSize: '24px',
        }}
      />
    ),
  },
  {
    label: 'Total Applications',
    count: '4000',
    icon: (
      <PhoneFilled
        style={{
          color: '#F93A0B',
          fontSize: '24px',
        }}
      />
    ),
  },
];

const JobPostDashboard = ({ type }) => {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.mainSection}>
        {dashboardData &&
          dashboardData.length &&
          dashboardData.map((item, index) => {
            return (
              <Fragment key={Math.random()}>
                <Col style={styles.row}>
                  <Row justify='center'>
                    <div style={styles.iconWrapper}>{item.icon}</div>
                  </Row>
                  <Row justify='center' style={styles.title}>
                    <b>{item.count}</b>
                  </Row>
                  <Row style={styles.label}>{item.label}</Row>
                </Col>
                {dashboardData && dashboardData.length !== index + 1 && (
                  <Divider type='vertical' style={{ height: 115 }} />
                )}
              </Fragment>
            );
          })}
      </div>
      <div style={styles.button}>
        <StyledButton type='primary' onClick={() => router.push(`${type}/list`)}>
          Job Posts
        </StyledButton>
        <StyledButton type='primary' onClick={() => router.push(`${type}/add`)}>
          New Notifications
        </StyledButton>
        <StyledButton type='primary' onClick={() => router.push('/admin/reports')}>
          Reports
        </StyledButton>
      </div>
    </div>
  );
};

JobPostDashboard.propTypes = {
  type: PropTypes.string.isRequired,
};

export default JobPostDashboard;
