import React from 'react';
import { useRecoilValue } from 'recoil';

import CardBasic from './basic';
import { ParamsKeyUser, routes } from '../../../../constants';
import {
  instanceOfDialog,
  dialogParticipant,
} from '../../../../hooks/recoil/dialog';
import { UserType } from '../../../../hooks/recoil/user';

type CardSearchPropsType = {
  user: UserType;
};

const CardSearch = ({ user }: CardSearchPropsType) => {
  const dialog = useRecoilValue(dialogParticipant(user.username));
  const baseUrl = `/${routes.tape}/${routes.dialogs}/`;
  const to = instanceOfDialog(dialog)
    ? `${dialog.dialog_id}`
    : `${ParamsKeyUser}/${user.username}`;
  return <CardBasic to={baseUrl + to} avaSize="sm" member={user} />;
};

export default CardSearch;
