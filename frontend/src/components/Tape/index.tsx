import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useSetRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';

import Navbar from './navbar';
import DialogsBar from './sidebar/dialogs';
import ParticipantsBar from './sidebar/participants';
import SettingsBar from './sidebar/settings';
import Chat from './chat/index';
import useUserAgent from '../../hooks/useUserAgent';
import { QSParamsType, ParamsKeyUser, ParamsKeyDialog } from '../../constants';
import { MessengerAtom } from '../../hooks/recoil/messenger';
import { currentDialogIdState } from '../../hooks/recoil/dialog';
import SettingsContent from './settings/index';
import { messagesOffsetAtom } from '../../hooks/recoil/message';
import { EventSourceStatusAtom } from '../../hooks/recoil/events';
import Modal from '../Modal';
import ModalBackdrop from '../Modal/backdrop';
import { useTranslation } from 'react-i18next';

export enum TabEnum {
  Dialogs,
  Participants,
  Settings,
}

type PropsType = {
  tab: TabEnum;
  route?: string;
};

const Messenger = ({ tab, route }: PropsType) => {
  const { t } = useTranslation();
  const { device } = useUserAgent();
  const [sidebarHeight, setSidebarHeight] = React.useState(0);
  const [sidebarScrollOnBottom, setSidebarScrollOnBottom] =
    React.useState(false);
  const refNavbar = React.createRef<HTMLDivElement>();

  const eventsStatus = useRecoilValue(EventSourceStatusAtom);
  const messenger = useRecoilValue(MessengerAtom);
  const setDialogId = useSetRecoilState(currentDialogIdState);
  const resetMessagesOffset = useResetRecoilState(messagesOffsetAtom);

  const { params } = useRouteMatch<QSParamsType>();

  // TODO: onSelect dialog scroll sidebar visible part to see selected dialog item
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop === 0) {
      // setSidebarScrollTop(true);
    } else if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
      setSidebarScrollOnBottom(true);
    } else {
      // setSidebarScrollTop(false);
      setSidebarScrollOnBottom(false);
    }
  };

  // The second argument is an array of values (usually props).
  // When it's an empty list, the callback will only be fired once, similar to componentDidMount.
  React.useEffect(() => {
    // Set specifics to messenger css styles
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';

    if (refNavbar.current) {
      // TODO: find the problem with zero offsetHeight and fix it
      setSidebarHeight(
        document.documentElement.clientHeight - 60, //refNavbar.current.clientHeight,
      );
    }

    return () => {
      // Unset specifics to messenger css styles
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setDialogId(Number(params[ParamsKeyDialog]));
    resetMessagesOffset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  let sidebarComponent = null;
  let mainComponent = null;
  switch (tab) {
    case TabEnum.Participants:
      sidebarComponent = (
        <ParticipantsBar scrollBottom={sidebarScrollOnBottom} />
      );
      mainComponent = <Chat />;
      break;

    case TabEnum.Settings:
      sidebarComponent = <SettingsBar scrollBottom={sidebarScrollOnBottom} />;
      mainComponent = <SettingsContent current={route} />;
      break;

    case TabEnum.Dialogs:
    default:
      sidebarComponent = <DialogsBar scrollBottom={sidebarScrollOnBottom} />;
      mainComponent = <Chat />;
      break;
  }
  return (
    <React.Fragment>
      <div className="messenger">
        <div
          ref={refNavbar}
          className="navigation navbar navbar-light justify-content-center py-xl-1 bg-white pt-0"
        >
          <Navbar />
        </div>
        <div
          onScroll={handleScroll}
          className="sidebar"
          style={{
            height: device.type === 'mobile' ? sidebarHeight : '',
          }}
        >
          {sidebarComponent}
        </div>
        <div
          className={`main ${
            (device.type === 'mobile' && params[ParamsKeyDialog]) ||
            params[ParamsKeyUser] ||
            messenger.isChatOpen
              ? 'main-visible'
              : ''
          }`}
        >
          {mainComponent}
        </div>
        {eventsStatus === 'error' && (
          <Modal
            title="Trying to reach server"
            body={
              <React.Fragment>
                <p>
                  {t(
                    'Please make sure that your device has network connectivity.',
                  )}
                </p>{' '}
                <p>
                  {t(
                    'You must have a strong and stable Internet connection on your computer to use Tape.',
                  )}
                </p>{' '}
              </React.Fragment>
            }
            buttons={[
              <button
                key="retry-now-button"
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                {t('Retry Now')}
              </button>,
            ]}
          />
        )}
      </div>
      {eventsStatus === 'error' && <ModalBackdrop />}
    </React.Fragment>
  );
};

export default Messenger;
