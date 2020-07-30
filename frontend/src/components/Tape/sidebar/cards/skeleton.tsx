import React from 'react';
import Skeleton from '../../../Skeleton';

const CardSkeleton = () => (
  <div className="nav-link btn btn-link text-body p-0">
    <div className="card border-0 rounded-0 card-regular">
      <div className="card-body py-2 py-lg-2">
        <div className="media">
          <div className="avatar mt-2 mb-2 mr-3">
            <Skeleton roundedCircle />
          </div>

          <div className="media-body overflow-hidden">
            <div className="d-flex align-items-center">
              <h6 className="text-truncate mb-0 mr-auto">
                <Skeleton width="64px" />
              </h6>
              <p className="small text-muted text-nowrap ml-4">
                <Skeleton width="32px" height="16px" />
              </p>
            </div>
            <div className="text-muted text-truncate text-left">
              <Skeleton width="128px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CardSkeleton;
