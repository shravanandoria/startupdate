import React, { useEffect, useState } from "react";
import Campaign from "../abis/Campaign.json";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const CreateRequest = (props) => {
  const param = useParams();
  const [web3, setWeb3] = useState();
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [campaign, setCampaign] = useState();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      setError(false);
      const etherAmount = web3.utils.toWei(amount, "ether");
      await campaign.methods
        .createRequest(description, recipient, etherAmount)
        .send({ from: props.account });
      navigate(-1);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    props.loadWeb3();
    const web3 = window.web3;
    setWeb3(web3);
    const campaign = new web3.eth.Contract(Campaign.abi, param.id);
    setCampaign(campaign);
  }, []);
  return (
    <>
      {error && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="container  p-9 text-white">
        <form
          className="bg-gray-700 p-4 rounded-md text-white"
          onSubmit={handleSubmit}
        >
          <h1 className="text-lg mb-3 md:text-2xl font-bold">
            Create New Request
          </h1>
          {/* <h1 className="text-lg font-bold mb-3 md:text-2xl">{buffer}</h1> */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white dark:text-gray-300"
            >
              Recipient
            </label>
            <input
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
              type="text"
              id="text"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-white dark:text-gray-400"
          >
            Description
          </label>
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            required
            id="message"
            rows="4"
            className="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          ></textarea>

          <div className="mb-6 my-4">
            <label
              htmlFor="number"
              className="block mb-2 text-sm font-medium text-white dark:text-gray-300"
            >
              Amount to transfer
            </label>
            <input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              required
              step="any"
              type="number"
              id="text"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="text-white bg-blue-500 hover:bg-blue-600  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? (
              <div className="spinner-border text-light h-5 w-5" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRequest;
