Bs5Utils.defaults.toasts.position = 'bottom-right';
const bs5Utils = new Bs5Utils();

let tokenids = [];
let stakedids = [];

let eclids = [];
let eclstaked = [];

let lastSupply = 0;

let whitelist = false;
let burnActive = false;
let active = false;
let upgradeCost = 0;
let mintCost = 0; 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
const waitBlock = async(txhash, blocksToWait = 1, args) => {
  while (true) {
      try{
        let receipt = await web3.eth.getTransactionReceipt(txhash);
        var block = await web3.eth.getBlock(receipt.blockNumber);
        var current = await web3.eth.getBlock("latest");
        if (current.number - block.number >= blocksToWait) {
            console.log("confirmed");
            break;
        }
      }
      catch(err){
          console.log("Awaiting transaction...");
      }
    
    console.log("Waiting a mined block to include your txHash... currently in block " + web3.eth.blockNumber);
    await sleep(5000);
  }

  return args;
}

const stakeMike = async (ids, all=false) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainID}],
        });
    } 
    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                    {
                        chainId: chainID,
                        chainName: chainName,
                        rpcUrls: [chainRPC],
                        nativeCurrency: {
                        name: "MATIC",
                        symbol: currencySymbol,
                        decimals: 18,
                        },
                        blockExplorerUrls: [blockExplorer],
                    },
                    ],
                });
            } catch (error) {
                alert(error.message);
                return;
            }
        }
    }
    finally{

        let approval = await contract.methods.isApprovedForAll(ethereum.selectedAddress, hghaddress).call();

        if(approval){
            stakeMikeTransaction(ids, all);
        }
        else{
            allowStaking(ids, all, nicknameToTokenAddress('mike'));
        }
        
    }
}

const stakeClubLord = async (ids, all=false) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainID}],
        });
    } 
    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                    {
                        chainId: chainID,
                        chainName: chainName,
                        rpcUrls: [chainRPC],
                        nativeCurrency: {
                        name: "MATIC",
                        symbol: currencySymbol,
                        decimals: 18,
                        },
                        blockExplorerUrls: [blockExplorer],
                    },
                    ],
                });
            } catch (error) {
                alert(error.message);
                return;
            }
        }
    }
    finally{

        let approval = await eclcontract.methods.isApprovedForAll(ethereum.selectedAddress, hghaddress).call();

        if(approval){
            expansionStake(ids, all, ecladdress);
        }
        else{
            allowStaking(ids, all, ecladdress);
        }
        
    }
}

const allowStaking = async(id, all, nft) => {

    let thecontract = getContractByAddress(nft);

    const tx = {
        from: ethereum.selectedAddress,
        to: nft,
        data: thecontract.methods.setApprovalForAll(hghaddress, true).encodeABI(),
        chainId: chainID
    }

    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        let args = [];
        args['id'] = id;
        args['nft'] = nft;
        args['all'] = all;
        $('#alertModal .modal-title').html("Waiting for approval transaction");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('<div class="d-flex justify-content-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>');
        alertModal.show();

        let block = waitBlock(txHash, 3, args);
        block.then(function(args){
            alertModal.hide();
            bs5Utils.Snack.show('dark', 'Approved staking Please continue with next transaction.', 5000, true);
            switch(nft){
                case address:
                    stakeMikeTransaction(args.id, args.all);
                    break;
                case ecladdress:
                    expansionStake(args.id, args.all, args.nft);
                    break;
                break;
                default:
                    alert("Something went wrong");
                break;
            }
        })
    })
}

const withdrawMike = async (ids, all=false) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainID}],
        });
    } 
    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                    {
                        chainId: chainID,
                        chainName: chainName,
                        rpcUrls: [chainRPC],
                        nativeCurrency: {
                        name: "MATIC",
                        symbol: currencySymbol,
                        decimals: 18,
                        },
                        blockExplorerUrls: [blockExplorer],
                    },
                    ],
                });
            } catch (error) {
                alert(error.message);
                return;
            }
        }
    }
    finally{
        withdrawMikeTransaction(ids, all);
    }
}

