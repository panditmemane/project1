import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Space, Row, Col, Popconfirm, Tag, message, Select } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import PageHeader from '@iso/components/utility/pageHeader';
import { InputSearch } from '@iso/components/uielements/input';
import { useAuthState } from '../../../../src/components/auth/hook';
import useUser from '../../../../src/components/auth/useUser';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import DashboardLayout from '../../../../containers/DashboardLayout/DashboardLayout';
import ListingStyles from '../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const ContentTemplateMaster = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [value, setValue] = useState('');
  const [searchList, setSearchList] = useState();
  const [templates, setTemplate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communicationLabel, setCommunicationLabel] = useState('');
  const [activeLabel, setActiveLabel] = useState('');
  const [subjectLabel, setSubjectLabel] = useState('');
  const [comm_typeLabel, setComm_typeLabel] = useState('');
  const [action_typeLabel, setaction_typeLabel] = useState('');
  const [commtypes, setCommtypes] = useState([]);
  const [actiontypes, setActiontypes] = useState([]);
  const { Column } = Table;

  useEffect(() => {
    const load = async () => {
      const response = await client.get('/template/template_list/');
      const dataSource = response.data.map((res) => ({
        key: res.communication_id,
        communication_name: res.communication_name,
        subject: res.subject,
        body: res.body,
        action_type: res.action_type.comm_action_type,
        comm_type: res.comm_type.communication_type,
        is_active: res.is_active,
      }));
      setSearchList(dataSource);
      setTemplate(dataSource);
      setLoading(false);
    };
    const load1 = async () => {
      const commtype = await client.get('/template/template_type_list/');
      const dataSource = commtype.data.map((res) => ({
        value: res.id,
        label: res.communication_type,
      }));
      setCommtypes(dataSource);
    };
    const load2 = async () => {
      const actiontype = await client.get('/template/template_action_type_list/');
      const dataSource1 = actiontype.data.map((res) => ({
        label: res.comm_action_type,
      }));
      setActiontypes(dataSource1);
    };
    load();
    load1();
    load2();
  }, []);

  const onConfirmDelete = async (id) => {
    await client.delete(`/template/delete_template/${id}/ `);
    const data = templates.filter((template) => template.key !== id);
    setSearchList(data);
    setTemplate(data);
    message.success('Template Deleted Successfully');
  };

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredData = templates.filter(
        (entry) =>
          entry.communication_name.toLowerCase().includes(e.target.value) ||
          entry.subject.toLowerCase().includes(e.target.value)
      );
      setTemplate(filteredData);
    } else {
      setTemplate(searchList);
    }
  };

  const handleFilter = async () => {
    const res = await client.get(`/template/filter_template/?communication_name=${communicationLabel}
    &subject=${subjectLabel}&comm_type__communication_type=${comm_typeLabel}
    &action_type__comm_action_type=${action_typeLabel}&is_active=${activeLabel}`);
    console.log(res);
    const dataSource = res.data.map((res) => ({
      key: res.communication_id,
      communication_name: res.communication_name,
      subject: res.subject,
      body: res.body,
      action_type: res.action_type.comm_action_type,
      comm_type: res.comm_type.communication_type,
      is_active: res.is_active,
    }));
    setSearchList(dataSource);
    setTemplate(dataSource);
  };

  const handleCommChange = (value, obj) => {
    setCommunicationLabel(obj.name);
  };

  const handleSubjectChange = (value, obj) => {
    setSubjectLabel(obj.name);
    handleFilter();
  };

  const handleCommtypeChange = (value, obj) => {
    setComm_typeLabel(obj.name);
    handleFilter();
  };

  const handleActionChange = (value, obj) => {
    setaction_typeLabel(obj.name);
    handleFilter();
  };

  return (
    <>
      <Head>
        <title>Content Template List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Space direction='vertical' style={{ width: '100%' }}>
                <PageHeader>Content Template List</PageHeader>
                <Row className='action-bar'>
                  <Col span={12}>
                    <InputSearch
                      placeholder='Search Template'
                      style={{ width: '100%' }}
                      value={value}
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Row span={12}>
                        <Link href='/admin/admin-section/template-master/add'>
                          <Button type='primary'>Add New</Button>
                        </Link>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <Row className='action-bar' justify='space-between'>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Communication' onChange={handleCommChange}>
                      {templates.length > 0
                        ? templates.map((temp) => (
                            <Option value={temp.communication_id} name={temp.communication_name}>
                              {temp.communication_name}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Subject' onChange={handleSubjectChange}>
                      {templates.length > 0
                        ? templates.map((sub) => (
                            <Option value={sub.communication_id} name={sub.subject}>
                              {sub.subject}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Comm-Type' onChange={handleCommtypeChange}>
                      {commtypes.length > 0
                        ? commtypes.map((comm) => (
                            <Option value={comm.value} name={comm.label}>
                              {comm.label}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select style={{ width: '100%' }} placeholder='Select Action' onChange={handleActionChange}>
                      {actiontypes.length > 0
                        ? actiontypes.map((action) => (
                            <Option value={action.communication_id} name={action.label}>
                              {action.label}
                            </Option>
                          ))
                        : ''}
                    </Select>
                  </Col>
                </Row>
                <ListingStyles>
                  <Row>
                    <Col span={24}>
                      <Table dataSource={templates}>
                        <Column title='Sr.No.' key='index' render={(text, record, index) => index + 1} />
                        <Column title='Name' dataIndex='communication_name' key='communication_name' />
                        <Column title='Subject' dataIndex='subject' key='subject' />
                        <Column title='Body' dataIndex='body' key='body' />
                        <Column title='Action Type' dataIndex='action_type' key='action_type' />
                        <Column title='Communication Type' dataIndex='comm_type' key='comm_type' />
                        <Column
                          title='Action'
                          key='action'
                          width='5%'
                          render={(text, record) => (
                            <Space size='middle'>
                              <Link href={`/admin/admin-section/template-master/edit?id=${record.key}`}>
                                <EditTwoTone />
                              </Link>
                              <Popconfirm
                                title='Are you sure to delete this Template?'
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

export default ContentTemplateMaster;
