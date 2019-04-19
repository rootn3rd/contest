pragma solidity ^0.5.0;

contract Contest {

    struct Contestant{
        uint id;
        string name;
        uint voteCount;
    }

    // use mapping
    mapping(uint => Contestant) public contestants;

    // already casted vote
    mapping(address => bool) public voters;
    

    // count variable
    uint public contestantsCount;

    event votedEvent (
        uint indexed _contestantId
    );
    // 
    constructor() public{

        addContestant("Tom");
        addContestant("Jerry");
    }

    // add contestant function
    function addContestant(string memory _name) private {
        contestantsCount ++;
        contestants[contestantsCount] = Contestant(contestantsCount, _name, 0);

    }

    // vote
    function vote(uint _contestantId) public {

        require(!voters[msg.sender]);
        require(_contestantId > 0 && _contestantId <= contestantsCount);

        contestants[_contestantId].voteCount ++;
        voters[msg.sender] = true;

        emit votedEvent(_contestantId);
    }
}