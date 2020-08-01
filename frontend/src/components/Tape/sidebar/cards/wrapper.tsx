import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { MessengerAtom } from '../../../../hooks/recoil/messenger';

type PropsType = {
  active?: boolean;
  to?: string;
};

const CardWrapper: React.FC<PropsType> = ({ to, active, children }) => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  return (
    <Link
      className="nav-link text-body p-0"
      to={to || ''}
      onClick={(e) => {
        setMessenger({ isOpen: messenger.isOpen, isChatOpen: true });
      }}
    >
      <div
        className={`card border-0 rounded-0 ${
          active ? 'alert-primary' : 'card-regular'
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
