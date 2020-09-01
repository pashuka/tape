import React from 'react';
import {
  DialogType,
  dialogMembersSelector,
} from '../../../../../hooks/recoil/dialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { UserNameType } from '../../../../../hooks/recoil/user';
import HeaderDialogDirect from './direct';
import HeaderDialogGroup from './group';
import {
  MessengerAtom,
  MessengerType,
} from '../../../../../hooks/recoil/messenger';

dayjs.extend(relativeTime);

declare type PropsType = {
  dialog: DialogType;
};

const HeaderDialog = ({ dialog }: PropsType) => {
  const setMessenger = useSetRecoilState(MessengerAtom);
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

  let headerComponent = null;

  switch (dialog.dialog_type) {
    case 'direct':
      if (members.length) {
        headerComponent = (
          <HeaderDialogDirect
            dialog={dialog}
            username={members.length ? members[0].username : ''}
          />
        );
      }
      break;
    case 'group':
      headerComponent = <HeaderDialogGroup dialog={dialog} />;
      break;
    default:
      break;
  }

  return (
    <div
      className="col-8 col-xl-6"
      onClick={(e) => {
        setMessenger((currVal: MessengerType) => ({
          ...currVal,
          isChatSideBarOpen: true,
        }));
      }}
    >
      {headerComponent}
    </div>
  );
};
export default HeaderDialog;
