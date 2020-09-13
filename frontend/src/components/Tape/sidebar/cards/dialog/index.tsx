import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import {
  dialogMembersSelector,
  dialogSelector,
  DialogIdType,
  DialogType,
  instanceOfDialog,
} from '../../../../../hooks/recoil/dialog';
import CardDialogDirect from './direct';
import { UserNameType } from '../../../../../hooks/recoil/user';
import CardDialogGroup from './group';

type PropsType = {
  dialog_id: DialogIdType;
};

const CardDialog = ({ dialog_id }: PropsType) => {
  const [dialog, setDialog] = React.useState<DialogType | undefined>();
  const { state: dState, contents: dContents } = useRecoilValueLoadable(
    dialogSelector(dialog_id),
  );
  const [members, setMembers] = React.useState<UserNameType[]>(
    [] as UserNameType[],
  );
  const { state: mState, contents: mContents } = useRecoilValueLoadable(
    dialogMembersSelector({ dialog_id, offset: 0 }),
  );

  React.useEffect(() => {
    if (dState === 'hasValue' && instanceOfDialog(dContents)) {
      setDialog(dContents);
    }
  }, [dState, dContents]);

  React.useEffect(() => {
    if (mState === 'hasValue' && Array.isArray(mContents)) {
      setMembers(mContents);
    }
  }, [mState, mContents]);

  if (!dialog) {
    return null;
  }

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
