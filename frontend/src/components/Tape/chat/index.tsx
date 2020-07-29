import React from 'react';
import { useRecoilValue } from 'recoil';

import Header from './header/index';
import SearchBar from './search';
import Footer from './footer';
import Content from './content';
import { useRouteMatch } from 'react-router-dom';
import Cover from './cover';
import {
  QSParamsType,
  ParamsKeyUser,
  ParamsKeyDialog,
} from '../../../constants';
import { authState } from '../../../hooks/recoil/auth';
import { DialogType, DialogsState } from '../../../hooks/recoil/dialog';

const Chat = () => {
  const { params } = useRouteMatch<QSParamsType>();
  const iam = useRecoilValue(authState);
  const dialogs = useRecoilValue(DialogsState);
  const [dialog, setDialog] = React.useState<DialogType | undefined>(undefined);

  React.useEffect(() => {
    if (dialogs && params[ParamsKeyDialog]) {
      setDialog(dialogs?.find((_) => _.dialog_id === params[ParamsKeyDialog]));
    }
  }, [params, dialogs]);

  if (!iam) {
    return null;
  }
  if (!params[ParamsKeyUser] && !params[ParamsKeyDialog]) {
    return <Cover iam={iam} />;
  }

  return (
    <div className="chat">
      <div className="chat-body bg-white">
        <Header iam={iam} dialog={dialog} user={params[ParamsKeyUser]} />
        <SearchBar />
        <Content iam={iam} />
        <Footer />
      </div>
    </div>
  );
};

export default Chat;
