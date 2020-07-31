import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import CardLoadable from './loadable';
import {
  ParamsKeyUser,
  routes,
  QSParamsType,
  ParamsKeyDialog,
} from '../../../../constants';
import { ParticipantType } from '../../../../hooks/recoil/dialog';

type PropsType = {
  participant: ParticipantType;
};

const CardUserInfo = ({ participant }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const baseUrl = `/${routes.tape}/${routes.dialogs}/`;
  const to = participant.dialog_id
    ? `${participant.dialog_id}`
    : `${ParamsKeyUser}/${participant.username}`;
  return (
    <CardLoadable
      active={participant.dialog_id === params[ParamsKeyDialog]}
      to={baseUrl + to}
      avaSize="sm"
      username={participant.username}
    />
  );
};

export default CardUserInfo;
