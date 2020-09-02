import React from 'react';

type PropsType = {
  prop?: boolean;
};

const withHOC = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & PropsType> => ({ prop, ...props }: PropsType) =>
  prop ? <span>HOC</span> : <Component {...(props as P)} />;
