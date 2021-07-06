import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CSVLink } from 'react-csv';
// Components
import { Checkbox, Row, Col } from 'antd';
import Table from '@iso/components/uielements/table';
import Tag from '@iso/components/uielements/tag';
import Button from '@iso/components/uielements/button';
import { InputSearch } from '@iso/components/uielements/input';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import Modal from '@iso/ui/Antd/Modal/Modal';
import DashboardLayout from '../../../../../containers/DashboardLayout/DashboardLayout';

// Hooks / API Calls
import { useAuthState } from '../../../../../src/components/auth/hook';
import useUser from '../../../../../src/components/auth/useUser';
// Styles
import ListingStyles from '../../../../../styled/Listing.styles';
import ManageJobPostStyles from '../../../../../containers/Admin/ManageJobPost/ManageJobPost.styles';

const csvHeaders = [
  { label: 'Position', key: 'position' },
  { label: 'Name', key: 'name' },
  { label: 'Mobile no', key: 'mobile_no' },
  { label: 'Place of birth', key: 'place_of_birth' },
  { label: 'Skype id', key: 'skype_id' },
  { label: 'Whatsapp id', key: 'whatsapp_id' },
  { label: 'Aplication Id', key: 'application_id' },
  { label: 'Job Status', key: 'applied_job_status' },
  { label: 'College Name', key: 'college_name' },
  { label: 'Id', key: 'id' },
  { label: 'Exam name', key: 'exam_name' },
  { label: 'Passing year', key: 'passing_year' },
  { label: 'Score', key: 'score' },
  { label: 'Score unit', key: 'score_unit' },
  { label: 'Specialization', key: 'specialization' },
  { label: 'University', key: 'university' },
];
const plainOptions = [
  'position',
  'name',
  'mobile_no',
  'place_of_birth',
  'skype_id',
  'whatsapp_id',
  'application_id',
  'applied_job_status',
  'college_name',
  'id',
  'exam_name',
  'passing_year',
  'score',
  'score_unit',
  'specialization',
  'university',
];

const JobDetails = () => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const router = useRouter();
  const { query } = router;
  const [applicants, setApplicants] = useState(null);
  const [visible, setModaVisibility] = useState(false);
  const { Column } = Table;
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [checkedList, setCheckedList] = React.useState([]);
  const [headers, setHeaders] = React.useState(csvHeaders);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const CheckboxGroup = Checkbox.Group;
  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    getHeaders(list.length === plainOptions.length, list);
  };

  const getHeaders = (selectAll, list) => {
    let data = [];
    if (selectAll) {
      data = list;
    } else {
      list &&
        list.length &&
        list.map((v) => {
          csvHeaders.map((n) => {
            if (v === n.key) {
              data.push(n);
            }
          });
        });
    }
    setHeaders(data);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    getHeaders(e.target.checked, plainOptions);
  };

  const rowSelection = {
    onChange(selectedRowKeys, row) {
      const data = row.map((item) => ({
        ...item,
        name: item.user_profile.name_of_applicant,
        mobile_no: item.user_profile.mobile_no,
        place_of_birth: item.user_profile.place_of_birth,
        skype_id: item.user_profile.skype_id,
        whatsapp_id: item.user_profile.whatsapp_id,
        college_name:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.college_name),
        id:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.id),
        exam_name:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.exam_name),
        passing_year:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.passing_year),
        score:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.score),
        score_unit:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.score_unit),
        specialization:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.specialization),
        university:
          item &&
          item.user_profile &&
          item.user_profile.education_details.length &&
          item.user_profile.education_details.map((v) => v.university),
      }));
      setSelectedRows(data);
    },
  };

  const openModal = () => {
    setModaVisibility(true);
  };

  const handleCancel = () => {
    setModaVisibility(false);
  };

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`job_posting/applicant_list_by_job/${query.jobId}/`);

      setApplicants(response.data);
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  if (!applicants) return null;

  return (
    <>
      <Head>
        <title>Applicants List</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <ManageJobPostStyles>
            <ListingStyles>
              <Row className='action-bar'>
                <Col span={12}>{/* <InputSearch placeholder='input search text' /> */}</Col>
                <Col span={12}>
                  <Row justify='end'>
                    <Row span={12}>
                      <Button
                        className='ant-btn-secondary'
                        type='button'
                        disabled={selectedRows && selectedRows.length === 0}
                        onClick={() => openModal()}
                      >
                        Compare Applicants
                      </Button>
                    </Row>
                    <Row span={12}>
                      <Button
                        className='ant-btn-secondary'
                        type='button'
                        onClick={() => router.push('/admin/manage-job-post/permanent/list')}
                      >
                        Back
                      </Button>
                    </Row>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Table dataSource={applicants} rowSelection={rowSelection} rowKey={(record) => record.application_id}>
                    <Column
                      title='Name'
                      dataIndex='name'
                      key='name'
                      render={(text, record) => <a>{record.user_profile.name_of_applicant}</a>}
                      onCell={(record) => {
                        return {
                          onClick: () => {
                            router.push(`/admin/manage-job-post/applicants/${query.jobId}/${record.user_id}`);
                          },
                        };
                      }}
                    />
                    <Column title='Position' dataIndex='position' key='position' />
                    <Column title='Division' dataIndex='division' key='division' />
                    <Column title='Date of Applied' dataIndex='date_of_application' key='date_of_application' />
                    <Column
                      title='Contact'
                      dataIndex='user_profile.mobile_no'
                      key='user_profile.mobile_no'
                      render={(text, record) => record.user_profile.mobile_no}
                    />
                    <Column
                      title='Status'
                      key='status'
                      render={(text, record) => (
                        <Tag className={`ant-tag-${record.applied_job_status}`} key={record.applied_job_status}>
                          {record.applied_job_status}
                        </Tag>
                      )}
                    />
                  </Table>
                </Col>
              </Row>
            </ListingStyles>
          </ManageJobPostStyles>
          <Modal wrapClassName='instagram-modal' visible={visible} onCancel={() => handleCancel()} footer={null}>
            <ListingStyles style={{ padding: '24px' }}>
              <Row>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  Select all
                </Checkbox>
              </Row>
              <Row>
                <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
              </Row>
            </ListingStyles>
            <Row span={12} style={{ padding: '8px 24px 24px' }}>
              <CSVLink data={selectedRows} headers={headers}>
                <Button className='ant-btn-secondary' type='button'>
                  Export to CSV
                </Button>
              </CSVLink>
            </Row>
          </Modal>
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

JobDetails.propTypes = {
  response: PropTypes.arrayOf(PropTypes.object),
};

JobDetails.defaultProps = {
  response: [],
};

export default JobDetails;
