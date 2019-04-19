var Contest = artifacts.require('./Contest.sol')

contract("Contest", function (accounts) {

    // init test
    it("initializes with two contestants", function () {

        return Contest.deployed().then(function (instance) {
            return instance.contestantsCount();
        }).then(function (count) {
            assert.equal(count, 2)
        });
    });

    it("initializes contestants with proper values", function () {

        return Contest.deployed().then(function (instance) {
            contestInstance = instance
            return contestInstance.contestants(1);
        }).then(function (contestant1) {
            assert.equal(contestant1[0], 1, "contains correct id");
            assert.equal(contestant1[1], "Tom", "contains correct name");
            assert.equal(contestant1[2], 0, "contains correct vote count");
            return contestInstance.contestants(2);
        }).then(function (contestant2) {
            assert.equal(contestant2[0], 2, "contains correct id");
            assert.equal(contestant2[1], "Jerry", "contains correct name");
            assert.equal(contestant2[2], 0, "contains correct vote count");
        });
    });

    
    it("allows voter to cast vote", function () {

        return Contest.deployed().then(function (instance) {
            contestInstance = instance
            contestantId = 2;
            return contestInstance.vote(contestantId, {from: accounts[0]});
        }).then(function (receipt) {
            return contestInstance.voters(accounts[0]);
        }).then(function (voted) {
            assert(voted, "the voter was marked as voted");
            return contestInstance.contestants(contestantId);
        }).then(function (contestant) {
            var voteCount = contestant[2]
            assert.equal(voteCount, 1, "increments the contestant's vote count");
            
        });
    });



});