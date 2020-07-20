import React from "react";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(LocalizedFormat);

type PropsType = {
  createdAt: string;
  prevDay: string;
  isScrolling?: boolean;
  isSticky?: boolean;
};

const Day = ({ createdAt, prevDay, isScrolling, isSticky }: PropsType) => {
  const day = dayjs(createdAt);
  const prev = dayjs(prevDay);
  if (prevDay && prev.isSame(createdAt, "day")) return null;

  return (
    <div
      className={`message-divider ${isSticky ? "sticky-top" : ""} my-9 mx-lg-5 ${
        isScrolling ? "" : ""
      }`}
    >
      <div className="mx-auto text-center pt-3 pb-3">
        <small className="alert alert-success small font-weight-light p-1">
          {day.isToday() ? "Today" : day.isYesterday() ? "Yesterday" : day.format("ll")}
        </small>
      </div>
    </div>
  );
};

export default Day;
