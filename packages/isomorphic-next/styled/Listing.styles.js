import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const ListingStyles = styled.div`
  width: 100%;
  .action-bar {
    margin-bottom: 16px;
  }
`;

export default WithDirection(ListingStyles);
