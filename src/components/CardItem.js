import React from "react";
import { Link } from "react-router-dom";

const CardItem = (props) => {
  return (
    <>
      <div className=" max-w-sm md:w-auto lg:w-full bg-white  rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700 md:mx-5 lg:mx-0 h-full">
        <img
          className="rounded-t-lg object-cover md:h-52 w-full"
          src={props.image}
          alt=""
        />
        <div className="flex flex-col items-start justify-start w-full h-auto p-2">
          <h5 className="mb-2 text-2xl lg:text-2xl w-full font-bold tracking-tight text-black dark:text-white">
            {props.title}
          </h5>
          <p className="font-normal text-black dark:text-gray-400 h-20">
            {props.description.slice(0, 80)}.....
          </p>
          <Link
            to={`/campaign/${props.campaign}/${props.id}`}
            className="inline-flex items-center bottom-0 py-2 px-3 my-2 text-sm font-medium text-center text-white cursor-pointer bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            View Campaign
            <svg
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CardItem;
