import React from 'react';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import { useRecoilState } from 'recoil';

import { Link } from 'react-router-dom';
import { routes } from '../../../../constants';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import { useTranslation } from 'react-i18next';

declare type PropsType = {
  title: string;
};

const Header = ({ title }: PropsType) => {
  const { t } = useTranslation();
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);

  return (
    <div className="chat-header bg-light py-2 py-lg-3 px-2 px-lg-4">
      <div className="container-xxl">
        <div className="row align-items-center">
          <div className="col-2 d-xl-none">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link
                  to={`/${routes.tape}/${routes.settings.index}/`}
                  className="text-muted px-0"
                  onClick={(e) => {
                    setMessenger({
                      isOpen: messenger.isOpen,
                      isChatOpen: false,
                    });
                  }}
                >
                  <IChevronLeft />
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-8 col-xl-8">
            <div className="media text-center text-xl-left">
              <div className="media-body align-self-center text-truncate">
                <h6 className="text-truncate m-0">{t(title)}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
