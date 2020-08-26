import React from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';

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
import { getDialog, instanceOfDialog } from '../../../hooks/recoil/dialog';

const Chat = () => {
  const { params } = useRouteMatch<QSParamsType>();
  const iam = useRecoilValue(authState);
  const { state, contents } = useRecoilValueLoadable(
    getDialog(params[ParamsKeyDialog]),
  );

  if (!iam) {
    return null;
  }
  if (!params[ParamsKeyUser] && !params[ParamsKeyDialog]) {
    return <Cover iam={iam} />;
  }

  return (
    <div className="chat">
      <div className="chat-body bg-white">
        <Header
          dialog={
            state === 'hasValue' && instanceOfDialog(contents)
              ? contents
              : undefined
          }
          // username={params[ParamsKeyUser]}
        />
        <SearchBar />
        <Content iam={iam} />
        <Footer />
      </div>
    </div>
  );
};

export default Chat;
