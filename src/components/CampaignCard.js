import React from "react";

const CampaignCard = (props) => {
  return (
    <div className="container my-2">
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{props.subtitle}</h6>
          <p className="card-text">{props.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
