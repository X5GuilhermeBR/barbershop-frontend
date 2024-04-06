/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { CheckCircleOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import {
  StyledCardBackground,
  StyledIconButton,
  StyledLinearProgress,
  StyledLinearSubTitle,
  StyledLinearTitle,
  WalletBalance,
  WalletBalanceBox,
  WalletBalancePredicted,
  WalletBoxContainer,
  WalletCardContainer,
  WalletCardContent,
} from './WalletCardStyled';

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
              <StyledIconButton onClick={toggleValues} size="small">
                {showValues ? <VisibilityOff /> : <Visibility />}
              </StyledIconButton>
            </Tooltip>
          </WalletBoxContainer>
          <StyledLinearTitle>
            <p>ATENDIMENTO(S) FINALIZADO(S)</p>
            <div>
              <p>2/10</p>
              <CheckCircleOutline sx={{ color: 'green', fontSize: '18px' }} />
              {/* Adicionando o ícone de check e ajustando cor e tamanho */}
            </div>
          </StyledLinearTitle>
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