const withdrawECL = async (ids, all=false) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainID}],
        });
    } 
    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                    {
                        chainId: chainID,
                        chainName: chainName,
                        rpcUrls: [chainRPC],
                        nativeCurrency: {
                        name: "MATIC",
                        symbol: currencySymbol,
                        decimals: 18,
                        },
                        blockExplorerUrls: [blockExplorer],
                    },
                    ],
                });
            } catch (error) {
                alert(error.message);
                return;
            }
        }
    }
    finally{
        withdrawECLTransaction(ids, all);
    }
}

const withdrawHGH = async (expansion = false, xpacaddress = ecladdress) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainID}],
        });
    } 
    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                    {
                        chainId: chainID,
                        chainName: chainName,
                        rpcUrls: [chainRPC],
                        nativeCurrency: {
                        name: "MATIC",
                        symbol: currencySymbol,
                        decimals: 18,
                        },
                        blockExplorerUrls: [blockExplorer],
                    },
                    ],
                });
            } catch (error) {
                alert(error.message);
                return;
            }
        }
    }
    finally{
        if(expansion){
            withdrawExpansionHGHTransaction(xpacaddress);
        }
        else{
            withdrawHGHTransaction();
        }
        
    }
}


if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0];
        $('.btn-connect').each(function(){
            $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
        })
        $('#eclCrewContainer').html('');
        $('#eclContainer').html('');
        $('#mikeCrewContainer').html('');
        $('#mikeStakedContainer').html('');
        tokenids = [];
        stakedids = [];
        loadMikes()
        loadStakedMikes()
        loadClubLords()
        loadStakedClubLords()
        getAllRewards()
        loadHGHBalance()
    });
}

$(document).on('click', '.btn-polygon-setup', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    switchNetworkPoly();
})

 $(document).on('click', '.btn-connect', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    switchNetworkPoly();

    if (typeof window.ethereum !== 'undefined') {
        getAccount()
    }
    else if(isMobile){
            window.open('https://metamask.app.link/dapp/maticmike.club/#mint', '_blank');
    }
    else{
        $('#alertModal .modal-title').html("Wallet Connection Error");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('MetaMask is not installed. Install MetaMask on a supported browser for minting.<br><br>You can <a href="https://metamask.io/download.html" rel="noreferrer" target="_blank" title="Install MetaMask here for supported browsers">install MetaMask here.</a>');
        alertModal.show();
    }
})

$(document).on('click', '#btnECLWithdrawAll', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(stakedids.length > 0){
        withdrawECL(eclstaked, true)
    }
    else{
        $('#alertModal .modal-title').html("No Club Lords At the Gym");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('No Club Lords are in the gym right now.');
        alertModal.show();
    }
})

$(document).on('click', '#btnWithdrawMikes', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(stakedids.length > 0){
        withdrawMike(stakedids, true)
    }
    else{
        $('#alertModal .modal-title').html("No Mikes At the Gym");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('No Mikes are in the gym right now.');
        alertModal.show();
    }
})

$(document).on('click', '.btn-stake', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let nft = $(this).attr('data-nft');

    switch(nft){
        case 'mike':
            if(stakedids.length >= 10){
                $('#alertModal .modal-title').html("Already have 10 Mikes Staked");
                // change this to allow coinbase and trust wallet links
                $('#alertModal .modal-body').html('You can only stake a maximum of 10 Mikes.');
                alertModal.show();
            }
            else{
                let id = $(this).attr('data-tokenid');
                stakeMike([parseInt(id)]);
            }
        break;
        case 'ecl':
            if(eclstaked.length >= 10){
                $('#alertModal .modal-title').html("Already have 10 Club Lords Staked");
                // change this to allow coinbase and trust wallet links
                $('#alertModal .modal-body').html('You can only stake a maximum of 10 Club Lords.');
                alertModal.show();
            }
            else{
                let id = $(this).attr('data-tokenid');
                stakeClubLord([parseInt(id)]);
            }
        break;
        default:
            if(stakedids.length >= 10){
                $('#alertModal .modal-title').html("Already have 10 Mikes Staked");
                // change this to allow coinbase and trust wallet links
                $('#alertModal .modal-body').html('You can only stake a maximum of 10 Mikes.');
            }
            else{
                let id = $(this).attr('data-tokenid');
                stakeMike([parseInt(id)]);
            }
        break;
    }
    
})

