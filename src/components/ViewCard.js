import React from "react";

const ViewCard = (props) => {
  return (
    <div>
      <div className="card text-white bg-dark mb-3 m-3 shadow-xl lg:h-40 lg:transform lg:transition lg:duration-500 lg:hover:scale-110">
        <div className="card-header">
          <b> {props.header}</b>
        </div>
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text text-sm text-gray-500">{props.body}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewCard;
