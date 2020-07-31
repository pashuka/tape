import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useFetch } from 'react-async';
import { useResetRecoilState } from 'recoil';

import { routes, getRoute } from '../../constants';
import Overlay from '../../components/Overlay/index';
import { authState } from '../../hooks/recoil/auth';

const SignOut = () => {
  const history = useHistory();
  const reset = useResetRecoilState(authState);
  const { isPending } = useFetch(getRoute(`${routes.auth.signout}`), {
    defer: true,
  });

  useEffect(() => {
    if (!isPending) {
      reset();
      history.push('/');
    }
    // eslint-disable-next-line
  }, [isPending]);

  return (
    <div className="col mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col col-md-5">
          <Overlay />
        </div>
      </div>
    </div>
  );
};

export default SignOut;
