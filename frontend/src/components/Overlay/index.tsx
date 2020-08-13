import React from 'react';

type PropsType = {
  size?: 'md' | 'sm';
  badge?: boolean;
};

const Overlay = ({ size = 'md', badge }: PropsType) => (
  <div
    className={`d-flex justify-content-center align-items-center ${
      badge ? 'bg-white rounded-circle p-1 shadow-sm' : ''
    }`}
  >
    <svg className={`spinner-dash-${size}`} viewBox="0 0 50 50">
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  </div>
);

export default Overlay;
