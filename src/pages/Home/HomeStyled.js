import styled from 'styled-components';
import { Button } from '@mui/material';
import colors from '../../utils/colors';

export const CustomButton = styled(Button)`
  && {
    width: 100%;
    padding: 12px;
    background-color: ${(props) => props.backgroundColor || '#f6a700'};
    color: ${(props) => props.color || 'black'};
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 55px;
    margin-top: 20px;
    font-weight: bold;
    -webkit-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 8px;
    }
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.basic};
  margin: 20px 0;
`;

export const LocationContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export const LocationTitle = styled.h2`
  margin-bottom: 30px;
  color: ${colors.third};
`;

export const LocationText = styled.p`
  margin-bottom: 0;
  color: white;
  line-height: 22px;
`;

export const ServiceCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const ServiceCard = styled.div`
  width: calc(50% - 10px);
  background-color: ${colors.primary};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);

  &:nth-child(2n) {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    width: calc(50% - 20px);
    margin-right: 0;
  }
`;

export const ServiceImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

export const ServiceName = styled.h3`
  font-size: 18px;
  margin-bottom: 0px;
  color: ${colors.third};
  font-size: 16px;
`;

export const ServiceDescription = styled.p`
  text-align: center;
  color: white;
  font-size: 12px;
  margin-top: 6px;
  padding-left: 18px;
  padding-right: 18px;
`;
