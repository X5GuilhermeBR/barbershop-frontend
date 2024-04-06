/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, LinearProgress, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';

const WalletCardContainer = styled.div`
  padding: 20px 30px 20px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${colors.primary};
`;

const StyledCardBackground = styled.div`
  background-color: ${colors.secondary};
  border-radius: 10px;
`;

const WalletBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const WalletCardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const WalletBalance = styled.div`
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

const WalletBalancePredicted = styled.div`
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

const WalletBalanceBox = styled.div`
  display: grid;
`;

const StyledLinearProgress = styled(LinearProgress)`
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

const StyledLinearSubTitle = styled.p`
  margin: 0px;
  margin-top: 4px;
  font-size: 10px;
  text-align: center;
`;

// Ícone do olho personalizado
const StyledIconButton = styled(IconButton)`
  && {
    color: white;
  }
`;

function WalletCard({ currentBalance = 400.99, predictedBalance = 999.99 }) {
  const [showValues, setShowValues] = useState(true);

  const toggleValues = () => {
    setShowValues(!showValues);
  };

  const renderHiddenValue = (value) => (
    <>
      {' '}
      <span>R$</span> <p>--,--</p>
    </>
  );
  const progressPercentage = (currentBalance / predictedBalance) * 100;

  const formattedCurrentBalance = showValues ? (
    <>
      {' '}
      <span>R$</span> <p>{currentBalance.toFixed(2)}</p>
    </>
  ) : (
    renderHiddenValue(currentBalance.toFixed(2))
  );
  const formattedPredictedBalance = showValues ? (
    <>
      {' '}
      <span>R$</span> <p>{predictedBalance.toFixed(2)}</p>
    </>
  ) : (
    renderHiddenValue(predictedBalance.toFixed(2))
  );

  return (
    <WalletCardContainer>
      <StyledCardBackground>
        <WalletCardContent>
          <WalletBoxContainer>
            <WalletBalanceBox>
              <WalletBalance>
                <p>SALDO ATUAL - 05/04</p>
                <p>{formattedCurrentBalance}</p>
              </WalletBalance>
              <WalletBalancePredicted>
                <p>SALDO PREVISTO - 05/04</p>
                <p>{formattedPredictedBalance}</p>
              </WalletBalancePredicted>
            </WalletBalanceBox>
            <Tooltip title={showValues ? 'Esconder valores' : 'Mostrar valores'}>
              {/* Utilizando o ícone personalizado */}
              <StyledIconButton onClick={toggleValues} size="small">
                {showValues ? <VisibilityOff /> : <Visibility />}
              </StyledIconButton>
            </Tooltip>
          </WalletBoxContainer>
          <StyledLinearProgress
            variant="determinate"
            value={progressPercentage}
            color="secondary"
            valueLabelDisplay="on"
          />
          <StyledLinearSubTitle>{`Você já completou ${progressPercentage.toFixed(
            2
          )}% dos seus atendimentos`}</StyledLinearSubTitle>
        </WalletCardContent>
      </StyledCardBackground>
    </WalletCardContainer>
  );
}

export default WalletCard;
