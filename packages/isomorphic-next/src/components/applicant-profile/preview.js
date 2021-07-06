import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Tree,
  List,
  Typography,
  Table,
  Column,
  Descriptions,
  Badge,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import FormStyles from '../../../styled/Form.styles';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';

const Preview = ({ onPrevious }) => {
  const { client } = useAuthState();
  const { user } = useUser({});
  const [initialData, setInitialData] = useState();
  const { Title } = Typography;

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/user/public/profile_details/${user.user_id}/`);
      setInitialData(response.data);
    };
    if (user && user.isLoggedIn) load();
  }, [user, client]);

  const onSelect = () => {};

  if (!initialData) return null;

  return (
    <FormStyles>
      <PageHeader>Preview</PageHeader>
      <Box>
        <Descriptions title='Personal Info' bordered stylle={{ marginBottom: 20 }}>
          <Descriptions.Item label='Name Of Applicant' span={3}>
            {initialData.name_of_applicant}
          </Descriptions.Item>
          <Descriptions.Item label='Father (Full Name)'>{initialData.father_name}</Descriptions.Item>
          <Descriptions.Item label='Occupation' span={2}>
            {initialData.father_occupation}
          </Descriptions.Item>
          <Descriptions.Item label='Sex'>{initialData.gender}</Descriptions.Item>
          <Descriptions.Item label='Date of Birth'>{initialData.date_of_birth}</Descriptions.Item>
          <Descriptions.Item label='Birth Place'>{initialData.place_of_birth}</Descriptions.Item>
          <Descriptions.Item label='Are you a Citizen of India by Birth and /or By Domicile?' span={2}>
            {initialData.is_indian_citizen === true ? 'YES' : 'NO'}
          </Descriptions.Item>
          <Descriptions.Item label='State your Religion'>{initialData.religion}</Descriptions.Item>
          <Descriptions.Item label='Caste/Community'>{initialData.caste}</Descriptions.Item>
          <Descriptions.Item label='Passport Details'>{initialData.passport_number}</Descriptions.Item>
          <Descriptions.Item label='Fax Number'>{initialData.fax_number}</Descriptions.Item>
          <Descriptions.Item label='Whatsapp Id/No.'>{initialData.whatsapp_id}</Descriptions.Item>
          <Descriptions.Item label='Skype Id' span={2}>
            {initialData.skype_id}
          </Descriptions.Item>
          <Descriptions.Item label='Residential Address' span={3}>
            {initialData.local_address?.address1}
            <br />
            {initialData.local_address?.address2}
            <br />
            {initialData.local_address?.address3}
            <br />
            {initialData.local_address?.city}
          </Descriptions.Item>
          <Descriptions.Item label='Permanent Address' span={3}>
            {initialData.permanent_address?.address1} <br />
            {initialData.permanent_address?.address2} <br />
            {initialData.permanent_address?.address3} <br />
            {initialData.permanent_address?.city}
          </Descriptions.Item>
        </Descriptions>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Educational Details</div>
          </div>
          <Table bordered pagination={false} size='small' showHeader={false} dataSource={initialData.education_details}>
            <Table.Column dataIndex='exam_name' key='exam_name' />
            <Table.Column dataIndex='college_name' key='college_name' />
            <Table.Column dataIndex='passing_year' key='passing_year' />
            <Table.Column dataIndex='score' key='score' />
            <Table.Column dataIndex='university' key='university' />
            <Table.Column dataIndex='specialization' key='specialization' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Professional Training</div>
          </div>
          <Table
            bordered
            pagination={false}
            size='small'
            showHeader={false}
            dataSource={initialData.professional_trainings}
          >
            <Table.Column dataIndex='title' key='title' />
            <Table.Column dataIndex='description' key='description' />
            <Table.Column dataIndex='from_date' key='from_date' />
            <Table.Column dataIndex='to_date' key='to_date' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Published Paper</div>
          </div>
          <Table bordered pagination={false} size='small' showHeader={false} dataSource={initialData.published_papers}>
            <Table.Column dataIndex='paper_title' key='paper_title' />
            <Table.Column dataIndex='to_date' key='to_date' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Experience Details</div>
          </div>
          <Table bordered pagination={false} size='small' showHeader={false} dataSource={initialData.experiences}>
            <Table.Column dataIndex='employer_name' key='employer_name' />
            <Table.Column dataIndex='employment_type' key='employment_type' />
            <Table.Column dataIndex='employed_from' key='employed_from' />
            <Table.Column dataIndex='employed_to' key='employed_to' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Existing Bond With Govt. Or Private Orgnaistion</div>
          </div>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Relation with Neeri Employee</div>
          </div>
          <Table bordered pagination={false} size='small' showHeader={false} dataSource={initialData.neeri_relation}>
            <Table.Column dataIndex='relation_name' key='relation_name' />
            <Table.Column dataIndex='designation' key='designation' />
            <Table.Column dataIndex='center_name' key='center_name' />
            <Table.Column dataIndex='relation' key='relation' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Overseas Visits</div>
          </div>
          <Table bordered pagination={false} size='small' showHeader={false} dataSource={initialData.overseas_visits}>
            <Table.Column dataIndex='country_visited' key='country_visited' />
            <Table.Column dataIndex='date_of_visit' key='date_of_visit' />
            <Table.Column dataIndex='duration_of_visit' key='duration_of_visit' />
            <Table.Column dataIndex='purpose_of_visit' key='purpose_of_visit' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Known Languages</div>
          </div>
          <Table bordered pagination={false} size='small' showHeader={false} dataSource={initialData.languages}>
            <Table.Column dataIndex='name' key='name' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'>Reference Details</div>
          </div>
          <Table bordered pagination={false} size='small' showHeader={false} dataSource={initialData.references}>
            <Table.Column dataIndex='reference_name' key='reference_name' />
          </Table>
        </div>
        <div class='ant-descriptions ant-descriptions-bordered'>
          <div class='ant-descriptions-header'>
            <div class='ant-descriptions-title'></div>
          </div>
        </div>
        <Row justify='end'>
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='button' onClick={onPrevious}>
                Previous
              </Button>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Row>
      </Box>
    </FormStyles>
  );
};

Preview.propTypes = {
  onPrevious: PropTypes.func.isRequired,
};

export default Preview;
