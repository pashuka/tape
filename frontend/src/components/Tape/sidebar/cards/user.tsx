import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import CardBasic from './basic';
import {
  ParamsKeyUser,
  QSParamsType,
  ParamsKeyDialog,
  routes,
} from '../../../../constants';
import { UserType } from '../../../../hooks/recoil/user';
import {
  dialogParticipant,
  instanceOfDialog,
} from '../../../../hooks/recoil/dialog';

type PropsType = {
  participant: UserType;
};

const CardUser = ({ participant }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const dialog = useRecoilValue(dialogParticipant(participant.username));
  const baseUrl = `/${routes.tape}/${routes.dialogs}/`;
  const to = instanceOfDialog(dialog)
    ? `${dialog.dialog_id}`
    : `${ParamsKeyUser}/${participant.username}`;
  return (
    <CardBasic
      active={
        instanceOfDialog(dialog) && dialog.dialog_id === params[ParamsKeyDialog]
      }
      to={baseUrl + to}
      avaSize="sm"
      member={participant}
    />
  );
};

export default CardUser;
