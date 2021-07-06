import React, { useEffect, useState } from 'react';
import { useAuthState } from '../auth/hook';
import useUser from '../auth/useUser';

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

  return <h1>{state.percentage} % Completed</h1>;
};

export default PercentageComplete;
