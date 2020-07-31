import React from 'react';
import { useRecoilValue } from 'recoil';

import CardBasic from './basic';
import { userInfoQuery } from '../../../../hooks/recoil/user';

type PropsType = {
  username: string;
};

const CardNew = ({ username }: PropsType) => {
  const participant = useRecoilValue(userInfoQuery(username));

  return <CardBasic active={true} member={participant} isCancelable={true} />;
};

export default CardNew;
