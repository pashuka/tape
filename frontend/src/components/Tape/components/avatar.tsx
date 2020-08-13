import React from 'react';
import IAccountCircle from '@material-ui/icons/AccountCircle';
import { routes } from '../../../constants';
import Skeleton from '../../Skeleton';

export type iconSizeType = 'xs' | 'sm' | 'md' | 'lg';

const iconSize = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 80,
};

type PropsType = {
  pending?: boolean;
  active?: boolean;
  online?: boolean;
  picture?: string;
  realname?: string;
  username?: string;
  size?: iconSizeType;
  color?: string;
};

const Avatar = ({
  pending,
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
      {pending ? (
        <Skeleton
          width={size ? iconSize[size] + 'px' : '48px'}
          height={size ? iconSize[size] + 'px' : '48px'}
          roundedCircle
        />
      ) : picture ? (
        <img
          className="rounded-circle"
          src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${picture}`}
          alt={realname || username}
          width={size ? iconSize[size] : iconSize['md']}
          height={size ? iconSize[size] : iconSize['md']}
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
