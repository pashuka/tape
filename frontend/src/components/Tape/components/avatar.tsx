import React from 'react';
import IAccountCircle from '@material-ui/icons/AccountCircle';
import { routes } from '../../../constants';

export type iconSizeType = 'xs' | 'sm' | 'md' | 'lg';

const iconSize = {
  xs: 32,
  sm: 48,
  md: 56,
  lg: 80,
};

type PropsType = {
  active?: boolean;
  online?: boolean;
  picture?: string;
  realname?: string;
  username?: string;
  size?: iconSizeType;
  color?: string;
};

const Avatar = ({
  active,
  online,
  picture,
  realname,
  username,
  size,
  color,
}: PropsType) => {
  return (
    <div className={`card-avatar ${online ? 'online' : ''}`}>
      {picture ? (
        <img
          className="rounded-circle"
          src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${picture}`}
          alt={realname || username}
        />
      ) : (
        <IAccountCircle
          fontSize="inherit"
          className={active ? 'text-white' : color || 'text-gray-200'}
          style={
            size && {
              width: iconSize[size] + 'px',
              height: iconSize[size] + 'px',
            }
          }
        />
      )}
    </div>
  );
};

export default Avatar;
