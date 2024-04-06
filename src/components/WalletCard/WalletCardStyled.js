import { IconButton, LinearProgress } from '@mui/material';
import styled from 'styled-components';
import colors from '../../utils/colors';

export const WalletCardContainer = styled.div`
  padding: 20px 30px 20px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${colors.primary};
`;

export const StyledCardBackground = styled.div`
  border-radius: 10px;
`;

export const WalletBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const WalletCardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WalletBalance = styled.div`
  margin: 5px 0;
  text-align: left;
  color: white;

  span {
    font-size: 25px;
    color: white;
  }

  p {
    color: ${colors.third};
    margin: 0px;
    font-size: 14px;
    margin-bottom: 5px;
  }

  p + p {
    margin: 0px;
    display: flex;

    align-items: flex-start;

    span {
      font-size: 25px;
      padding-top: 8px;
    }

    p {
      margin-left: 6px;
      font-size: 50px;
      color: white;
    }
  }
`;

export const WalletBalancePredicted = styled.div`
  margin: 5px 0;
  text-align: left;
  color: white;

  span {
    font-size: 25px;
    color: white;
  }

  p {
    color: ${colors.third};
    margin: 0px;
    font-size: 14px;
    margin-bottom: 5px;
  }

  p + p {
    margin: 0px;
    display: flex;
    align-items: center;

    span {
      font-size: 25px;
    }

    p {
      margin-left: 6px;
      font-size: 25px;
      color: white;
    }
  }
`;

export const WalletBalanceBox = styled.div`
  display: grid;
`;

export const StyledLinearProgress = styled(LinearProgress)`
  && {
    height: 20px;
    border-radius: 10px;
    background-color: white;
    .MuiLinearProgress-barColorPrimary {
      background-color: ${colors.second};
    }
    .MuiLinearProgress-bar1Determinate {
      background-color: ${colors.second};
    }
    .MuiLinearProgress-bar2Determinate {
      background-color: ${colors.second};
    }
  }
`;

export const StyledLinearSubTitle = styled.p`
  margin: 0px;
  margin-top: 4px;
  font-size: 10px;
  text-align: center;
`;

export const StyledLinearTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  div {
    display: flex;
    align-items: center;

    p {
      margin-right: 4px;
    }
  }

  p {
    font-size: 15px;
    margin: 0px;
  }
`;

export const StyledIconButton = styled(IconButton)`
  && {
    color: white;
  }
`;
