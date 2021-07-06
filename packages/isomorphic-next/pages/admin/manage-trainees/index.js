import React, { useState, useEffect, useRef } from 'react';
import Table from '@iso/components/uielements/table';
import useUser from '../../../src/components/auth/useUser';
import { useAuthState } from '../../../src/components/auth/hook';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../containers/DashboardLayout/DashboardLayout';
import ManageJobPostStyles from '../../../containers/Admin/ManageJobPost/ManageJobPost.styles';
import { Space, Row, Col, Tag, Button, Popconfirm, message, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import PageHeader from '@iso/components/utility/pageHeader';
import ListingStyles from '../../../styled/Listing.styles';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { traineeStatus, traineeStatusFilters } from '../../../src/constants';

const { Option } = Select;

const csvHeaders = [
  { label: 'Trainee Name', key: 'trainee_name' },
  { label: 'Department', key: 'division' },
  { label: 'Mentor', key: 'mentor' },
  { label: 'Email', key: 'email' },
  { label: 'Employee Start Date', key: 'emp_start_date' },
  { label: 'Employee End Date', key: 'emp_end_date' },
  { label: 'Status', key: 'status' },
];

const TraineeList = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [loading, setLoading] = useState(true);
  const [trainees, setTrainees] = useState();
  const [csvData, setCsvDataData] = useState();
  const [divisions, setDiv] = useState([]);
  const [mentors, setMentors] = useState([]);
  const searchInputRef = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const { Column } = Table;
  const router = useRouter();

  useEffect(() => {
    var obj = JSON.parse(window.localStorage.getItem('authUser'));
    const load = async () => {
      const response = await client.get('/user/trainee/');

      if (!response.data.isEmpty) {
        const dataSource = response.data.map((res, index) => ({
          key: res.trainee_id,
          sr_no: index + 1,
          trainee_name: res.trainee_name,
          division: res.division.division_name,
          division_id: res.division.division_id,
          mentor: res.mentor.mentor_name,
          mentor_id: res.mentor.mentor_id,
          email: res.email,
          emp_end_date: res.emp_end_date,
          status: res.status,
        }));

        const csvFilteredData = response.data.map((res) => ({
          trainee_name: res.trainee_name,
          division: res.division.division_name,
          mentor: res.mentor.mentor_name,
          email: res.email,
          emp_start_date: res.emp_start_date,
          emp_end_date: res.emp_end_date,
          status: res.status,
        }));
        setCsvDataData(csvFilteredData);
        setTrainees(dataSource);
        setLoading(false);
      }
    };

    const divs = async () => {
      const div = await client.get('/job_posting/division_list_and_create/');
      const dataSource1 = div.data.map((div) => ({
        text: div.division_name,
        value: div.division_id,
      }));
      setDiv(dataSource1);
    };

    const mntr = async () => {
      const mntr = await client.get('/user/mentor/');
      const dataSource2 = mntr.data.map((res) => ({
        value: res.mentor_id,
        text: res.mentor_name,
      }));
      setMentors(dataSource2);
    };

    if (user && user.isLoggedIn) {
      load();
      divs();
      mntr();
    }
  }, [user, client]);

  const onConfirmDelete = async (id) => {
    await client.delete(`/user/trainee/${id}/ `);
    const data = trainees.filter((user) => user.key !== id);
    setTrainees(data);
    message.success('Trainee Deleted Successfully');
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
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Trainee List</PageHeader>
                <Row className='action-bar'>
                  <Col span={24}>
                    <Row justify='end'>
                      <Row span={12}>
                        {csvData && csvData.length > 0 && (
                          <CSVLink data={csvData} headers={csvHeaders}>
                            <Button className='ant-btn-secondary' type='button'>
                              Export to CSV
                            </Button>
                          </CSVLink>
                        )}
                        <Button type='primary' onClick={() => router.push('/admin/manage-trainees/add')}>
                          Add New
                        </Button>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <ListingStyles>
                  {/* <Table dataSource={jobs} columns={columns} /> */}
                  <Row>
                    <Col span={24}>
                      <Table dataSource={trainees}>
                        <Column title='Sr.No' key='sr_no' dataIndex='sr_no' />
                        <Column
                          title='Department'
                          dataIndex='division'
                          key='division'
                          filters={divisions}
                          onFilter={(value, record) => record.division_id.indexOf(value) === 0}
                          // sorter={(a, b) => a.division.length - b.division.length}
                          // {...getColumnSearchProps('division')}
                        />
                        <Column
                          title='Mentor'
                          dataIndex='mentor'
                          key='mentor'
                          filters={mentors}
                          onFilter={(value, record) => record.mentor_id.indexOf(value) === 0}
                          // sorter={(a, b) => a.mentor.length - b.mentor.length}
                          // {...getColumnSearchProps('mentor')}
                        />
                        <Column
                          title='Trainee Name'
                          dataIndex='trainee_name'
                          key='trainee_name'
                          sorter={(a, b) => a.trainee_name.length - b.trainee_name.length}
                          {...getColumnSearchProps('trainee_name')}
                        />
                        <Column
                          title='Email'
                          dataIndex='email'
                          key='email'
                          sorter={(a, b) => a.email.length - b.email.length}
                          {...getColumnSearchProps('email')}
                        />
                        <Column title='Employee Till' dataIndex='emp_end_date' key='emp_end_date' />
                        <Column
                          title='Status'
                          key='status'
                          filters={traineeStatusFilters}
                          onFilter={(value, record) => record.status.indexOf(value) === 0}
                          render={(text, record) => (
                            <Tag
                              traineeStatus={[record.status]}
                              key={record.status}
                              color={
                                record.status == 'active' ? 'blue' : record.status == 'completed' ? 'green' : 'red'
                              }
                            >
                              {record.status.toUpperCase()}
                            </Tag>
                          )}
                        />
                        <Column
                          title='Action'
                          key='trainee_id'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/manage-trainees/edit?id=${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this trainee?'
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

export default TraineeList;
