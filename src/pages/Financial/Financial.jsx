import HistoryIcon from '@mui/icons-material/History';
import React from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';

function Financial() {
  return (
    <>
      <Header icon={<HistoryIcon />} title="Financeiro" />
      <h1>teste</h1>
      <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
    </>
  );
}

export default Financial;
