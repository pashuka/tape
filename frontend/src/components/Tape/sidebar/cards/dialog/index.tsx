import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import {
  DialogType,
  dialogMembersSelector,
} from '../../../../../hooks/recoil/dialog';
import CardDialogDirect from './direct';
import { UserNameType } from '../../../../../hooks/recoil/user';
import CardDialogGroup from './group';

type PropsType = {
  dialog: DialogType;
};

const CardDialog = ({ dialog }: PropsType) => {
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
          <CardDialogDirect
            dialog={dialog}
            username={members.length ? members[0].username : ''}
          />
        );
      }
      return null;
    case 'group':
      return <CardDialogGroup dialog={dialog} />;
    default:
      return null;
  }
};

export default CardDialog;
