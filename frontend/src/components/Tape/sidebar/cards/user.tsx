import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import CardBasic from './basic';
import {
  ParamsKeyUser,
  QSParamsType,
  ParamsKeyDialog,
  routes,
} from '../../../../constants';
import { UserType } from '../../../../hooks/recoil/user';
import { instanceOfDialog } from '../../../../hooks/recoil/dialog';

type PropsType = {
  participant: UserType;
};

const CardUser = ({ participant }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const dialog = {};
  const baseUrl = `/${routes.tape}/${routes.dialogs}/`;
  const to = instanceOfDialog(dialog)
    ? `${dialog.id}`
    : `${ParamsKeyUser}/${participant.username}`;
  return (
    <CardBasic
      active={
        instanceOfDialog(dialog) &&
        dialog.id.toString() === params[ParamsKeyDialog]
      }
      to={baseUrl + to}
      avaSize="sm"
      members={participant}
    />
  );
};

export default CardUser;
