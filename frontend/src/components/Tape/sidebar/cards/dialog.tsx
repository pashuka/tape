import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import CardBasic from './basic';
import { QSParamsType, ParamsKeyDialog, routes } from '../../../../constants';
import { authState } from '../../../../hooks/recoil/auth';
import { userInfoQuery } from '../../../../hooks/recoil/user';
import { DialogType } from '../../../../hooks/recoil/dialog';

type PropsType = {
  dialog: DialogType;
};

const CardDialog = ({ dialog }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const iam = useRecoilValue(authState);
  const participantName =
    dialog.participants.find((_) => _ !== iam?.username) || '';
  const participant = useRecoilValue(userInfoQuery(participantName));

  return (
    <CardBasic
      active={dialog.dialog_id === params[ParamsKeyDialog]}
      to={`/${routes.tape}/${routes.dialogs}/${dialog.dialog_id}`}
      member={participant}
      dialog={dialog}
    />
  );
};

export default CardDialog;
