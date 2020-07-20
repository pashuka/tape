import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFetch } from "react-async";
import { useResetRecoilState } from "recoil";

import { host, apis, routes } from "../../constants";
import Overlay from "../../components/Overlay/index";
import { AuthAtom } from "../../hooks/recoil/auth";

const SignOut = () => {
  const history = useHistory();
  const resetAuth = useResetRecoilState(AuthAtom);
  const { isPending } = useFetch(`${host}/${apis.version}/${routes.auth.signout}`, {
    defer: true,
  });

  useEffect(() => {
    if (!isPending) {
      resetAuth();
      history.push("/");
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
