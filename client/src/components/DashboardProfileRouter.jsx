import React from 'react';
import { useOutletContext } from 'react-router-dom';
import BusinessProfile from '../pages/BusinessProfile';
import CustomerProfile from '../pages/CustomerProfile';

const DashboardProfileRouter = () => {
  const { userInfo } = useOutletContext();

  if (userInfo?.role === 'entrepreneur') {
    return <BusinessProfile />;
  }

  return <CustomerProfile />;
};

export default DashboardProfileRouter;
