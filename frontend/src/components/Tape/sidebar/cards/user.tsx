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
import { MemberType, instanceOfMember } from '../../../../hooks/recoil/member';

type PropsType = {
  member: UserType | MemberType;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

const CardUser = ({ member, selectable, selected, onSelect }: PropsType) => {
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
      avaSize="md"
      members={member}
      selectable={selectable}
      selected={selected}
      onSelect={(e) => onSelect && onSelect(member.username)}
    />
  );
};

export default CardUser;
