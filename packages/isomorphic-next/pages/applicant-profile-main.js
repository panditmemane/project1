import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Row, Col, Steps } from 'antd';
// Layouts
import DashboardLayout from '../containers/DashboardLayout/DashboardLayout';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
// Components
import Box from '@iso/components/utility/box';
// Styles

import Personal from '../src/components/applicant-profile/personal';
import Address from '../src/components/applicant-profile/address';
import Qualification from '../src/components/applicant-profile/qualification';
import Experience from '../src/components/applicant-profile/experience';
import Others from '../src/components/applicant-profile/others';
import Documents from '../src/components/applicant-profile/documents';
import Preview from '../src/components/applicant-profile/preview';

import { steps } from '../src/components/applicant-profile/constants';
import { usePrevious } from '../src/hooks';
import PercentageComplete from '../src/components/applicant-profile/percentageComplete';

const ApplicantProfile = () => {
  const [current, setCurrent] = useState(0);

  const { Step } = Steps;

  const onSuccessPersonalForm = () => {
    setCurrent(current + 1);
  };

  const onSuccessAddressForm = () => {
    setCurrent(current + 1);
  };

  const onSuccessQualificationForm = () => {
    setCurrent(current + 1);
  };

  const onSuccessExperienceForm = () => {
    setCurrent(current + 1);
  };

  const onSuccessOthersForm = () => {
    setCurrent(current + 1);
  };

  const onNext = () => {
    setCurrent(current + 1);
  };

  const onPrevious = () => {
    setCurrent(current - 1);
  };
  const prevStep = usePrevious(current);
  if (prevStep && prevStep === current) {
    setCurrent(0);
  }

  return (
    <>
      <Head>
        <title>Applicant profile main | NEERI Job portals</title>
      </Head>
      <DashboardLayout>
        <LayoutContentWrapper>
          <Box>
            <Row>
              <Col span={24}>
                <Steps current={current} size='small' labelPlacement='vertical'>
                  {steps.map((item, index) => (
                    <Step key={item.title} title={item.title} onClick={() => setCurrent(index)} />
                  ))}
                </Steps>
              </Col>
            </Row>
            <PercentageComplete currentStep={current} />
          </Box>
          {current === 0 && <Personal onSuccess={onSuccessPersonalForm} onNext={onNext} />}
          {current === 1 && <Address onSuccess={onSuccessAddressForm} onNext={onNext} onPrevious={onPrevious} />}
          {current === 2 && (
            <Qualification onSuccess={onSuccessQualificationForm} onNext={onNext} onPrevious={onPrevious} />
          )}
          {current === 3 && <Experience onSuccess={onSuccessExperienceForm} onNext={onNext} onPrevious={onPrevious} />}
          {current === 4 && <Others onSuccess={onSuccessOthersForm} onNext={onNext} onPrevious={onPrevious} />}
          {current === 5 && <Documents onSuccess={onSuccessOthersForm} onNext={onNext} onPrevious={onPrevious} />}
          {current === 6 && <Preview onSuccess={onSuccessOthersForm} onPrevious={onPrevious} />}
        </LayoutContentWrapper>
      </DashboardLayout>
    </>
  );
};

export default ApplicantProfile;
