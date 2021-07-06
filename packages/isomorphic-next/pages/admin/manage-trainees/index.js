import React, { useState, useEffect } from 'react';
import Table from '@iso/components/uielements/table';
import useUser from '../../../src/components/auth/useUser';
import { useAuthState } from '../../../src/components/auth/hook';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../containers/DashboardLayout/DashboardLayout';
import ManageJobPostStyles from '../../../containers/Admin/ManageJobPost/ManageJobPost.styles';
import { Space, Row, Col, Tag, Button, Popconfirm, message } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { InputSearch } from '@iso/components/uielements/input';
import PageHeader from '@iso/components/utility/pageHeader';
import ListingStyles from '../../../styled/Listing.styles';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DropdownButtons, DropdownMenu, MenuItem } from '@iso/components/uielements/dropdown';
import { CSVLink } from 'react-csv';
import { Select, DatePicker } from 'antd';

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
  const [tableList, setTableList] = useState();
  const [value, setValue] = useState('');
  const [csvData, setCsvData] = useState();
  const [division, setDiv] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [divLabel, setDivLabel] = useState('');
  const [mentorLabel, setMntrLabel] = useState('');

  const { Column } = Table;
  const router = useRouter();
  const DropdownButton = DropdownButtons;
  const menuClicked = (
    <DropdownMenu>
      <MenuItem key='1'>1st menu item</MenuItem>
      <MenuItem key='2'>2nd menu item</MenuItem>
      <MenuItem key='3'>3d menu item</MenuItem>
    </DropdownMenu>
  );

  useEffect(() => {
    var obj = JSON.parse(window.localStorage.getItem('authUser'));
    const load = async () => {
      const response = await client.get('/user/trainee/');

      if (!response.data.isEmpty) {
        const dataSource = response.data.map((res) => ({
          key: res.trainee_id,
          trainee_name: res.trainee_name,
          division: res.division.division_name,
          division_id: res.division.division_id,
          mentor: res.mentor.mentor_name,
          email: res.email,
          emp_end_date: res.emp_end_date,
          status: res.status,
        }));

        const csvData = response.data.map((res) => ({
          trainee_name: res.trainee_name,
          division: res.division.division_name,
          mentor: res.mentor.mentor_name,
          email: res.email,
          emp_start_date: res.emp_start_date,
          emp_end_date: res.emp_end_date,
          status: res.status,
        }));
        setCsvData(csvData);
        setTrainees(dataSource);
        setTableList(dataSource);
        setLoading(false);
      }
    };

    const divs = async () => {
      const div = await client.get('/job_posting/division_list_and_create/');
      const dataSource1 = div.data.map((div) => ({
        division_name: div.division_name,
        division_id: div.division_id,
      }));
      setDiv(dataSource1);
    };

    const mntr = async () => {
      const mntr = await client.get('/user/mentor/');
      const dataSource2 = mntr.data.map((res) => ({
        value: res.mentor_id,
        label: res.mentor_name,
      }));
      setMentors(dataSource2);
    };

    load();
    divs();
    mntr();
  }, []);

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = trainees.filter(
        (entry) =>
          entry.trainee_name.toLowerCase().includes(e.target.value) ||
          entry.division.toLowerCase().includes(e.target.value) ||
          entry.mentor.toLowerCase().includes(e.target.value)
      );
      setTrainees(filteredData);
    } else {
      setTrainees(tableList);
    }
  };

  const onConfirmDelete = async (id) => {
    await client.delete(`/user/trainee/${id}/ `);
    const data = trainees.filter((user) => user.key !== id);
    setTrainees(data);
    setTableList(data);
    message.success('Trainee Deleted Successfully');
  };

  const handleFilter = async () => {
    const res = await client.get(`/user/filter_trainee/?division__division_name=${divLabel}
    &mentor__mentor_name=${mentorLabel}`);
    console.log(res);
    const dataSource = res.data.map((res) => ({
      key: res.trainee_id,
      trainee_name: res.trainee_name,
      division: res.division.division_name,
      division_id: res.division.division_id,
      mentor: res.mentor.mentor_name,
      email: res.email,
      emp_end_date: res.emp_end_date,
      status: res.status,
    }));
    setTrainees(dataSource);
    setTableList(dataSource);
  };

  const handleDivChange = (value, obj) => {
    setDivLabel(obj.name);
  };

  const handleMentorChange = (value, obj) => {
    setMntrLabel(obj.name);
    handleFilter();
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
                  <Col span={12}>
                    <InputSearch
                      placeholder='Search By Name'
                      style={{ width: '100%' }}
                      value={value}
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Col span={12}>
                        <DropdownButton overlay={menuClicked}>Dropdown</DropdownButton>
                      </Col>
                      <Row span={12}>
                        {csvData && csvData.length > 0 && (
                          <CSVLink data={csvData} headers={csvHeaders} filename='trainees.csv'>
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
                <Row className='action-bar' justify='space-between'>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Department' onChange={handleDivChange}>
                      {division.length > 0
                        ? division.map((div) => (
                            <Option value={div.division_id} name={div.division_name}>
                              {div.division_name}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Mentor' onChange={handleMentorChange}>
                      {mentors.length > 0
                        ? mentors.map((mntr) => (
                            <Option value={mntr.value} name={mntr.label}>
                              {mntr.label}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <DatePicker value={startDate} placeholder='Employee Start Date' format='YYYY-MM-DD' />
                  </Col>
                  <Col span={4}>
                    <DatePicker value={endDate} placeholder='Employee End Date' format='YYYY-MM-DD' />
                  </Col>
                </Row>
                <ListingStyles>
                  {/* <Table dataSource={jobs} columns={columns} /> */}
                  <Row>
                    <Col span={24}>
                      <Table dataSource={trainees}>
                        <Column title='Sr.No' key='index' render={(text, record, index) => index + 1} />
                        <Column title='Department' dataIndex='division' key='division' />
                        <Column title='Mentor' dataIndex='mentor' key='mentor' />
                        <Column title='Trainee Name' dataIndex='trainee_name' key='trainee_name' />
                        <Column title='Email' dataIndex='email' key='email' />
                        <Column title='Employee Till' dataIndex='emp_end_date' key='emp_end_date' />
                        <Column
                          title='Status'
                          key='status'
                          width='5%'
                          render={(text, record) => (
                            <Tag
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
