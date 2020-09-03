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
import { instanceOfDialog, dialogSelector } from '../../../hooks/recoil/dialog';
import { MessengerAtom } from '../../../hooks/recoil/messenger';
import ChatSideBar from './sidebar/index';

const Chat = () => {
  const { params } = useRouteMatch<QSParamsType>();
  const iam = useRecoilValue(authState);
  const { state, contents } = useRecoilValueLoadable(
    dialogSelector(Number(params[ParamsKeyDialog])),
  );
  const { isChatSideBarOpen } = useRecoilValue(MessengerAtom);

  if (!iam) {
    return null;
  }
  if (!params[ParamsKeyUser] && !params[ParamsKeyDialog]) {
    return <Cover iam={iam} />;
  }

  const dialog =
    state === 'hasValue' && instanceOfDialog(contents) ? contents : undefined;

  return (
    <div className="chat">
      <div className="chat-body bg-white">
        <Header dialog={dialog} />
        <SearchBar />
        <Content iam={iam} dialog={dialog} />
        <Footer />
      </div>
      <ChatSideBar dialog={dialog} isOpen={isChatSideBarOpen} />
    </div>
  );
};

export default Chat;
