import React from 'react';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import {
  MessengerType,
  MessengerAtom,
} from '../../../../hooks/recoil/messenger';
import { useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import {
  DialogType,
  dialogMembersSelector,
} from '../../../../hooks/recoil/dialog';
import { UserNameType } from '../../../../hooks/recoil/user';
import SideBarBodyDialogDirect from './direct';
import SideBarBodyDialogGroup from './group';
import { useTranslation } from 'react-i18next';

const SideBarHeader = () => {
  const { t } = useTranslation();
  const setMessenger = useSetRecoilState(MessengerAtom);
  return (
    <div className="py-2 py-lg-3">
      <div className="container-fluid">
        <ul className="nav justify-content-between align-items-center">
          <li className="nav-item list-inline-item">
            <button
              type="button"
              className="nav-link btn btn-link text-muted px-0"
              onClick={(e) => {
                setMessenger((currVal: MessengerType) => ({
                  ...currVal,
                  isChatSideBarOpen: false,
                }));
              }}
            >
              <IChevronLeft />
            </button>
          </li>
          <li className="text-center d-block">
            <h6 className="text-truncate m-0">{t('Information')}</h6>
          </li>
          {/* Spacer */}
          <li className="nav-item list-inline-item px-2"> </li>
        </ul>
      </div>
    </div>
  );
};

type BodyPropsType = {
  scrollBottom: boolean;
  dialog: DialogType;
};

const SideBarBody = ({ scrollBottom, dialog }: BodyPropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    dialogMembersSelector({ dialog_id: dialog.id, offset: 0 }),
  );
  const [members, setMembers] = React.useState<UserNameType[]>(
    [] as UserNameType[],
  );
  React.useEffect(() => {
    if (state === 'hasValue' && Array.isArray(contents)) {
      setMembers(contents);
    }
  }, [state, contents]);

  switch (dialog.dialog_type) {
    case 'direct':
      if (members.length) {
        return (
          <SideBarBodyDialogDirect
            dialog={dialog}
            username={members.length ? members[0].username : ''}
          />
        );
      }
      break;

    case 'group':
      return (
        <SideBarBodyDialogGroup scrollBottom={scrollBottom} dialog={dialog} />
      );
    default:
      break;
  }
  return null;
};

type PropsType = {
  isOpen?: boolean;
  dialog: DialogType | undefined;
};

const ChatSideBar = ({ dialog, isOpen }: PropsType) => {
  const [sidebarScrollOnBottom, setSidebarScrollOnBottom] = React.useState(
    false,
  );
  if (!dialog) return null;
  return (
    <div
      className={`chat-sidebar ${isOpen ? 'chat-sidebar-visible' : ''}`}
      onScroll={(e: React.UIEvent<HTMLElement>) => {
        const el = e.currentTarget;
        if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
          setSidebarScrollOnBottom(true);
        } else {
          setSidebarScrollOnBottom(false);
        }
      }}
    >
      <div className="d-flex h-100 flex-column">
        <SideBarHeader />
        <SideBarBody scrollBottom={sidebarScrollOnBottom} dialog={dialog} />
      </div>
    </div>
  );
};
export default ChatSideBar;
