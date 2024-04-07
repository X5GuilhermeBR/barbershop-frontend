/* eslint-disable react/prop-types */
import { CheckCircleOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
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

function WalletCard({ schedule }) {
  const [showValues, setShowValues] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [predictedBalance, setPredictedBalance] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);

  const toggleValues = () => {
    setShowValues(!showValues);
  };

  useEffect(() => {
    const currentBalanceAmount = schedule.reduce((accumulator, appointment) => {
      if (appointment.status === 'Finalizado') {
        return accumulator + parseFloat(appointment.service_price);
      }
      return accumulator;
    }, 0);
    setCurrentBalance(currentBalanceAmount);

    const predictedBalanceAmount = schedule.reduce(
      (accumulator, appointment) => accumulator + parseFloat(appointment.service_price),
      0
    );
    setPredictedBalance(predictedBalanceAmount);

    const completedCount = schedule.filter(
      (appointment) => appointment.status === 'Finalizado'
    ).length;
    setCompletedAppointments(completedCount);
  }, [schedule]);

  const renderHiddenValue = () => (
    <>
      {' '}
      <span>R$</span> <p>--,--</p>
    </>
  );

  const formattedCurrentBalance = showValues ? (
    <>
      {' '}
      <span>R$</span> <p>{currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
    </>
  ) : (
    renderHiddenValue()
  );

  const formattedPredictedBalance = showValues ? (
    <>
      {' '}
      <span>R$</span>{' '}
      <p>{predictedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
    </>
  ) : (
    renderHiddenValue()
  );

  const progressPercentage = (currentBalance / predictedBalance) * 100 || 0;

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
              <p>{`${completedAppointments}/${schedule.length}`}</p>
              <CheckCircleOutline sx={{ color: 'green', fontSize: '18px' }} />
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