$(document).on('click', '#btnECLDepositAll', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(eclids.length > 0 && eclstaked.length + eclids.length <= 10){
        stakeClubLord(eclids, true);
    }
    else if(eclstaked.length < 10){
        let curids = [];

        for(var i=0; i<(10-eclstaked.length); i++){
            curids.push(eclids[i]);
        }

        stakeClubLord(curids);
    }
    else if(eclstaked.length == 10 && eclids.length > 0){
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>Your Gym is Full</h3>")
        $('#alertModal .modal-body').html("<p>There's a limit of 10 Club Lords in the gym per wallet at a time. Too much beef in there.</p>")
        alertModal.show();
    }
    else{
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>You have no Club Lords to stake</h3>")
        $('#alertModal .modal-body').html("<p>You must have a Club Lord outside of the gym available to stake.</p>")
        alertModal.show();
    }
})

$(document).on('click', '#btnDepositAll', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(tokenids.length > 0 && stakedids.length + tokenids.length <= 10){
        stakeMike(tokenids, true);
    }
    else if(stakedids.length < 10){
        let curids = [];

        for(var i=0; i<(10-stakedids.length); i++){
            curids.push(tokenids[i]);
        }

        stakeMike(curids);
    }
    else if(stakedids.length == 10 && tokenids.length > 0){
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>Your Gym is Full</h3>")
        $('#alertModal .modal-body').html("<p>There's a limit of 10 Mikes in the gym per wallet at a time. Too much beef in there.</p>")
        alertModal.show();
    }
    else{
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>You have no Mikes to stake</h3>")
        $('#alertModal .modal-body').html("<p>You must have a Mike outside of the gym available to stake.</p>")
        alertModal.show();
    }
})

$(document).on('click', '#btnECLWithdrawAllHGH', function(e){
    if(eclstaked.length > 0){
        withdrawHGH(true, ecladdress)
    }
    else{
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>No Club Lords in the gym</h3>")
        $('#alertModal .modal-body').html("<p>You must have a Mike inside of the gym to claim $HGH.</p>")
        alertModal.show()
    }
})

$(document).on('click', '#btnWithdrawAllHGH', function(e){
    if(stakedids.length > 0){
        withdrawHGH()
    }
    else{
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>No Mike's in the gym</h3>")
        $('#alertModal .modal-body').html("<p>You must have a Mike inside of the gym to claim $HGH.</p>")
        alertModal.show()
    }
})

$(document).on('click', '.btn-withdraw', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let nft = $(this).attr('data-nft');
    let id = $(this).attr('data-tokenid');
    switch(nft){
        case 'mike':
            withdrawMike([parseInt(id)]);
        break;
        case 'ecl':
            withdrawECL([parseInt(id)]);
        break;
        default:
            withdrawMike([parseInt(id)]);
        break;
    }
})

async function stakeMikeTransaction(ids, all){
    let curids = ids;

    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.stakeByIds(ids).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        $('#alertModal .modal-title').html("Sending Mike(s) to the gym");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><br><br><a target="_blank" href="https://polygonscan.com/tx/' + txHash + '" class="text-center">View Transaction</a></div>');
        alertModal.show();
        console.log(txHash);
        if(all){
            tokenids = [];
            $('#mikeCrewContainer').html('');
        }
        else{
            for(var i=0; i<curids.length; i++){
                let index = tokenids.indexOf(curids[i].toString());
                if (index > -1) {
                    tokenids.splice(index, 1);
                }
                $('#mikeCrewContainer').find("[container-tokenid='" + curids[i].toString() + "']").remove();
            }
        }
        
        let block = waitBlock(txHash, 3, 1);

        block.then(function(args){
            alertModal.hide();
            bs5Utils.Snack.show('dark', 'Your Mike(s) have been sent to the gym.', 4000, true);
            loadMikes()
            loadStakedMikes()
        })
    })
}

