// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract CampaignFactory {
    struct CampaignInfo {
        uint256 id;
        uint256 time;
        string title;
        string description;
        string image;
        Campaign campaign;
    }

    uint256 public campaignsCount = 0;
    string public name = "Campaign Factory";
    uint256 public campaignCount;
    Campaign[] public deployedCampaign;
    CampaignInfo[] public campaigns;

    function createCampaign(
        uint256 minimum,
        string memory _title,
        string memory _description,
        string memory _image
    ) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        CampaignInfo memory campaign = CampaignInfo(
            campaignsCount,
            block.timestamp,
            _title,
            _description,
            _image,
            newCampaign
        );
        campaigns.push(campaign);
        deployedCampaign.push(newCampaign);
        campaignCount++;
        campaignsCount++;
    }

    function getDeployedcampaigns()
        public
        view
        returns (CampaignInfo[] memory)
    {
        return campaigns;
    }
}

contract Campaign {
    struct Request {
        uint256 id;
        string description;
        address payable recipient;
        uint256 amount;
        bool complete;
        uint256 approvalCount;
    }

    uint256 id;
    address public manager;
    uint256 public minimumAmount;
    Request[] public requests;
    uint256 public approversCount;
    mapping(address => bool) public approvers;
    mapping(address => mapping(uint256 => bool)) public isApproved;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 _minimumAmount, address creator) {
        manager = creator;
        minimumAmount = _minimumAmount;
    }

    function contribute() public payable {
        require(msg.value > minimumAmount);
        if (!approvers[msg.sender]) {
            approversCount++;
        }
        approvers[msg.sender] = true;
    }

    function createRequest(
        string memory _description,
        address payable _recipient,
        uint256 _amount
    ) public restricted {
        id++;
        Request memory newRequest = Request(
            id,
            _description,
            _recipient,
            _amount,
            false,
            0
        );
        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!isApproved[msg.sender][index]);

        isApproved[msg.sender][index] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        payable(request.recipient).transfer(request.amount);
        request.complete = true;
    }

    function getCampaignBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getRequestCount() public view returns (uint256) {
        return requests.length;
    }
}
