Bs5Utils.defaults.toasts.position = 'bottom-right';
const bs5Utils = new Bs5Utils();

let tokenids = [];

let lastSupply = -1;

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


/* These will all need to be changed to mainnet */
const burnMint = async (id) => {
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
        burnTransaction(id);
    }
}

const hghMint = async () => {
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
        hghMintTransaction();
    }
}

const upgradeMike = async (id) => {
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
        upgradeMikeTransaction(id);
    }
}

const whitelistMint = async () => {
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
        whitelistMintTransaction();
    }
}

const donationMint= async () => {
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
        donationMintTransaction();
    }
}

if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0];
        $('.btn-connect').each(function(){
            $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
        })
        $('#mikeCrewContainer').html('');
        tokenids = []
        loadMikes()
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


// whitelist mint or free
$(document).on('click', '#btnMint', function(e){
    e.preventDefault();
    e.stopImmediatePropagation;

    if(mintCost <= parseFloat(hghBalance)){
        hghMint();
    }
    else{
         $('#alertModal .modal-title').html("Not enough $HGH");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html("We've reached the $HGH Mint Threshold, please make sure you have enough $HGH to mint, or mint with Matic.<br><br>If you already own a Mike, you may want to refresh this page to check if free Burn Rerolls are acitve.");
        alertModal.show();
    }
})

$(document).on('click', '#btnWhitelistMint', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    whitelistMint();
})

// matic mint
$(document).on('click', '#btnMaticMint', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    donationMint();
})

$(document).on('click', '.btn-burn', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = $(this).attr('data-tokenid');
    if(burnActive){
        burnMint(parseInt(id));
    }
})

$(document).on('click', '.btn-upgrade', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(upgradeCost <= parseFloat(hghBalance)){
        let id = $(this).attr('data-tokenid');
        upgradeMike(parseInt(id));
    }
    else{
        $('#alertModal .modal-title').html("Not enough HGH");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html("Not enough HGH in your wallet to upgrade.");
        alertModal.show();
    }
})

async function upgradeMikeTransaction(id){
    var curid = id;

    const tx = {
        from: ethereum.selectedAddress,
        to: address,
        data: contract.methods.upgradeMike(id).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        
        let index = tokenids.indexOf(curid.toString());
        if (index > -1) {
            tokenids.splice(index, 1);
        }
        $('#mikeCrewContainer').find("[container-tokenid='" + id.toString() + "'] img").addClass('shake');

        let block = waitBlock(txHash, 1, id);

        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Your Mike has been injected, refreshing in 30 seconds... Let\'s see what happens!', 4000, true);
            setTimeout(reloadMikeAndHGH.bind(null, id), 30000);
        })
    })
}


function reloadMikeAndHGH(id){
    $('#mikeCrewContainer').find("[container-tokenid='" + id.toString() + "']").remove()
    loadMikes()
    currentUpgradeCost()
    loadHGHBalance()
}
async function burnTransaction(id){
    var curid = id;

    const tx = {
        from: ethereum.selectedAddress,
        to: address,
        data: contract.methods.burnForMint(id).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        
        let index = tokenids.indexOf(curid.toString());
        if (index > -1) {
            tokenids.splice(index, 1);
        }
        $('#mikeCrewContainer').find("[container-tokenid='" + id.toString() + "']").remove();
        setTimeout(() => {
            loadMikes()
        }, 5000);
    })
}

async function hghMintTransaction(){
    const tx = {
        from: ethereum.selectedAddress,
        to: address,
        data: contract.methods.mintMike().encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);

        setTimeout(() => {
            loadMikes()
        }, 7000);
    })
}

async function whitelistMintTransaction(){
    const tx = {
        from: ethereum.selectedAddress,
        to: address,
        data: contract.methods.whitelistMint().encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);

        setTimeout(() => {
            loadMikes()
        }, 7000);
    })
}

async function donationMintTransaction(){
    let weiValue = web3.utils.toWei("50", "ether")
    web3.eth.getBalance(ethereum.selectedAddress).then((balance) => {
        if (parseInt(balance) >= parseInt(weiValue)) {
            createTransaction(weiValue);
        } else {
            $('#alertModal .modal-title').html("Balance Issue");
            $('#alertModal .modal-body').html('MATIC Balance is too low.');
            alertModal.show();
        }
    }).catch((err) => {
        console.log('asynchronously executed: ' + err);
    })
}

