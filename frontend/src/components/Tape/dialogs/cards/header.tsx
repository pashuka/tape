import React from "react";

declare type CardHeaderPropsType = {
  title: string;
};

const CardHeader = ({ title }: CardHeaderPropsType) => (
  <div className="card bg-gray-200 rounded-0 border-0">
    <div className="card-body p-1 pl-3">
      <p className="card-text small text-uppercase text-muted">{title}</p>
    </div>
  </div>
);

export default CardHeader;
