import React from 'react';

type SkeletonPropsType = {
  width?: string;
  height?: string;
  color?: string;
  rounded?: boolean;
  roundedCircle?: boolean;
  animated?: boolean;
};

const Skeleton = ({
  width = '100%',
  height = '100%',
  color = '#EFF1F6',
  animated = true,
  rounded = false,
  roundedCircle,
}: SkeletonPropsType) => {
  return (
    <span
      className={`skeleton ${rounded ? 'rounded' : ''}  ${
        roundedCircle ? 'rounded-circle' : ''
      } ${animated ? 'animated' : ''}`}
      style={{
        width,
        height,
        backgroundColor: color,
      }}
    >
      &zwnj;&nbsp;
    </span>
  );
};

export default Skeleton;
