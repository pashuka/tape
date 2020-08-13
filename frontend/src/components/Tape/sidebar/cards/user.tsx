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
import { MemberType, instanceOfMember } from '../../../../hooks/recoil/members';

type PropsType = {
  member: UserType | MemberType;
};

const CardUser = ({ member }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const baseUrl = `/${routes.tape}/${routes.participants}/`;
  const to = instanceOfMember(member)
    ? `${member.dialog_id}`
    : `${ParamsKeyUser}/${member.username}`;
  return (
    <CardBasic
      active={
        instanceOfMember(member) &&
        member.dialog_id.toString() === params[ParamsKeyDialog]
      }
      to={baseUrl + to}
      avaSize="sm"
      members={member}
    />
  );
};

export default CardUser;
