import Head from 'next/head';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Space, Row, Col, Popconfirm, message, Select } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Tag from '@iso/components/uielements/tag';
import Button from '@iso/components/uielements/button';
import { InputSearch } from '@iso/components/uielements/input';
import PageHeader from '@iso/components/utility/pageHeader';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import { DropdownButtons, DropdownMenu, MenuItem } from '@iso/components/uielements/dropdown';
import { useAuthState } from '../../../../../src/components/auth/hook';
import useUser from '../../../../../src/components/auth/useUser';
import DashboardLayout from '../../../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const PositionMasterPermanent = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [positions, setPosition] = useState([]);
  const [value, setValue] = useState('');
  const [searchList, setSearchList] = useState();
  const [loading, setLoading] = useState(true);
  const [nameLabel, setNameLabel] = useState('');
  const [displayLabel, setDisplayLabel] = useState('');
  const [descLabel, setDescLabel] = useState('');
  const [gradeLabel, setGradeLabel] = useState('');
  const [levelLabel, setLevelLabel] = useState('');
  const { Column } = Table;

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/job_posting/permanent_positions/');
      const dataSource = response.data.map((res) => ({
        ...res,
        key: res.perm_position_id,
        position_name: res.perm_position_master.position_name,
        position_display_name: res.perm_position_master.position_display_name,
        qualification_desc: res.perm_position_master.qualification_desc,
        max_age: res.perm_position_master.max_age,
        grade: res.grade,
        level: res.level,
      }));
      setSearchList(dataSource);
      setPosition(dataSource);
      setLoading(false);
      console.log(response);
    };

    load();
  }, []);

  const onConfirmDelete = async (id) => {
    await client.delete(`/job_posting/permanent_positions/${id}/`);
    const data = positions.filter((position) => position.key !== id);
    setSearchList(data);
    setPosition(data);
    message.success('Position Deleted Successfully');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = positions.filter(
        (entry) =>
          entry.position_name.toLowerCase().includes(e.target.value) ||
          entry.position_display_name.toLowerCase().includes(e.target.value) ||
          entry.qualification_desc.toLowerCase().includes(e.target.value)
      );
      setPosition(filteredData);
    } else {
      setPosition(searchList);
    }
  };

  const handleFilter = async () => {
    const res = await client.get(`/job_posting/filter_permanent_positions/?position_name=${nameLabel}
    &position_display_name=${displayLabel}&qualification_desc=${descLabel}
    &grade=${gradeLabel}@level=${levelLabel}`);
    console.log(res);
    const dataSource = res.data.map((res) => ({
      key: res.perm_position_id,
      position_name: res.perm_position_master.position_name,
      position_display_name: res.perm_position_master.position_display_name,
      qualification_desc: res.perm_position_master.qualification_desc,
      max_age: res.perm_position_master.max_age,
      grade: res.grade,
      level: desc.level,
    }));
    setSearchList(dataSource);
    setPosition(dataSource);
  };

  const handleNameChange = (value, obj) => {
    setNameLabel(obj.name);
  };

  const handleDisplayChange = (value, obj) => {
    setDisplayLabel(obj.name);
    handleFilter();
  };

  const handleDescChange = (value, obj) => {
    setDescLabel(obj.name);
    handleFilter();
  };

  const handleGradeChange = (value, obj) => {
    setGradeLabel(obj.name);
    handleFilter();
  };

  const handleLevelChange = (value, obj) => {
    setLevelLabel(obj.name);
    handleFilter();
  };

  return (
    <>
      <Head>
        <title>Permanent Position List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Permanent Position List</PageHeader>
                <Row className='action-bar'>
                  <Col span={12}>
                    <InputSearch placeholder='Search Position' value={value} onChange={(e) => handleSearch(e)} />
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/admin-section/position-master/permanent/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <Row className='action-bar' justify='space-between'>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Position Name' onChange={handleNameChange}>
                      {positions.length > 0
                        ? positions.map((name) => (
                            <Option value={name.temp_position_id} name={name.position_name}>
                              {name.position_name}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Display Name' onChange={handleDisplayChange}>
                      {positions.length > 0
                        ? positions.map((dis) => (
                            <Option value={dis.temp_position_id} name={dis.position_display_name}>
                              {dis.position_display_name}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Description' onChange={handleDescChange}>
                      {positions.length > 0
                        ? positions.map((desc) => (
                            <Option value={desc.temp_position_id} name={desc.qualification_desc}>
                              {desc.qualification_desc}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Grade' onChange={handleGradeChange}>
                      {positions.length > 0
                        ? positions.map((gra) => (
                            <Option value={gra.perm_position_id} name={gra.grade}>
                              {gra.grade}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Level' onChange={handleLevelChange}>
                      {positions.length > 0
                        ? positions.map((lev) => (
                            <Option value={lev.perm_position_id} name={lev.level}>
                              {lev.level}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={positions}>
                        <Column title='Sr.No.' key='index' render={(text, record, index) => index + 1} />
                        <Column title='Position Name' dataIndex='position_name' key='position_name' />
                        <Column title='Display Name' dataIndex='position_display_name' key='position_display_name' />
                        <Column title='Qualification Desc' dataIndex='qualification_desc' key='qualification_desc' />
                        <Column title='Age' dataIndex='max_age' key='max_age' />
                        <Column title='Grade' dataIndex='grade' key='grade' />
                        <Column title='Level' dataIndex='level' key='level' />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/admin-section/position-master/permanent/edit?id=${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this Position?'
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

export default PositionMasterPermanent;
