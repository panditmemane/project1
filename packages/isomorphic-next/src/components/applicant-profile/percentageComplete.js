import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';
import PercentageCompleteStyle from './PercentageComplete.styles';

const PercentageComplete = ({ currentStep }) => {
  const [state, setState] = useState(0);
  const { client } = useAuthState();
  const { user } = useUser({});

  useEffect(() => {
    const load = async () => {
      const response = await client.get(`/user/public/applicant_profile_percentage/${user.user_id}/`);

      setState(response.data);
    };

    if (user && user.isLoggedIn) load();
  }, [user, client, currentStep]);

  console.log('percentage', state.percentage);

  if (!state.percentage) return null;
  return (
    <PercentageCompleteStyle>
      <Progress
        percent={state.percentage.substr(0, 2)}
        status='active'
        format={(percent) => `${percent}% Profile Completed`}
        strokeColor='#009633'
        strokeWidth='14px'
      />
    </PercentageCompleteStyle>
  );
};

export default PercentageComplete;
