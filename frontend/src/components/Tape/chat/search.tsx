import React from "react";

const Chat = () => {
  return (
    <div className="collapse border-bottom px-lg-8">
      <div className="container-xxl py-4 py-lg-6">
        <div className="input-group">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search this chat"
            aria-label="Search this chat"
          />

          <div className="input-group-append">
            <button className="btn btn-lg btn-ico btn-secondary btn-minimal" type="submit">
              <i className="fe-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
