import React from 'react';

const Overlay = () => (
  <div className="d-flex justify-content-center">
    <svg className="spinner-dash" viewBox="0 0 50 50">
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
