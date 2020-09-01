import React from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import {
  MessengerAtom,
  MessengerType,
} from '../../../../hooks/recoil/messenger';

type PropsType = {
  active?: boolean;
  activeColor?: string;
  to?: string;
  disabled?: boolean;
  onSelect?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => void | undefined;
};

const CardWrapper: React.FC<PropsType> = ({
  to,
  active,
  activeColor,
  children,
  disabled,
  onSelect,
}) => {
  const setMessenger = useSetRecoilState(MessengerAtom);
  return (
    <Link
      className={`nav-link text-body p-0 ${disabled ? 'disabled' : ''}`}
      to={to || ''}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(e);
        } else {
          setMessenger((currVal: MessengerType) => ({
            ...currVal,
            isChatOpen: true,
            isChatSideBarOpen: false,
          }));
        }
      }}
    >
      <div
        className={`card border-0 rounded-0 ${
          active ? activeColor || 'alert-primary' : 'card-regular'
        }`}
      >
        <div className="card-body p-0 px-2">
          <div className="media d-flex align-items-center justify-content-center">
            {children}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardWrapper;