// can modify this to be dynamic for expansions once new are released
async function expansionStake(ids, all, expansionAddress){
    let curids = ids;

    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.expansionStakeByIds(expansionAddress, ids).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        $('#alertModal .modal-title').html("Sending ECL(s) to the Gym");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><br><br><a target="_blank" href="https://polygonscan.com/tx/' + txHash + '" class="text-center">View Transaction</a></div>');
        alertModal.show();
        console.log(txHash);
        if(all){
            eclids = [];
            $('#eclCrewContainer').html('');
        }
        else{
            for(var i=0; i<curids.length; i++){
                let index = eclids.indexOf(curids[i].toString());
                if (index > -1) {
                    eclids.splice(index, 1);
                }
                $('#eclCrewContainer').find("[container-tokenid='" + curids[i].toString() + "']").remove();
            }
        }
        
        let block = waitBlock(txHash, 3, 1);

        block.then(function(args){
            alertModal.hide();
            bs5Utils.Snack.show('dark', 'Your ECL(s) have been sent to the gym.', 4000, true);
            loadClubLords()
            loadStakedClubLords()
        })
    })
}

async function withdrawMikeTransaction(ids, all){
    let curids = ids;

    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.unstakeByIds(ids).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        $('#alertModal .modal-title').html("Withdrawing Mike(s) from the gym");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><br><br><a target="_blank" href="https://polygonscan.com/tx/' + txHash + '" class="text-center">View Transaction</a></div>');
        alertModal.show();
        console.log(txHash);
        if(all){
            stakedids = [];
            $('#mikeStakedContainer').html('');
        }
        else{
            for(var i=0; i<curids.length; i++){
                let index = stakedids.indexOf(curids[i].toString());
                if (index > -1) {
                    stakedids.splice(index, 1);
                }
                $('#mikeStakedContainer').find("[container-tokenid='" + curids[i].toString() + "']").remove();
            }
        }
        
        let block = waitBlock(txHash, 3, 1);

        block.then(function(args){
            alertModal.hide();
            bs5Utils.Snack.show('dark', 'Your Mike(s) have been withdrawn from the gym.', 4000, true);
            loadHGHBalance();
            loadMikes()
            loadStakedMikes()
            getAllRewards()
        })
    })
}

async function withdrawECLTransaction(ids, all){
    let curids = ids;

    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.expansionUnstakeByIds(ecladdress, ids).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        $('#alertModal .modal-title').html("Withdrawing ECL(s) from the gym");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><br><br><a target="_blank" href="https://polygonscan.com/tx/' + txHash + '" class="text-center">View Transaction</a></div>');
        alertModal.show();
        console.log(txHash);
        if(all){
            eclstaked = [];
            $('#eclContainer').html('');
        }
        else{
            for(var i=0; i<curids.length; i++){
                let index = eclstaked.indexOf(curids[i].toString());
                if (index > -1) {
                    eclstaked.splice(index, 1);
                }
                $('#eclContainer').find("[container-tokenid='" + curids[i].toString() + "']").remove();
            }
        }
        
        let block = waitBlock(txHash, 3, 1);

        block.then(function(args){
            alertModal.hide();
            bs5Utils.Snack.show('dark', 'Your ECL(s) have been withdrawn from the gym.', 4000, true);
            loadHGHBalance()
            loadClubLords()
            loadStakedClubLords()
            getAllRewards()
        })
    })
}

async function withdrawExpansionHGHTransaction(theaddress){
    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.expansionClaimAll(theaddress).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);

        let block = waitBlock(txHash, 3, 1);
        $('#alertModal .modal-title').html("Claiming HGH...");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><br><br><a target="_blank" href="https://polygonscan.com/tx/' + txHash + '" class="text-center">View Transaction</a></div>');
        alertModal.show();
        block.then(function(args){
            alertModal.hide();
            bs5Utils.Snack.show('dark', 'Your $HGH has been claimed and should appear shortly', 4000, true);
            loadHGHBalance();
            getAllRewards()
        })
    })
}

