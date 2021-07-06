import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@iso/components/uielements/button';
import IntlMessages from '@iso/components/utility/intlMessages';
import { validationSchema } from './validations';
import InputField from '../common/input-field';
import { message } from 'antd';

const ResetPasswordForm = (token) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    try {
      const response = await client.post(`/user/reset_password/${token}`, {
        password: values.password,
        confirm_password: values.confirmPassword,
      });
      const msg = response.data.message;
      message.warning(msg);
      router.push('/');
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='isoResetPassForm'>
        <div className='isoInputWrapper'>
          <InputField control={control} type='password' name='password' placeholder='Password' />
        </div>

        <div className='isoInputWrapper'>
          <InputField control={control} type='password' name='confirmPassword' placeholder='Confirm Password' />
        </div>

        <div className='isoInputWrapper'>
          <Button type='primary'>
            <IntlMessages id='page.resetPassSave' />
          </Button>
        </div>
      </div>
    </form>
  );
};
export default ResetPasswordForm;
