import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import IPerson from '@material-ui/icons/Person';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  ParamsKeyUser,
  routes,
  QSParamsType,
  ParamsKeyDialog,
} from '../../../../constants';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import { dialogParticipant } from '../../../../hooks/recoil/dialog';
import { useTranslation } from 'react-i18next';

type PropsType = {
  to: string;
  title: string;
};

const CardSettings = ({ to, title }: PropsType) => {
  const { t } = useTranslation();
  const { params } = useRouteMatch<QSParamsType>();
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);

  return (
    <Link
      className="nav-link btn btn-link text-body p-0 m-1"
      to={to}
      onClick={(e) => {
        setMessenger({ isOpen: messenger.isOpen, isChatOpen: true });
      }}
    >
      <div
        className={`card border-0 rounded-0 ${
          false ? 'alert-primary' : 'card-regular'
        }`}
      >
        <div className="card-body py-2 py-lg-2">
          <div className="media">
            <div className="avatar avatar-sm mr-3">
              <IPerson fontSize="large" className="m-1 text-white" />
            </div>

            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center">
                <h6 className="text-truncate mt-2 mb-0 pt-1 mr-auto">
                  {t(title)}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardSettings;
