import React from 'react';
import IChevronRight from '@material-ui/icons/ChevronRight';
import IFace from '@material-ui/icons/Face';
import ISettings from '@material-ui/icons/Settings';
import ISecurity from '@material-ui/icons/Security';
import INotifications from '@material-ui/icons/Notifications';

import { useTranslation } from 'react-i18next';
import CardWrapper from '../wrapper';
import { useLocation } from 'react-router-dom';

const LinkIcon = ({ name, color }: { name: string; color: string }) => {
  switch (name) {
    case 'face':
      return <IFace className={color} />;
    case 'settings':
      return <ISettings className={color} />;
    case 'security':
      return <ISecurity className={color} />;
    case 'notifications':
    default:
      return <INotifications className={color} />;
  }
};

type PropsType = {
  to: string;
  title: string;
  iconName: string;
  color: string;
  activeColor?: string;
  disabled?: boolean;
};

const CardLink = ({
  to,
  title,
  iconName,
  color,
  activeColor,
  disabled,
}: PropsType) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <CardWrapper
      active={active}
      activeColor={activeColor}
      to={to || ''}
      disabled={disabled}
    >
      <div className="ml-2">
        <LinkIcon name={iconName} color={active ? 'text-white' : color} />
      </div>

      <div className="media-body ml-3 overflow-hidden border-top">
        <div className={`d-flex align-items-center my-2 py-2`}>
          <h6 className="text-truncate mb-0 mr-auto">{t(title)}</h6>
          <IChevronRight className="text-nowrap text-muted" />
        </div>
      </div>
    </CardWrapper>
  );
};

export default CardLink;
