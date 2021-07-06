import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Row, Col, Badge, Space, Table, Descriptions, Layout, message } from 'antd';
import { useRouter } from 'next/router';
import moment from 'moment';
import { CloseOutlined, QuestionOutlined, CheckOutlined } from '@ant-design/icons';
import Button from '@iso/components/uielements/button';
import ContactList from '@iso/components/Contacts/ContactList';
import Scrollbar from '@iso/components/utility/customScrollBar';
import { useAuthState } from '../../../../../src/components/auth/hook';
import useUser from '../../../../../src/components/auth/useUser';
import DashboardLayout from '../../../../../containers/DashboardLayout/DashboardLayout';
import { ContactsWrapper } from '../../../../../../../shared/containers/Contacts/Contacts.styles';

const Preview = () => {
  const { Content } = Layout;
  const { client } = useAuthState();
  const router = useRouter();
  const { query } = router;
  const { user } = useUser({});
  const [initialData, setInitialData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [applicantId, setApplicantId] = useState();

  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`job_posting/applicant_list_by_job/${query.jobId}/`);
      console.log('jobId', response.data);

      const contact = response.data.map((res) => ({
        id: res.user_id,
        name: res.user_profile.name_of_applicant,
        avatar: res.user_profile.profile_photo,
        application_id: res.application_id,
      }));
      console.log('contact', contact);
      setContacts(contact);
      const applicantId = contact.find((dt) => dt.id === response.data[0].user_id).application_id;
      console.log(response.data[0].user_id);
      setApplicantId(applicantId);
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/user/public/profile_details/${query.applicantId}/`);
      console.log('applicantId', response.data);
      setInitialData(response.data);
    };
    setSelectedId(query.applicantId);

    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const changeContact = async (id) => {
    const applicantId = contacts.find((dt) => dt.id === id).application_id;
    setApplicantId(applicantId);
    setSelectedId(id);
    const response = await client.get(`/user/public/profile_details/${id}/`);
    setInitialData(response.data);
  };

  const age = (a, b) => {
    var years = a.diff(b, 'year');
    b.add(years, 'years');

    var months = a.diff(b, 'months');
    b.add(months, 'months');

    var days = a.diff(b, 'days');
    return years + ' Years ' + months + ' Months ' + days + ' Days';
  };

  const updateApplicantStatus = async (status) => {
    await client.put(`/job_posting/applicant_status/${applicantId}/`, {
      application_id: applicantId,
      status: status,
    });
    message.success('Status updated successfully');
  };

  if (!initialData) return null;

  return (
    <>
      <Head>
        <title>View Job Details</title>
      </Head>
      <DashboardLayout>
        <>
          <ContactsWrapper className='isomorphicContacts' style={{ background: 'none' }}>
            <div className='isoContactListBar'>
              <ContactList
                contacts={contacts}
                selectedId={selectedId}
                changeContact={(id) => changeContact(id)}
                deleteContact={() => {}}
              />
            </div>
            <Layout className='isoContactBoxWrapper'>
              <Row className='action-bar'>
                <Col span={24}>
                  <Row span={12} justify='end'>
                    <Space>
                      <Button
                        className='ant-btn-secondary'
                        type='button'
                        onClick={() => router.push(`/admin/manage-job-post/permanent/applicants/${query.jobId}`)}
                      >
                        Back
                      </Button>
                      <Button size='middle' type='default' className='ant-btn-secondary'>
                        View Resume
                      </Button>{' '}
                      <Button size='middle' type='danger' danger onClick={() => updateApplicantStatus('rejected')}>
                        <CloseOutlined />
                      </Button>
                      <Button size='middle' type='link' onClick={() => updateApplicantStatus('awating review')}>
                        <QuestionOutlined />
                      </Button>
                      <Button size='middle' type='primary' onClick={() => updateApplicantStatus('accepted')}>
                        <CheckOutlined />
                      </Button>
                    </Space>
                  </Row>
                </Col>
              </Row>
              <Content className='isoContactBox'>
                <Scrollbar className='contactBoxScrollbar'>
                  <Descriptions bordered stylle={{ marginBottom: 20 }} justify=''>
                    <Descriptions.Item label='Name Of Applicant' span={3}>
                      {initialData.name_of_applicant}
                    </Descriptions.Item>
                    <Descriptions.Item label='Age' span={3}>
                      <Badge
                        className='head-example'
                        style={{ backgroundColor: '#069633' }}
                        count={age(moment(), moment(initialData.date_of_birth))}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label='Specialization' span={3}>
                      <Space>
                        {initialData.education_details &&
                          initialData.education_details.map((detail) => (
                            <Badge
                              className='head-example'
                              style={{ backgroundColor: '#069633' }}
                              count={detail.specialization}
                            />
                          ))}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label='Reservation Category' span={3}>
                      <Badge
                        className='head-example'
                        style={{ backgroundColor: '#069633' }}
                        count={initialData.caste}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions bordered stylle={{ marginBottom: 20 }} layout='vertical'>
                    <Descriptions.Item label='Qualifications' span={3}>
                      <Table bordered pagination={false} size='small' dataSource={initialData.education_details}>
                        <Table.Column
                          title='Examination Passes/ Deploma/ Degree Obtained'
                          dataIndex='exam_name'
                          key='exam_name'
                        />
                        <Table.Column title='Board/ Institute' dataIndex='college_name' key='college_name' />
                        <Table.Column title='Year Of Passing' dataIndex='passing_year' key='passing_year' />
                        <Table.Column title='Class/ Division AND % of marks/ GPA' dataIndex='score' key='score' />
                        <Table.Column title='University' dataIndex='university' key='university' />
                        <Table.Column title='Subject Specialization' dataIndex='specialization' key='specialization' />
                      </Table>
                    </Descriptions.Item>

                    <Descriptions.Item label='Experience' span={3}>
                      <Table
                        bordered
                        pagination={false}
                        size='small'
                        dataSource={initialData.experiences}
                        key='employer_name'
                      >
                        <Table.Column
                          title='Name & Address of the Employer'
                          dataIndex='employer_name'
                          key='employer_name'
                        />
                        <Table.Column
                          title='Post held/Nature of Employment'
                          dataIndex='employment_type'
                          key='employment_type'
                        />
                        <Table.ColumnGroup title='Period'>
                          <Table.Column title='From' dataIndex='employed_from' key='employed_from' />
                          <Table.Column title='To' dataIndex='employed_to' key='employed_to' />
                        </Table.ColumnGroup>
                        <Table.Column title='Salary' dataIndex='salary' key='salary' />
                        <Table.Column title='Grade' dataIndex='grade' key='grade' />
                      </Table>
                    </Descriptions.Item>
                  </Descriptions>
                </Scrollbar>{' '}
              </Content>
            </Layout>
          </ContactsWrapper>{' '}
        </>
      </DashboardLayout>
    </>
  );
};

Preview.propTypes = {};

export default Preview;
