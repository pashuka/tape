import React from 'react';
import Header from './header';
import { useTranslation } from 'react-i18next';

const Page = () => {
  const { t } = useTranslation();
  return (
    <div className="chat-body bg-white">
      <Header title={t('Notifications')} />
      <React.Fragment>Notifications</React.Fragment>
    </div>
  );
};

export default Page;
