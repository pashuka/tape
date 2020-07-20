import React from "react";
import CardSkeleton from "./cards/skeleton";

const DialogsSkeleton = ({ count = 10 }) => (
  <React.Fragment>
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <CardSkeleton key={i} />
      ))}
  </React.Fragment>
);

export default DialogsSkeleton;
