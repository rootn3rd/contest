App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (web3) {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider)
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {

    $.getJSON("Contest.json", function (contest) {

      App.contracts.Contest = TruffleContract(contest);
      App.contracts.Contest.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function () {
    App.contracts.Contest.deployed().then(function (instance) {
      instance.votedEvent({},{
        fromBlock: 0,
        toBlock : 'latest'        
      }).watch(function(err, event){
        console.log('Event triggered', event)
        App.render();
      });
    });
  },

  render: function () {
    var contestInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();
    web3.eth.getCoinbase(function (err, account) {
      if (!err) {
        App.account = account;
        $("#accountAddress").html("Your account - " + account);
      }
    });

    App.contracts.Contest.deployed().then(function (instance) {
      contestInstance = instance;
      return contestInstance.contestantsCount();
    }).then(function (count) {
      var contestantResults = $("#contestantResults");
      contestantResults.empty();

      var contestantSelect = $("#contestantsSelect");
      contestantSelect.empty();


      for (i = 1; i <= count; i++) {
        contestInstance.contestants(i).then(function (c) {
          var id = c[0];
          var name = c[1];
          var voteCount = c[2];

          var contestantTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          contestantResults.append(contestantTemplate);

          var contestantOption = "<option value='" + id + "'>" + name + "</option>";
          contestantSelect.append(contestantOption);
        })
      }

      loader.hide();
      content.show();
    }).catch(function (err) {
      console.error(err)
    });

  },

  castVote: function () {
    var contestantId = $("#contestantsSelect").val();

    App.contracts.Contest.deployed().then(function (instance) {
      return instance.vote(contestantId, { from: App.account });
    }).then(function (result) {
      var loader = $("#loader");
      var content = $("#content");

      content.hide();
      loader.show();

    }).catch(function (err) {
      console.error(err);
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
