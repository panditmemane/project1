import React, { useEffect, useState, useRef } from 'react';
import { useAuthState } from '../src/components/auth/hook';
import Table from '@iso/components/uielements/table';
import useUser from '../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../containers/DashboardLayout/DashboardLayout';
import ManageJobPostStyles from '../containers/Admin/ManageJobPost/ManageJobPost.styles';
import ListingStyles from '../styled/Listing.styles';
import { Space, Row, Col, Tag, Form, Button, Input, Modal, Select, message, Tooltip } from 'antd';
import { InputSearch } from '@iso/components/uielements/input';
import { SearchOutlined } from '@ant-design/icons';
import { applicantJobStatusFilters } from '../src/constants';
import PageHeader from '@iso/components/utility/pageHeader';
import moment from 'moment';

const ManageApplications = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [jobs, setJobs] = useState([]);
  const [jobsfilter, setJobsFilter] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasonMaster, setReasonMaster] = useState([]);
  const [reason, setReason] = useState(undefined);
  const searchInputRef = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState('');
  const [position, setPosition] = useState('');
  const [jobId, setJobId] = useState();
  const [startDateFilter, setStartDateFilter] = useState([]);
  const [endDateFilter, setEndDateFilter] = useState([]);

  const { Column } = Table;

  useEffect(() => {
    var obj = JSON.parse(window.localStorage.getItem('authUser'));

    const load = async () => {
      const response = await client.get('/user/public/applicant_job_list/' + obj.data.user.user_id + '/');

      if (!response.data.isEmpty) {
        const dataSource = response.data.map((res, index) => ({
          sr_no: index + 1,
          key: res.id,
          notification_id: res.notification_id,
          description: res.description,
          date_of_application: res.date_of_application,
          date_of_closing: res.date_of_closing,
          hiring_status: res.hiring_status,
        }));

        const jobs = response.data.map((res) => ({
          value: res.description,
          text: res.description,
        }));
        const startdate = response.data.map((res) => ({
          value: res.date_of_application,
          text: res.date_of_application,
        }));
        const enddate = response.data.map((res) => ({
          value: res.date_of_closing,
          text: res.date_of_closing,
        }));
        setJobsFilter(jobs.filter((obj, id, a) => a.findIndex((t) => t.value === obj.value) === id));
        setStartDateFilter(startdate.filter((obj, id, a) => a.findIndex((t) => t.value === obj.value) === id));
        setEndDateFilter(enddate.filter((obj, id, a) => a.findIndex((t) => t.value === obj.value) === id));
        setJobs(dataSource);
        setTableList(dataSource);
      }
      setLoading(false);
    };

    const loadAppealReasons = async () => {
      const response = await client.get('/job_posting/appeal_reason_master/');
      if (response.data) {
        const appealReasons = response.data.map((reason) => ({
          appeal_id: reason.appeal_id,
          appeal_reason_master: reason.appeal_reason_master,
        }));
        setReasonMaster(appealReasons);
      }
    };

    if (user && user.isLoggedIn) {
      load();
      loadAppealReasons();
    }
  }, [user, client]);

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

  const handleReason = (value, obj) => {
    setReason(obj.value);
  };

  const onConfirmAppeal = async () => {
    const response = await client.put(`/job_posting/update_user_appeal_for_job_position/${jobId}/`, {
      appeal: reason,
      reason_to_appeal: comments,
    });
    if (response.data.message === "You've already appealed for this job...") {
      message.error("You've already appealed for this job...");
      setReason(undefined);
      setModalVisible(false);
    } else {
      const data = jobs.filter((user) => user.key !== jobId);
      setJobs(data);
      message.success('Appeal has been made Successfully');
      setReason(undefined);
      setModalVisible(false);
    }
  };

  const openModal = (id, desc) => {
    setModalVisible(true);
    setJobId(id);
    setPosition(desc);
  };

  const closeModal = () => {
    setModalVisible(false);
    setReason(undefined);
    form.resetFields();
  };
  const [form] = Form.useForm();

  if (!user || !user.isLoggedIn) {
    return null;
  }

  return (
    <>
      <DashboardLayout>
        <LayoutContentWrapper>
          <Modal
            title={`Appealing for ${position}(${jobId})`}
            style={{ top: 20 }}
            visible={modalVisible}
            onOk={() => {
              form
                .validateFields()
                .then(() => {
                  form.resetFields();
                  onConfirmAppeal();
                })
                .catch((info) => {
                  console.log('Validate Failed:', info);
                });
            }}
            onCancel={closeModal}
          >
            <Form name='formStep1' form={form} scrollToFirstError>
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <Form.Item
                    name='reason'
                    labelCol={{ span: 24 }}
                    label='Reason'
                    rules={[{ required: true, message: 'Please select reason!' }]}
                  >
                    <Select style={{ width: 200 }} placeholder='Select Reason' value={reason} onChange={handleReason}>
                      {reasonMaster.map((reason) => (
                        <Select.Option value={reason.appeal_id} name={reason.appeal_reason_master}>
                          {reason.appeal_reason_master}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name='comments' label='Comments' labelCol={{ span: 24 }}>
                    <Input.TextArea
                      placeholder='Add Comments'
                      style={{ width: 350 }}
                      rows={3}
                      value={comments}
                      maxLength={200}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Applied Job List</PageHeader>
                {/* <Row>
                  <InputSearch
                    placeholder='Search'
                    style={{ width: '50%' }}
                    value={value}
                    onChange={(e) => handleSearch(e)}
                  />
                </Row> */}
                <ListingStyles>
                  {/* <Table dataSource={jobs} columns={columns} /> */}
                  <Row>
                    <Col span={24}>
                      <Table dataSource={jobs}>
                        <Column title='Sr No' dataIndex='sr_no' key='sr_no' />
                        <Column title='Job ID' dataIndex='key' key='key' />
                        <Column
                          title='Job Position'
                          dataIndex='description'
                          key='description'
                          filters={jobsfilter}
                          onFilter={(value, record) => record.description.indexOf(value) === 0}
                        />
                        <Column
                          title='Date of Application'
                          dataIndex='date_of_application'
                          key='date_of_application'
                          filters={startDateFilter}
                          onFilter={(value, record) => record.date_of_application.indexOf(value) === 0}
                          sorter={(a, b) => moment(a.date_of_application).unix() - moment(b.date_of_application).unix()}
                        />
                        <Column
                          title='Date of Closing'
                          dataIndex='date_of_closing'
                          key='date_of_closing'
                          filters={endDateFilter}
                          onFilter={(value, record) => record.date_of_closing.indexOf(value) === 0}
                          sorter={(a, b) => moment(a.date_of_closing).unix() - moment(b.date_of_closing).unix()}
                        />
                        <Column
                          title='Hiring Status'
                          key='hiring_status'
                          filters={applicantJobStatusFilters}
                          onFilter={(value, record) => record.hiring_status.indexOf(value) === 0}
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
                                <a href='#' onClick={() => openModal(record.key, record.description)}>
                                  Appeal
                                </a>
                              </Space>
                            ) : record.hiring_status === 'appealed' ? (
                              <Tooltip placement='top' title='Your appeal is in progress'>
                                <a href='#' onClick={() => openModal(record.key, record.description)} disabled>
                                  Appeal
                                </a>
                              </Tooltip>
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
