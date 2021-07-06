import styled from 'styled-components';
import { palette } from 'styled-theme';

const PercentageCompleteStyle = styled.div`
  margin: 0 -20px -23px;
  .ant-progress-show-info .ant-progress-outer {
    margin-right: 0;
    padding-right: 0;
    margin-top: 10px;
  }
  .ant-progress-line {
    text-align: center;
    color: #009633;
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    gap: 0;
    margin-top: 24px;
  }
  .ant-progress-success-bg,
  .ant-progress-bg {
    border-radius: 0;
  }
`;

export default PercentageCompleteStyle;