async function getAccount(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    $('.btn-connect').each(function(){
         $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
    })
   
    //enableMintBtns();

    $('#btnConnect').removeClass('btn-danger');
    $('#btnConnect').addClass('btn-success');
    loadMikes();
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

async function checkSupply(){
    contract.methods.getTotalMints().call((err, result) => { 
        let continueWithActive = true;

        if(result < 2500){
            mintCost = 0;
        }
        else if(result >= 2500 && result < 4000){
            mintCost = 1;
        }
        else if(result >= 4000 && result < 6000){
            mintCost = 2;
        }
        else if(result >= 6000 && result < 8000){
            mintCost = 3;
        }
        else if(result >= 8000  && result < 10000){
            mintCost = 4;
        }
        else{
            // minting is complete
            mintCost = 0;
            continueWithActive = false;
            $('#total-supply-bar').attr('aria-valuenow', 10000);
            $('#total-supply-bar').css('width', '100%');
            $('#total-supply').html(result);

        }

        $('.hghCost').html(mintCost);
        if(lastSupply !== result && continueWithActive){
            lastSupply = result;
            // if(result<10000){
            //     checkActive();
            // }
            var percent = (result / 10000) * 100;
            var precentstring = percent.toString() + '%';
            $('#total-supply-bar').attr('aria-valuenow', result);
            $('#total-supply-bar').css('width', precentstring);
            $('#total-supply').html(result);
            lastid = result;
        }
    });
}

function checkActive(){
    if(lastSupply <= 10000){
        contract.methods.active().call((err, result) => { 
            if(result){
                whitelist = false;
                active = true;
                //enableMintBtns();
                contract.methods.burnRerollActive().call((err, result) => { 
                    burnActive = result;
                });
            }
            else{
                active = false;
                burnActive = false;
                contract.methods.whitelistActive().call((err, result) => { 
                    whitelist = result;
                    //enableMintBtns();
                });
            }
        });
    }
}

async function currentUpgradeCost(){
     contract.methods.getUpgradeCost().call((err, result) => { 
         upgradeCost = parseInt(web3.utils.fromWei(result, 'ether'))
         $('#upgradePrice').html(upgradeCost)
     });
}

async function loadMikes(){
    contract.methods.walletOfOwner(ethereum.selectedAddress).call((err, result) => { 
        for(var i=0; i<result.length; i++){
            if(!tokenids.includes(result[i])){
                tokenids.push(result[i]);
                pullMike(result[i]);
            }
        }
    });
}

function pullMike(id){

    contract.methods.tokenURI(id).call((err, result) => { 
        let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
        
        let traits = JSON.stringify(metadata.attributes);
        let html = '<div class="col-6 col-sm-3 text-center py-3" container-tokenid="' + id.toString() + '">';
        html += '<img class="img img-fluid" src="' + metadata.image + '" />';
        html += '<br><h2 class="text-center">' + metadata.name + '</h2><br>';
        if(lastSupply < 10000 && burnActive){
            html += '<div class="d-grid gap-2">';
            html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";
            html += '<button type="button" title="Attempt to ugrade by spending HGH" class="btn btn-success btn-upgrade" data-tokenid="' + id.toString() + '"><i class="far fa-syringe"></i> Inject $HGH</button>';
            html += '<button type="button" title="Burn this mike and get a new one for free" class="btn btn-danger btn-burn" data-tokenid="' + id.toString() + '"><i class="far fa-fire"></i> Burn Reroll</button>';
            html += '</div>';
        }
        else{
            html +=  '<div class="addinfo"><h3 class="text-center dna-section"></h3></div>';
            html += '<div class="d-grid gap-2">';
            html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";
            html += '<button type="button" title="Attempt to ugrade by spending HGH" class="btn btn-success btn-upgrade" data-tokenid="' + id.toString() + '"><i class="far fa-syringe"></i> Inject $HGH</button>';
            html += '</div>';
        }
        html += '</div>'
        $('#mikeCrewContainer').append(html);
        fetchDnaAndPL(id);
    });

}

function fetchDnaAndPL(id){
    contract.methods._tokenIdToHash(id).call((err, result) => { 
        let dna = result;
        contract.methods.getPowerLevel(id).call((err, result) => { 
            let pl = result;
              $('#mikeCrewContainer').find("[container-tokenid='" + id.toString() + "'] .addinfo .dna-section").html('DNA Code: ' + dna + '<br><small class="purple">Power Level: ' + pl.toString() + '</small>');
        });
    });
}

// function enableMintBtns(){
//     if(active){
//         $('#btnMint').prop('disabled', false);
//         $('#btnMaticMint').prop('disabled', false);
//         $('#btnWhitelistMint').prop('disabled', true);
//     }
//     else if(whitelist){
//         $('#btnMint').prop('disabled', true);
//         $('#btnMaticMint').prop('disabled', true);
//         $('#btnWhitelistMint').prop('disabled', false);
//     }
//     else{
//         $('#btnMint').prop('disabled', true);
//         $('#btnMaticMint').prop('disabled', true);
//         $('#btnWhitelistMint').prop('disabled', true);
//     }
// }

$(document).ready(function(){
    checkSupply();
    currentUpgradeCost();
    setTimeout(() => {
        try{
            if(typeof ethereum.selectedAddress !== 'undefined'){
                account = ethereum.selectedAddress;
                $('.btn-connect').each(function(){
                    $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
                })
                $('#btnConnect').removeClass('btn-danger');
                $('#btnConnect').addClass('btn-success');

                //enableMintBtns();
                loadMikes();
                loadHGHBalance();
            }
        }
        catch(err){
            console.log('Wallet not yet connected');
        }
    }, 500);
    
    let date = new Date();

    // setTimeout(function(){
    //     setInterval(checkActive, 60000)
    //     checkActive()
    // }, (60-date.getSeconds())*1000)

    setInterval(() => {
        checkSupply();
        currentUpgradeCost();
    }, 30000);
})
