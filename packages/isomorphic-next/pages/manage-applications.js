import React, { useEffect, useState } from 'react';
import { useAuthState } from '../src/components/auth/hook';
import Table from '@iso/components/uielements/table';
import useUser from '../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../containers/DashboardLayout/DashboardLayout';
import ManageJobPostStyles from '../containers/Admin/ManageJobPost/ManageJobPost.styles';
import ListingStyles from '../styled/Listing.styles';
import { Space, Row, Col, Tag, Input, Popconfirm } from 'antd';
import { InputSearch } from '@iso/components/uielements/input';

const ManageApplications = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [jobs, setJobs] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const { Column } = Table;
  if (!user || !user.isLoggedIn) {
    return null;
  }

  useEffect(() => {
    var obj = JSON.parse(window.localStorage.getItem('authUser'));
    const load = async () => {
      const response = await client.get('/user/public/applicant_job_list/' + obj.data.user.user_id + '/');

      if (!response.data.isEmpty) {
        const dataSource = response.data.map((res) => ({
          key: res.id,
          notification_id: res.notification_id,
          description: res.description,
          date_of_application: res.date_of_application,
          date_of_closing: res.date_of_closing,
          hiring_status: res.hiring_status,
        }));
        setJobs(dataSource);
        setTableList(dataSource);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = jobs.filter((entry) => entry.description.includes(e.target.value));
      setJobs(filteredData);
    } else {
      setJobs(tableList);
    }
  };

  const onConfirmAppeal = async (id) => {
    console.log(id);
    console.log(reason);
    // await client.delete(`/job_posting/update_user_appeal_for_job_position/${id}/ `);
    // const data = jobs.filter((user) => user.key !== id);
    // setJobs(data);
    // message.success("Appeal has been made Successfully");
    setReason('');
  };

  return (
    <>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <Row>
                  <InputSearch
                    placeholder='Search'
                    style={{ width: '50%' }}
                    value={value}
                    onChange={(e) => handleSearch(e)}
                  />
                </Row>
                <ListingStyles>
                  {/* <Table dataSource={jobs} columns={columns} /> */}
                  <Row>
                    <Col span={24}>
                      <Table dataSource={jobs}>
                        <Column title='ID' dataIndex='notification_id' key='notification_id' />
                        <Column title='Description' dataIndex='description' key='description' />
                        <Column title='Date of Application' dataIndex='date_of_application' key='date_of_application' />
                        <Column title='Date of Closing' dataIndex='date_of_closing' key='date_of_closing' />
                        <Column
                          title='Hiring Status'
                          key='hiring_status'
                          render={(text, record) => (
                            <Tag
                              key={record.hiring_status}
                              color={
                                record.hiring_status == 'accepted'
                                  ? 'green'
                                  : record.hiring_status == 'received'
                                  ? 'blue'
                                  : 'red'
                              }
                            >
                              {record.hiring_status.toUpperCase()}
                            </Tag>
                          )}
                        />
                        <Column
                          title='Action'
                          render={(text, record) =>
                            record.hiring_status === 'rejected' ? (
                              <Space size='middle'>
                                <Popconfirm
                                  title={
                                    <Input
                                      type='text'
                                      placeholder='Reason for Appeal'
                                      value={reason}
                                      onChange={(e) => setReason(e.target.value)}
                                    />
                                  }
                                  onConfirm={() => onConfirmAppeal(record.key)}
                                  onCancel={() => setReason('')}
                                >
                                  <a href='#'>Appeal</a>
                                </Popconfirm>
                              </Space>
                            ) : (
                              ''
                            )
                          }
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

export default ManageApplications;
