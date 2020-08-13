import React from 'react';

import CardBasic from './basic';
import { ParamsKeyUser, routes } from '../../../../constants';
import { instanceOfDialog } from '../../../../hooks/recoil/dialog';
import { UserType } from '../../../../hooks/recoil/user';

type CardSearchPropsType = {
  user: UserType;
};

const CardSearch = ({ user }: CardSearchPropsType) => {
  const dialog = {};
  const baseUrl = `/${routes.tape}/${routes.dialogs}/`;
  const to = instanceOfDialog(dialog)
    ? `${dialog.id}`
    : `${ParamsKeyUser}/${user.username}`;
  return <CardBasic to={baseUrl + to} avaSize="sm" members={user} />;
};

export default CardSearch;