async function withdrawHGHTransaction(){
    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.claimAll().encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);

        let block = waitBlock(txHash, 3, 1);
        $('#alertModal .modal-title').html("Claiming HGH...");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><br><br><a target="_blank" href="https://polygonscan.com/tx/' + txHash + '" class="text-center">View Transaction</a></div>');
        alertModal.show();
        block.then(function(args){
            alertModal.hide();
            bs5Utils.Snack.show('dark', 'Your $HGH has been claimed and should appear shortly', 4000, true);
            loadHGHBalance();
            getAllRewards()
        })
    })
}

async function getAccount(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    $('.btn-connect').each(function(){
         $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
    })
   
    $('#btnConnect').removeClass('btn-danger');
    $('#btnConnect').addClass('btn-success');
    loadMikes();
    loadStakedMikes();
}

// modify this to include the data abi as a param
async function createTransaction(wei) {
      const tx = {
        from: ethereum.selectedAddress,
        to: address,
        value: web3.utils.toHex(wei),
        data: contract.methods.donationMint().encodeABI(),
        chainId: chainID
      }
      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [tx],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }

async function loadClubLords(){
    $('#btnECLDepositAll').prop('disabled', true)
    eclcontract.methods.walletOfOwner(ethereum.selectedAddress).call((err, result) => { 
        if(result.length > 0){
            for(var i=0; i<result.length; i++){
                if(!eclids.includes(result[i])){
                    pullEcl(parseInt(result[i]));
                }
            }
        }
    });
}

async function loadStakedClubLords(){
    hghcontract.methods.expansionGetTokensStaked(ecladdress, ethereum.selectedAddress).call((err, result) => { 
        if(result.length > 0 ){
            $('#btnECLWithdrawAllHGH').prop('disabled', false);
            $('#btnECLWithdrawAll').prop('disabled', false);
            for(var i=0; i<result.length; i++){
                if(!eclstaked.includes(result[i])){
                    eclstaked.push(result[i]);
                    pullStakedEcl(result[i]);
                }
            }
        }
        else{
            $('#btnECLWithdrawAllHGH').prop('disabled', true);
            $('#btnECLWithdrawAll').prop('disabled', true);
        }
    });
}

function pullStakedEcl(id){
    eclcontract.methods.tokenURI(id).call((err, result) => { 
        var metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
        let traits = JSON.stringify(metadata.attributes);
        var html = '<div class="col-6 col-sm-4 text-center py-3" container-tokenid="' + id.toString() + '">';
        html += '<img class="img img-fluid" src="' + metadata.image + '" />';
        html += '<br><h2 class="text-center">#' + id.toString() + '</h2><br>';
        html += '<div class="d-grid gap-2">';
        html += '<button type="button" title="Take this ECL out of gym and put him back in wallet." class="btn btn-danger btn-success btn-withdraw" data-nft="ecl" data-tokenid="' + id.toString() + '"><i class="far fa-wallet"></i> Withdraw</button>';
        html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";
        html += '</div></div>'

        $('#eclContainer').append(html);
        
    });
}

function pullEcl(id){
    eclcontract.methods.tokenURI(id).call((err, result) => { 
        var metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
        let traits = JSON.stringify(metadata.attributes);
        
        var html = '<div class="col-6 col-sm-4 text-center py-3" container-tokenid="' + id.toString() + '">';
        html += '<img class="img img-fluid" src="' + metadata.image + '" />';
        html += '<br><h2 class="text-center">#' + id.toString() + '</h2><br>';
        if(metadata.attributes.some(function(o){return o["trait_type"] === "Hours Left";})){
            console.log("still summoning")
        }
        else{
            $("#btnECLDepositAll").prop('disabled', false);
            eclids.push(id.toString());
            html += '<div class="d-grid gap-2">';
            html += '<button type="button" title="Stake ECL to earn $HGH" class="btn btn-dark btn-stake" data-nft="ecl" data-tokenid="' + id.toString() + '"><i class="far fa-dumbbell"></i> Send to Gym</button>';
            html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";

            $('#eclCrewContainer').append(html);

        }   
    });
}

