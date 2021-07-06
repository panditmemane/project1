import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import { palette } from 'styled-theme';

const FormStyles = styled.div`
  width: 100%;
  .ant-form-item-label {
    padding-bottom: 0;
  }
  .ant-picker {
    width: 100%;
  }
  .add-position {
    margin-bottom: 16px;
  }
  .ant-btn-primary {
    background: ${palette('primary', 0)};
    border-color: ${palette('primary', 0)};
  }
  .form-fields-wrapper {
    background: ${palette('secondary', 11)};
    padding: 20px;
  }
  h5 {
    marginbottom: 0;
  }
  .ant-descriptions {
    margin-bottom: 20px;
  }
  .ant-upload-text-icon {
    display: none;
  }
  .ant-upload-list-item-progress {
    padding-left: 0;
  }
`;

export default WithDirection(FormStyles);
