import React, { useEffect, useState } from "react";
import Campaign from "../abis/Campaign.json";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const ViewRequest = (props) => {
  const navigate = useNavigate();
  const param = useParams();

  const [manager, setManager] = useState("");
  const [signedUser, setSignedUser] = useState("");
  const [requests, setRequests] = useState([]);
  const [approversCount, setApproversCount] = useState(0);
  const [campaign, setCampaign] = useState();
  const [web3, setWeb3] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [finalizeSuccess, setFinalizeSuccess] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      setError(false);
      const web3 = window.web3;
      setWeb3(web3);
      const campaign = new web3.eth.Contract(Campaign.abi, param.id);
      setCampaign(campaign);
      const manager = await campaign.methods.manager().call();
      setManager(manager);
      const signedUser = await web3.eth.getAccounts();
      setSignedUser(signedUser[0]);
      const requestCount = await campaign.methods.getRequestCount().call();
      const approversCount = await campaign.methods.approversCount().call();
      setApproversCount(approversCount.toString());
      let requests = [];
      for (let i = 0; i < requestCount; i++) {
        const request = await campaign.methods.requests(i).call();
        requests[i] = request;
      }
      setRequests(requests);
      <div className="spinner-border text-light" role="status">
        <span className="sr-only">Loading...</span>
      </div>;
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const approveRequest = async (index) => {
    setLoading(true);
    try {
      await campaign.methods
        .approveRequest(index)
        .send({ from: props.account });
      setApproveSuccess(true);
    } catch (error) {
      setApproveSuccess(false);
      setError(true);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const finalizeRequest = async (index) => {
    setLoading(true);
    try {
      setError(false);
      await campaign.methods
        .finalizeRequest(index)
        .send({ from: props.account });
      setFinalizeSuccess(true);
    } catch (error) {
      setFinalizeSuccess(false);
      setError(true);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);

    props.loadWeb3();
    fetchRequests();
  }, [approveSuccess, finalizeSuccess]);
  return (
    <>
      {error && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="container my-4 rounded ">
        {signedUser === manager ? (
          <Link to={`/campaign/${param.id}/requests/new`}>
            <button className="btn bg-indigo-800 text-white my-3">
              Add Request
            </button>
          </Link>
        ) : (
          ""
        )}
        <div className="flex flex-col overflow-hidden">
          <div className="  sm:-mx-6 lg:-mx-8 ">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8 ">
              <div className="">
                <table className="min-w-full  ">
                  <thead className="bg-white ">
                    <tr className="bg-dark  ">
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4 text-left"
                      >
                        Id
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4 text-left"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4 text-left"
                      >
                        Amount (Eth)
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4 text-left"
                      >
                        Recipient
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4 text-left"
                      >
                        Approval Count
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4 text-left"
                      >
                        Approval
                      </th>
                      {manager === signedUser ? (
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4 text-left"
                        >
                          Finalize
                        </th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, index) => {
                      let complete = request.complete;
                      const style = `text-sm text-gray-900 ${
                        complete ? "bg-gray-300" : ""
                      } font-light px-6 py-4 whitespace-nowrap`;
                      return (
                        <tr className="bg-gray-100 border-b">
                          <td
                            className={`px-6 py-4 ${
                              complete ? "bg-gray-300" : ""
                            } whitespace-nowrap text-sm font-medium text-gray-900  `}
                          >
                            {request.id}
                          </td>
                          <td className={style}>
                            {request.description.slice(0, 30)}...
                          </td>
                          <td className={style}>
                            {web3.utils.fromWei(request.amount, "ether")}
                          </td>
                          <td className={style}>{request.recipient}</td>
                          <td className={style}>
                            {request.approvalCount}/{approversCount}
                          </td>
                          <td
                            className={`text-sm ${
                              !complete
                                ? "text-white font-bold bg-green-800 cursor-pointer"
                                : "text-gray-800 bg-gray-500 cursor-default"
                            } text-center px-6 py-4 whitespace-nowrap`}
                            onClick={() => {
                              approveRequest(index);
                            }}
                          >
                            {loading ? (
                              <div
                                className="spinner-border text-light"
                                role="status"
                              >
                                <span className="sr-only">Loading...</span>
                              </div>
                            ) : (
                              "Approve"
                            )}
                          </td>
                          {manager === signedUser ? (
                            <td
                              className={`text-sm ${
                                !complete
                                  ? "text-white bg-red-800 cursor-pointer"
                                  : "text-gray-800 bg-gray-500 cursor-default font-normal"
                              }   text-center px-6 py-4 whitespace-nowrap`}
                              onClick={() => {
                                if (!complete) {
                                  finalizeRequest(index);
                                }
                              }}
                            >
                              {loading ? (
                                <div
                                  className="spinner-border text-light"
                                  role="status"
                                >
                                  <span className="sr-only">Loading...</span>
                                </div>
                              ) : (
                                "Finalize "
                              )}
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRequest;
