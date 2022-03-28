import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// https://ipfs.infura.io/ipfs/QmTkYB85RqXGY59J4PTxiHESgumTiFQdyMBu7NM7HDoaUB
const CreateCampaign = (props) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [buffer, setBuffer] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const ipfsClient = require("ipfs-http-client");

  const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  }); // leaving out the arguments will default to these values

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    };
  };

  const createCampaign = async (e) => {
    e.preventDefault();
    //Address of ipfs generated Image
    try {
      setLoading(true);
      setError(false);
      //uploading image to Ipfs
      const image = await ipfs.add(buffer);
      const imageUrl = `https://ipfs.infura.io/ipfs/${image[0].path}`;

      const web3 = window.web3;
      await props.campaignFactory.methods
        .createCampaign(
          web3.utils.toWei(amount.toString(), "ether"),
          title,
          description,
          imageUrl
        )
        .send({ from: props.account });

      const campaigns = await props.campaignFactory.methods.campaigns(0).call();
      setLoading(false);
      window.location.pathname = "/";
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    props.loadWeb3();
  }, []);

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="container  p-9 text-white">
        <form
          className="bg-gray-700 p-4 rounded-md text-white"
          onSubmit={createCampaign}
        >
          <h1 className="text-lg mb-3 md:text-2xl font-bold">
            Create New Campaign
          </h1>
          {/* <h1 className="text-lg font-bold mb-3 md:text-2xl">{buffer}</h1> */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white dark:text-gray-300"
            >
              Title
            </label>
            <input
              onChange={(e) => {
                setTitle(e.target.value);
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
              Minimum Amount
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
          <div className=" text-sm my-3 md:text-lg ">
            <label
              htmlFor="number"
              className="block mb-2 text-sm font-medium text-white dark:text-gray-300"
            >
              Image
            </label>
            <input
              onChange={captureFile}
              required
              className="rounded bg-gray-700 border-0 border-black outline-none text-white w-36 md:w-full"
              type="file"
              name="image"
              id="image"
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

export default CreateCampaign;
