import React from "react";
import Skeleton from "../../../Skeleton";

type MessageSkeletonPropsType = {
  isIam?: boolean;
};

export const MessageSkeleton = ({ isIam }: MessageSkeletonPropsType) =>
  isIam ? (
    <div className="message message-right">
      <div className="avatar avatar-sm ml-2 ml-lg-5 d-none d-lg-block">
        <Skeleton roundedCircle />
      </div>

      <div className="message-body">
        <div className="message-row">
          <div className="d-flex align-items-center justify-content-end">
            <Skeleton width="128px" height="64px" rounded />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="message">
      <a className="avatar avatar-sm mr-2 mr-lg-5" href="#chat-messages">
        <Skeleton roundedCircle />
      </a>

      <div className="message-body">
        <div className="message-row">
          <div className="d-flex align-items-center">
            <Skeleton width="128px" height="64px" rounded />
          </div>
        </div>
      </div>
    </div>
  );
