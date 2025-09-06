// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlueCarbonRegistry {
    
    struct Project {
        uint256 id;
        string name;
        string location;
        address owner;
        uint256 area;
        string ecosystemType;
        uint256 carbonCredits;
        uint256 createdAt;
        bool isActive;
        string imageHash;
        string aiResultsHash;
    }
    
    struct CarbonCredit {
        uint256 projectId;
        uint256 amount;
        uint256 issuedAt;
        bool isRetired;
    }
    
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public userProjects;
    mapping(uint256 => CarbonCredit) public carbonCredits;
    
    uint256 public projectCounter = 0;
    uint256 public creditCounter = 0;
    uint256 public totalCarbonCredits = 0;
    
    address public admin;
    mapping(address => bool) public verifiedOrganizations;
    
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed owner,
        string location
    );
    
    event CarbonCreditsIssued(
        uint256 indexed projectId,
        uint256 indexed creditId,
        uint256 amount,
        address indexed owner
    );
    
    event ProjectVerified(
        uint256 indexed projectId,
        uint256 carbonCredits,
        string aiResultsHash
    );
    
    event OrganizationVerified(address indexed org);
    
    constructor() {
        admin = msg.sender;
        verifiedOrganizations[msg.sender] = true;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyVerified() {
        require(
            verifiedOrganizations[msg.sender] || msg.sender == admin,
            "Only verified organizations can create projects"
        );
        _;
    }
    
    function createProject(
        string memory _name,
        string memory _location,
        uint256 _area,
        string memory _ecosystemType,
        string memory _imageHash
    ) public onlyVerified returns (uint256) {
        projectCounter++;
        
        projects[projectCounter] = Project({
            id: projectCounter,
            name: _name,
            location: _location,
            owner: msg.sender,
            area: _area,
            ecosystemType: _ecosystemType,
            carbonCredits: 0,
            createdAt: block.timestamp,
            isActive: true,
            imageHash: _imageHash,
            aiResultsHash: ""
        });
        
        userProjects[msg.sender].push(projectCounter);
        
        emit ProjectCreated(projectCounter, _name, msg.sender, _location);
        return projectCounter;
    }
    
    function verifyProjectAndIssueCredits(
        uint256 _projectId,
        uint256 _carbonAmount,
        string memory _aiResultsHash
    ) public onlyAdmin {
        require(_projectId <= projectCounter, "Project does not exist");
        require(projects[_projectId].isActive, "Project is not active");
        
        Project storage project = projects[_projectId];
        project.carbonCredits += _carbonAmount;
        project.aiResultsHash = _aiResultsHash;
        
        creditCounter++;
        carbonCredits[creditCounter] = CarbonCredit({
            projectId: _projectId,
            amount: _carbonAmount,
            issuedAt: block.timestamp,
            isRetired: false
        });
        
        totalCarbonCredits += _carbonAmount;
        
        emit ProjectVerified(_projectId, _carbonAmount, _aiResultsHash);
        emit CarbonCreditsIssued(_projectId, creditCounter, _carbonAmount, project.owner);
    }
    
    function getProject(uint256 _projectId) public view returns (
        uint256 id,
        string memory name,
        string memory location,
        address owner,
        uint256 area,
        string memory ecosystemType,
        uint256 carbonCredits,
        uint256 createdAt,
        bool isActive,
        string memory imageHash,
        string memory aiResultsHash
    ) {
        require(_projectId <= projectCounter, "Project does not exist");
        
        Project memory project = projects[_projectId];
        return (
            project.id,
            project.name,
            project.location,
            project.owner,
            project.area,
            project.ecosystemType,
            project.carbonCredits,
            project.createdAt,
            project.isActive,
            project.imageHash,
            project.aiResultsHash
        );
    }
    
    function getUserProjects(address _user) public view returns (uint256[] memory) {
        return userProjects[_user];
    }
    
    function getTotalProjects() public view returns (uint256) {
        return projectCounter;
    }
    
    function getProjectSummary(uint256 _projectId) public view returns (
        string memory name,
        string memory location,
        string memory ecosystemType,
        uint256 carbonCredits,
        bool isActive
    ) {
        require(_projectId <= projectCounter, "Project does not exist");
        
        Project memory project = projects[_projectId];
        return (
            project.name,
            project.location,
            project.ecosystemType,
            project.carbonCredits,
            project.isActive
        );
    }
    
    function addVerifiedOrganization(address _org) public onlyAdmin {
        verifiedOrganizations[_org] = true;
        emit OrganizationVerified(_org);
    }
    
    function removeVerifiedOrganization(address _org) public onlyAdmin {
        verifiedOrganizations[_org] = false;
    }
    
    function isVerifiedOrganization(address _org) public view returns (bool) {
        return verifiedOrganizations[_org];
    }
    
    function deactivateProject(uint256 _projectId) public onlyAdmin {
        require(_projectId <= projectCounter, "Project does not exist");
        projects[_projectId].isActive = false;
    }
    
    function changeAdmin(address _newAdmin) public onlyAdmin {
        admin = _newAdmin;
    }
    
    function getPlatformStats() public view returns (
        uint256 totalProjects,
        uint256 totalCredits,
        uint256 totalVerifiedOrgs
    ) {
        uint256 verifiedCount = 0;
        return (projectCounter, totalCarbonCredits, verifiedCount);
    }
}
