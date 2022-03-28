import React, { useEffect, useRef, useState } from "react";
import CampaignCard from "./CampaignCard";
import CampaignFactory from "../abis/CampaignFactory.json";
import Campaign from "../abis/Campaign.json";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ViewCard from "./ViewCard";

const ViewCampaign = (props) => {
  const param = useParams();
  const navigate = useNavigate();

  const [manager, setManager] = useState();
  const [min_contri, setMin_contri] = useState();
  const [requests, setRequests] = useState(0);
  const [approversCount, setApproversCount] = useState(0);
  const [campaignBalance, setCampaignBalance] = useState(0);
  const [amount, setAmount] = useState();
  const [campaign, setCampaign] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [indexCampaign, setIndexCampaign] = useState({});

  const campaignInfo = async () => {
    const web3 = window.web3;
    const campaign = new web3.eth.Contract(Campaign.abi, param.id);
    const manager = await campaign.methods.manager().call();
    setManager(manager);
    const contri = await campaign.methods.minimumAmount().call();
    setMin_contri(web3.utils.fromWei(contri.toString(), "ether"));
    const requests = await campaign.methods.getRequestCount().call();
    setRequests(requests.toString());
    const approversCount = await campaign.methods.approversCount().call();
    setApproversCount(approversCount.toString());
  };

  const campaignContract = async () => {
    const web3 = window.web3;
    const campaign = new web3.eth.Contract(Campaign.abi, param.id);
    setCampaign(campaign);
    const campaignBalance = await campaign.methods.getCampaignBalance().call();
    setCampaignBalance(web3.utils.fromWei(campaignBalance.toString(), "ether"));
  };

  const contribute = async () => {
    try {
      setLoading(true);
      setError(false);
      setIsError(false);
      const web3 = window.web3;
      const contribution = web3.utils.toWei(amount, "ether");
      await campaign.methods
        .contribute()
        .send({ from: props.account, value: contribution });
      setAmount(0);
      setLoading(false);
    } catch (error) {
      setIsError(true);
      setError(error.message);
      setLoading(false);
    }
  };

  const indexedCampaign = async (index) => {
    const web3 = window.web3;

    const networkId = await web3.eth.net.getId();
    const networkData = CampaignFactory.networks[networkId];
    if (networkData) {
      const campaignFactory = new web3.eth.Contract(
        CampaignFactory.abi,
        networkData.address
      );
      const campaignInfo = await campaignFactory.methods
        .campaigns(index)
        .call();
      let indexCampaign = {};
      const { campaign, description, id, image, time, title } = campaignInfo;
      indexCampaign.campaign = campaign;
      indexCampaign.description = description;
      indexCampaign.id = id;
      indexCampaign.image = image;
      indexCampaign.time = time;
      indexCampaign.title = title;
      setIndexCampaign(indexCampaign);
    }
  };

  useEffect(() => {
    props.loadWeb3();
    indexedCampaign(param.index);
    campaignContract();
    campaignInfo();
  }, [amount]);
  return (
    <div>
      {isError && <div class="alert alert-danger">{error}</div>}
      <div className="w-full flex h-full flex-col  justify-center items-center px-3 ">
        <img
          className="rounded w-72 mt-4 shadow-lg md:w-full md:h-80 lg:w-80"
          src={indexCampaign.image}
          alt=""
        />
        <h1 className="px-3 my-3 w-full  font-semibold text-center text-white lg:text-xl xl:text-2xl md:py-0">
          {indexCampaign.title}
        </h1>
      </div>
      <hr className="mx-3 mb-2 md:hidden" />
      <div className="mx-3 text-white rounded-lg shadow-lg p-2 lg:text-xl xl:text-2xl ">
        {indexCampaign.description}
      </div>

      <hr className="my-4 mx-3" />

      <div className="lg:grid lg:grid-cols-3 xl:grid-cols-4 ">
        <div className="Contribution lg:flex lg:flex-col lg:card lg:bg-white mx-3 lg:rounded-md lg:h-auto lg:my-4 lg:shadow-lg">
          <h1 className="mx-3 mt-3 mb-1 text-left font-bold md:text-xl xl:text-2xl w-full">
            Amount To Contribute
          </h1>
          <div className="flex items-center h-full mx-3 md:grid md:grid-cols-5 justify-center lg:flex">
            <input
              required
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              value={amount}
              className="rounded-l py-2 md:col-span-3"
              step="any"
              type="number"
              name="contribute"
              id="contribute"
              placeholder="Eth Amount"
            />
            <div className="rounded-r bg-dark text-white w-full text-center h-full py-2 md:h-auto  md:px-2 md:my-2">
              Ether
            </div>

            <button
              disabled={loading}
              onClick={contribute}
              className="mx-3 btn bg-indigo-600 my-2 text-white font-semibold hidden md:block lg:hidden "
            >
              {loading ? (
                <div class="spinner-border text-light h-6 w-6" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                "Contribute!"
              )}
            </button>
          </div>

          <button
            disabled={loading}
            onClick={contribute}
            className="mx-3 btn bg-indigo-600 my-2 text-white font-semibold md:hidden lg:block lg:my-4"
          >
            {loading ? (
              <div class="spinner-border text-light h-6 w-6" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              "Contribute!"
            )}
          </button>
        </div>
        <ViewCard
          title={manager}
          header={"Address of Campaign Creator"}
          body={
            "The manager created this campaign and can create request to withdraw money"
          }
        />
        <ViewCard
          title={min_contri + " ETH"}
          header={"Minimum Contribution"}
          body={
            "You must contribute atleast this much eth to become an approver"
          }
        />
        <ViewCard
          title={requests}
          header={"Number Of Requests"}
          body={
            "A request tries to withdraw money form the contract. Requests must be approved by the approvers"
          }
        />
        <ViewCard
          title={approversCount}
          header={"Number Of Approvers"}
          body={"Number of people who have already donated to this campaign"}
        />
        <ViewCard
          title={campaignBalance}
          header={"Campaign Balance (ether)"}
          body={
            "The balance is how much money this campaign has left to spend."
          }
        />
        <div className="col-end-5 mx-3 my-3 lg:col-start-1 lg:col-end-2 xl:col-start-4 xl:col-end-5 flex justify-center items-center">
          <Link to={`/campaign/${param.id}/requests`}>
            <button className="btn bg-indigo-600 text-white w-full">
              View Requests
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewCampaign;
