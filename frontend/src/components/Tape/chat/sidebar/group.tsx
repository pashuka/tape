import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  DialogType,
  dialogMembersOffsetAtom,
  dialogMembersState,
  DialogMemberType,
} from '../../../../hooks/recoil/dialog';
import Avatar from '../../components/avatar';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValueLoadable, useRecoilValue } from 'recoil';
import { limitFetchMax } from '../../../../hooks/recoil/constants';
import CardHeader from '../../sidebar/cards/header';
import CardMember from './member';
import { authState } from '../../../../hooks/recoil/auth';

dayjs.extend(relativeTime);

type PropsType = {
  scrollBottom: boolean;
  dialog: DialogType;
};

const SideBarBodyDialogGroup = ({ scrollBottom, dialog }: PropsType) => {
  const { t } = useTranslation();
  const title = dialog.profile.title;

  const iam = useRecoilValue(authState);
  const [offset, setOffset] = useRecoilState(dialogMembersOffsetAtom);
  const { state, contents } = useRecoilValueLoadable(dialogMembersState);
  const [records, setRecords] = React.useState<DialogMemberType[]>(
    [] as DialogMemberType[],
  );

  React.useEffect(() => {
    if (scrollBottom && offset + limitFetchMax === records.length) {
      setOffset((currVal: number) => currVal + limitFetchMax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollBottom]);

  React.useEffect(() => {
    if (state === 'hasValue' && Array.isArray(contents)) {
      setRecords(contents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, contents]);

  return (
    <div className="hide-scrollbar flex-fill bg-white">
      <div className="border-bottom text-center mt-4 py-4">
        <Avatar picture={dialog.profile.picture} size="lg" group={true} />
        <h5 className="pt-4">{title}</h5>
        {dialog.profile.description && (
          <p className="text-muted">{dialog.profile.description}</p>
        )}
        <p className="text-muted small">
          {dialog.member_count} {t('members')}
        </p>
      </div>
      <CardHeader title="Members" />
      {iam && (
        <CardMember
          key={iam.username}
          username={iam.username}
          role={dialog.role}
        />
      )}
      {records.map(({ username, role }) => (
        <CardMember key={username} username={username} role={role} />
      ))}
    </div>
  );
};

export default SideBarBodyDialogGroup;
