import React from 'react';
import { useTranslation } from 'react-i18next';

const Typing = () => {
  const { t } = useTranslation();
  return (
    <div className="typing text-success">
      <span className="pr-1">{t('typing')}</span>
      <span className="one">•</span>
      <span className="two">•</span>
      <span className="three">•</span>
    </div>
  );
};

export default Typing;