async function loadMikes(){
    contract.methods.walletOfOwner(ethereum.selectedAddress).call((err, result) => { 
        if(result.length > 0){
            $('#btnDepositAll').prop('disabled', false);

            for(var i=0; i<result.length; i++){
                if(!tokenids.includes(result[i])){
                    tokenids.push(result[i]);
                    pullMike(result[i]);
                }
            }
        }
        else{
            $('#btnDepositAll').prop('disabled', true);
        }
    });
}

async function loadStakedMikes(){
    hghcontract.methods.getTokensStaked(ethereum.selectedAddress).call((err, result) => { 
        if(result.length > 0 ){
            $('#btnWithdrawAllHGH').prop('disabled', false);
            $('#btnWithdrawMikes').prop('disabled', false);
            for(var i=0; i<result.length; i++){
                if(!stakedids.includes(result[i])){
                    stakedids.push(result[i]);
                    pullStakedMike(result[i]);
                }
            }
        }
        else{
            $('#btnWithdrawAllHGH').prop('disabled', true);
            $('#btnWithdrawMikes').prop('disabled', true);
        }
        
    });
}

async function getAllRewards(){
    hghcontract.methods.getAllRewards(ethereum.selectedAddress).call((err, result) => { 
        $('.reward-counter').html(parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(2));
    });

    hghcontract.methods.expansionGetAllRewards(ecladdress, ethereum.selectedAddress).call((err, result) => { 
        $('.reward-counter-ecl').html(parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(2));
    });
}

function pullMike(id){

    contract.methods.tokenURI(id).call((err, result) => { 
        var metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
        let traits = JSON.stringify(metadata.attributes);
        var html = '<div class="col-6 col-sm-4 text-center py-3" container-tokenid="' + id.toString() + '">';
        html += '<img class="img img-fluid" src="' + metadata.image + '" />';
        html += '<br><h2 class="text-center">#' + id.toString() + '</h2><br>';
        html += '<div class="d-grid gap-2">';
        html += '<button type="button" title="Stake Mike to earn $HGH" class="btn btn-dark btn-stake" data-nft="mike" data-tokenid="' + id.toString() + '"><i class="far fa-dumbbell"></i> Send to Gym</button>';
        html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";
        html += '</div></div>'

        $('#mikeCrewContainer').append(html);
        
    });

}

function pullStakedMike(id){
    contract.methods.tokenURI(id).call((err, result) => { 
        var metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
        let traits = JSON.stringify(metadata.attributes);
        var html = '<div class="col-6 col-sm-4 text-center py-3" container-tokenid="' + id.toString() + '">';
        html += '<img class="img img-fluid" src="' + metadata.image + '" />';
        html += '<br><h2 class="text-center">#' + id.toString() + '</h2><br>';
        html += '<div class="d-grid gap-2">';
        html += '<button type="button" title="Take this Mike out of gym and put him back in wallet." class="btn btn-danger btn-success btn-withdraw" data-nft="mike" data-tokenid="' + id.toString() + '"><i class="far fa-wallet"></i> Withdraw</button>';
        html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";
        html += '</div></div>'

        $('#mikeStakedContainer').append(html);
        
    });
}

$(document).ready(function(){
    
    setTimeout(() => {
        try{
            if(typeof ethereum.selectedAddress !== 'undefined'){
                loadHGHBalance()
                account = ethereum.selectedAddress
                $('.btn-connect').each(function(){
                    $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase())
                })
                $('#btnConnect').removeClass('btn-danger')
                $('#btnConnect').addClass('btn-success')

                loadMikes()
                loadStakedMikes()
                loadClubLords()
                loadStakedClubLords()
                getAllRewards()
            }
        }
        catch(err){
            console.log('Wallet not yet connected');
        }
    }, 500)
})