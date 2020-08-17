import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import CardBasic from '../basic';
import {
  QSParamsType,
  ParamsKeyDialog,
  routes,
} from '../../../../../constants';
import { DialogType } from '../../../../../hooks/recoil/dialog';
import { membersByDialog } from '../../../../../hooks/recoil/member';

type PropsType = {
  dialog: DialogType;
};

const CardDialog = ({ dialog }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const { state, contents } = useRecoilValueLoadable(
    membersByDialog({ dialog_id: dialog.id, offset: 0 }),
  );

  return (
    <CardBasic
      active={dialog.id.toString() === params[ParamsKeyDialog]}
      to={`/${routes.tape}/${routes.dialogs}/${dialog.id}`}
      members={
        state === 'hasValue' && Array.isArray(contents) ? contents : undefined
      }
      dialog={dialog}
    />
  );
};

export default CardDialog;
