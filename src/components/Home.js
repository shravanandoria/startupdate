import React, { useEffect, useState } from "react";
import CampaignFactory from "../abis/CampaignFactory.json";
import CardItem from "./CardItem";
import { Link } from "react-router-dom";

const Home = (props) => {
  return (
    <>
      <div className="container my-3 md:flex md:flex-col md:items-center md:justify-center ">
        <h1 className="text-center font-extrabold md:text-3xl my-3 ">
          ALL CAMPAIGNS
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:px-6 h-full ">
          {props.campaigns.map((result, index) => {
            return (
              <CardItem
                key={index}
                campaign={result.campaign}
                title={result.title}
                description={result.description}
                image={result.image}
                time={result.time}
                id={result.id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
