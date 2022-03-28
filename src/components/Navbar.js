import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";
const Navbar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg text-light navbar-dark bg-dark">
      <div className="container-fluid  ">
        <Link className="navbar-brand flex flex-row items-center" to="/">
          <img src={logo} alt="no-image" className="h-12 md:mr-3 " />
          StartupDate
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <span className="badge badge-light text-dark">
            <h5 className="text-white">
              <b className="text-white text-lg"> Address:</b> {props.account}
            </h5>
          </span>
          <Link to={"/create"}>
            <button className="btn btn-primary mx-3">
              Create <b className="text-lg">+</b>
            </button>
          </Link>
          {/* <div className="text-light"></div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
