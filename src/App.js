import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Web3 from "web3";
import CampaignFactory from "./abis/CampaignFactory.json";
import Campaign from "./abis/Campaign.json";
import Home from "./components/Home";
import ViewCampaign from "./components/ViewCampaign";
import CreateCampaign from "./components/CreateCampaign";
import CreateRequest from "./components/CreateRequest";
import ViewRequest from "./components/ViewRequest";
import Footer from "./components/Footer";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => {
  const [account, setAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [campaignFactory, setCampaignFactory] = useState();
  const [loading, setLoading] = useState(false);
  const [networkData, setNetworkdata] = useState();

  useEffect(() => {
    document.body.style.backgroundColor = "#6577B3";

    loadWeb3();
    loadBlockChainData();
  }, []);
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "non-ethereum browser detected. You should consider using metamask!"
      );
    }
  };

  const loadBlockChainData = async () => {
    setLoading(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const networkData = CampaignFactory.networks[networkId];
    setNetworkdata(networkData);
    if (networkData) {
      const campaignFactory = new web3.eth.Contract(
        CampaignFactory.abi,
        process.env.CONTRACT_ADDRESS
      );
      setCampaignFactory(campaignFactory);

      const campaignList = await campaignFactory.methods
        .getDeployedcampaigns()
        .call();
      setCampaigns(campaignList);
      setLoading(false);
    } else {
      window.alert(
        "Decentragram contract not been deployed to detected network"
      );
    }
  };

  return (
    <>
      <BrowserRouter>
        <Navbar account={account} />
        <Routes>
          <Route
            path="/"
            element={
              !loading ? (
                <Home campaigns={campaigns} count={campaigns.length} />
              ) : (
                <div className="spinner-border text-dark" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )
            }
          />
          <Route
            path="/campaign/:id/:index"
            element={
              <ViewCampaign
                account={account}
                loadWeb3={loadWeb3}
                networkData={networkData}
              />
            }
          />
          <Route
            path="/create"
            element={
              <CreateCampaign
                account={account}
                loading={loading}
                campaignFactory={campaignFactory}
                loadWeb3={loadWeb3}
              />
            }
          />
          <Route
            path="/campaign/:id/requests"
            element={<ViewRequest loadWeb3={loadWeb3} account={account} />}
          />
          <Route
            path="/campaign/:id/requests/new"
            element={<CreateRequest loadWeb3={loadWeb3} account={account} />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
