const { assert } = require("chai");
const Campaign = require("../src/abis/Campaign.json");
const CampaignFactory = artifacts.require("./CampaignFactory.sol");
require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Campaign", (accounts) => {
  let campaign, deployedContract, campaignFactory;

  before(async () => {
    campaignFactory = await CampaignFactory.deployed();
    await campaignFactory.createCampaign(100);
    deployedContract = await campaignFactory.deployedCampaign(0);
    campaign = new web3.eth.Contract(Campaign.abi, deployedContract);
  });

  describe("Campaigns", async () => {
    it("deploys a factory and a campaign", () => {
      assert.ok(campaignFactory.address);
      assert.ok(campaign._address);
    });

    it("marks caller as the campaign manager", async () => {
      const manager = await campaign.methods.manager().call();
      assert.equal(manager, accounts[0]);
    });

    it("allows people to contribute and mark them as contributers", async () => {
      await campaign.methods
        .contribute()
        .send({ from: accounts[1], value: web3.utils.toWei("2", "ether") });

      const approver = await campaign.methods.approvers(accounts[1]).call();
      assert(approver);
    });

    it("requires minimum contribution", async () => {
      await campaign.methods.contribute().send({ from: accounts[0], value: 10 })
        .should.be.rejected;
    });

    it("allows manager to make payment request", async () => {
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });

      await campaign.methods
        .createRequest(
          "Buy Battries",
          accounts[2],
          web3.utils.toWei("1", "ether")
        )
        .send({ from: accounts[0], gas: 3000000 });
      const request = await campaign.methods.requests(0).call();
      assert.equal("Buy Battries", request.description);

      await campaign.methods.approveRequest(0).send({ from: accounts[0] });
      const approveRequest = await campaign.methods /////////////////////
        .isApproved(accounts[0], 0)
        .call();
      assert(approveRequest);

      await campaign.methods.finalizeRequest(0).send({ from: accounts[0] });
      const reqComplete = await campaign.methods.requests(0).call();
      assert(reqComplete.complete);

      let balance = await web3.eth.getBalance(accounts[2]);
      let ethBalance = web3.utils.fromWei(balance, "ether");
      console.log(balance);
      assert(ethBalance > web3.utils.toWei("100", "ether"));
    });
  });
});
