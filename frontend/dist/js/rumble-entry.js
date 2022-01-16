Bs5Utils.defaults.toasts.position = 'bottom-right';
const bs5Utils = new Bs5Utils();

let imgArray = []
let mikesPulled = []
let currentDance = 0;
// write async functions for pulling mikes

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

const getWethAllowance = async(args) => {
    try{
        let wethallowance = await wethcontract.methods.allowance(ethereum.selectedAddress, hsroyaleaddress).call();

        args['wethallowance'] = Number(parseFloat(web3.utils.fromWei(wethallowance, 'ether')).toFixed(4));
        return args;
    }
    catch(err){
        return args;
    }
}

const enterRoyaleConnect = async(addr, id, juice) => {
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
        let allowance = await hghcontract.methods.allowance(ethereum.selectedAddress, hsroyaleaddress).call();

        let hghspend = Number(parseFloat(web3.utils.fromWei(allowance, 'ether')).toFixed(4));
        if(hghspend > 7){
            let args = [];
            args['addr'] = addr;
            args['id'] = id;
            args['juice'] = juice;

            let wethallowance = getWethAllowance(args);

            wethallowance.then(function(args){
                if(args.wethallowance >= 10.0){
                    enterRoyale(args.addr, args.id, args.juice);
                }
                else{
                    allowWethSpend(args.addr, args.id, args.juice);
                }
            })
        }
        else{
            $('#alertModal .modal-title').html("Contract needs HGH & EGG Allowance");
            // change this to allow coinbase and trust wallet links
            $('#alertModal .modal-body').html('You must approve the dance off contract to use your $HGH & $EGG balance. The prompt sets approval for 100 EGG, enough for 10 entries. If you choose you can edit this how you see fit. It will never extract more than 10 EGG per entry unless the community votes to raise stakes.');
            alertModal.show();
            allowHghSpend(addr, id, juice);
        }
    }
}

const allowHghSpend = async(addr, id, juice) => {
    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.approve(hsroyaleaddress, web3.utils.toWei('1000000', "ether")).encodeABI(),
        chainId: chainID
    }

    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        let args = [];
        args['addr'] = addr;
        args['id'] = id;
        args['juice'] = juice;
        let block = waitBlock(txHash, 1, args);
        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Approved $HGH usage.', 3000, true);

            let wethallowance = getWethAllowance(args);

            wethallowance.then(function(args){
                if(args.wethallowance >= 10.0){
                    enterRoyale(args.addr, args.id, args.juice);
                }
                else{
                    allowWethSpend(args.addr, args.id, args.juice);
                }
            })
        })
    })
}

// switch hgh with weth (for weth royale)
const allowWethSpend = async(addr, id, juice) => {
    const tx = {
        from: ethereum.selectedAddress,
        to: wethaddress,
        data: wethcontract.methods.approve(hsroyaleaddress, web3.utils.toWei('100', "ether")).encodeABI(),
        chainId: chainID
    }

    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        let args = [];
        args['addr'] = addr;
        args['id'] = id;
        args['juice'] = juice;
        let block = waitBlock(txHash, 1, args);
        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Approved $WETH usage.', 3000, true);
            enterRoyale(args.addr, args.id, args.juice)
        })
    })
}

const enterRoyale = async(addr, id, hgh) => {
    const tx = {
        from: ethereum.selectedAddress,
        to: hsroyaleaddress,
        data: hsroyalecontract.methods.enterRoyale(id, addr, hgh).encodeABI(),
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
        args['addr'] = addr;
        args['juice'] = hgh;
        let block = waitBlock(txHash, 1, args);
        block.then(function(args){
            let toastmsg = '';
            switch(args.addr){
                case address:
                    toastmsg = 'Matic Mike #';
                break;
                case ecladdress:
                    toastmsg = 'Evil Club Lord #';
                break;
                default:
                    toastmsg = 'Guest NFT #'
                break;
            }
            toastmsg += args.id.toString() + ' has been entered into tournament'
            bs5Utils.Snack.show('dark', toastmsg, 3000, true);
            enableLiveWatch(currentDance);
            rumbleInfo();
        })
        
    })
}

const populateObj = async(id, thecontract, nftaddr, metadata) => {
    let jsonObj = {}

    switch(nftaddr){
        case address:
            imgArray[id] = metadata.image
            let pl = metadata.attributes.find(o => o.trait_type === "Power Level")

            jsonObj['tokenid'] = id;
            jsonObj['id'] = id
            jsonObj['text'] = metadata.name + ' - PL: ' + pl.value.toString()
            jsonObj['contract'] = nftaddr
            jsonObj['name'] = metadata.name
            jsonObj['image'] = metadata.image
            jsonObj['powerlevel'] = pl.value

            return jsonObj;
        break;
        case ecladdress:
            let hoursRemaining = await thecontract.methods.getHoursToReveal(id).call();
            if(hoursRemaining == 0){
                let pl = metadata.attributes.find(o => o.trait_type === "Power Level")
                jsonObj['text'] = metadata.name + ' - PL: ' + pl.value.toString()
                jsonObj['powerlevel'] = pl.value
            }
            else{
                jsonObj['powerlevel'] = 0
                jsonObj['disabled'] = true
                jsonObj['text'] = metadata.name + ' - Unrevealed'
            }
            imgArray[10001+id] = metadata.image
            jsonObj['tokenid'] = id;
            jsonObj['id'] = 10001+id
            jsonObj['contract'] = nftaddr
            jsonObj['name'] = metadata.name
            jsonObj['image'] = metadata.image
            
            return jsonObj;
        break;
        case polyfarmaddress:
            imgArray[100000+id] = metadata.image

            jsonObj['tokenid'] = id;
            jsonObj['id'] = 100000+id
            jsonObj['text'] = metadata.name + ' - PL: 400-453'
            jsonObj['contract'] = nftaddr
            jsonObj['name'] = metadata.name
            jsonObj['image'] = metadata.image
            jsonObj['powerlevel'] = '400-453'

            return jsonObj
        break;
        default:
            imgArray[100001+id] = metadata.image

            jsonObj['tokenid'] = id;
            jsonObj['id'] = 100001+id
            jsonObj['text'] = metadata.name + ' - PL: 395-425'
            jsonObj['contract'] = nftaddr
            jsonObj['name'] = metadata.name
            jsonObj['image'] = metadata.image
            jsonObj['powerlevel'] = 0

            return jsonObj;
        break;
    }
}
const populateSelect = async(nftaddr, id) => {
    try{
        let thecontract = await getContractByAddress(nftaddr);
        let result = await thecontract.methods.tokenURI(id).call()

        let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")))
        let jsonObj = await populateObj(id, thecontract, nftaddr, metadata);

        return jsonObj
    }
    catch(err){
        sleep(100);
        return populateSelect(nftaddr, id);
    }
}

const checkSize = async(length1, length2) => {
    if(length1 <= length2){
        return true;
    }
    else{
        await sleep(100);
        return checkSize(length1, mikesPulled.length - 1);
    }
}

const getMikes = async(addr) => {
    imgArray = [];
    let mmWallet = await contract.methods.walletOfOwner(addr).call();
    let hghWallet = await hghcontract.methods.getTokensStaked(addr).call();
    let eclWallet = await eclcontract.methods.getTokensStaked(addr).call();

    let lordsWallet = await eclcontract.methods.walletOfOwner(addr).call();
    let hghEclWallet = await hghcontract.methods.expansionGetTokensStaked(ecladdress, addr).call();

    let polyfarmWallet = await polyfarmcontract.methods.allTokensOfOwner(addr).call();
    let henhouseWallet = await henhousecontract.methods.allStakingsOfOwner(addr).call();

    let startobj = {'id': -1, 'text': 'Select your NFT...', 'selected': true}
    mikesPulled.push(startobj);
    for(let i=0; i<mmWallet.length; i++){
        let popmike = populateSelect(address, parseInt(mmWallet[i]));

        popmike.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    for(let i=0; i<hghWallet.length; i++){
        let hghmike = populateSelect(address, parseInt(hghWallet[i]));

        hghmike.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    for(let i=0; i<eclWallet.length; i++){
        let eclmike = populateSelect(address, parseInt(eclWallet[i]));

        eclmike.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    for(let i=0; i<lordsWallet.length; i++){
        let poplord = populateSelect(ecladdress, parseInt(lordsWallet[i]));

        poplord.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    for(let i=0; i<hghEclWallet.length; i++){
        let hghlord = populateSelect(ecladdress, parseInt(hghEclWallet[i]));

        hghlord.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    for(let i=0; i<polyfarmWallet.length; i++){
        let poppoly = populateSelect(polyfarmaddress, parseInt(polyfarmWallet[i].tokenId));

        poppoly.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    for(let i=0; i<henhouseWallet.length; i++){
        let pophenhouse = populateSelect(polyfarmaddress, parseInt(henhouseWallet[i].tokenId));

        pophenhouse.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    let popselect = checkSize(hghWallet.length + mmWallet.length + eclWallet.length + lordsWallet.length + hghEclWallet.length + polyfarmWallet.length + henhouseWallet.length, mikesPulled.length - 1);
    popselect.then(function(res){
        if(res){
            $('#mikeSelect').select2({
                data: mikesPulled,
                theme: "bootstrap-5",
                templateResult: formatSelect,
                templateSelection:  templateSelect, 
                sorter: mikesPulled => mikesPulled.sort((a,b) => a.id.localeCompare(b.id, undefined, {'numeric': true}))
            })
        }
    })
}


const getAccount = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    $('.btn-connect').each(function(){
         $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
    })
   
    //enableMintBtns();
    loadHGHBalance();
    loadEggBalance();
    getCurrentPot();
    $('#btnConnect').removeClass('btn-danger');
    $('#btnConnect').addClass('btn-success');
    mikesPulled = []
    getMikes(account);
}

const currentEntries = async() => {
    let result = await hsroyalecontract.methods.getCurrentEntries().call();
    let startTime = await hsroyalecontract.methods.getTimeTrigger().call();

    let maxUsers = 50;
    if(Math.floor(Date.now() / 1000) - startTime > 3600){
        if(result > 15){
            maxUsers = parseInt(result) + 1;
        }
        else{
            maxUsers = 15;
        }
    }

    let percent = (result / maxUsers) * 100;
    let precentstring = percent.toString() + '%';

    $('#max-users').html(maxUsers.toString())
    $("#total-entries").html(result);
    $('.total-entries-bar').attr('aria-valuenow', result);
    $('.total-entries-bar').css('width', precentstring);
}

const rumbleInfo = async() => {
    setTimeout(() => {
        if (typeof window.ethereum !== 'undefined') {
            if(typeof ethereum.selectedAddress !== 'undefined'){
                loadHGHBalance();
                loadEggBalance();
                getCurrentPot();
            }
        }
    }, 1000);
    
    currentEntries();

    hsroyalecontract.methods.getCurrentRumble().call((err, result) => {
        $("#rumbleId").html(result);
        enableLiveWatch(result);
        if(currentDance != result && currentDance != 0){
            populateResultBtns(currentDance);
            currentDance = result;
        }
        else if(currentDance == 0 && result != 0){
            currentDance = result;
            if(result - 100 > 0){
                for(let i=result-30; i<result; i++){
                    populateResultBtns(i);
                }
            }
            else{
                for(let i=0; i<result; i++){
                    populateResultBtns(i);
                }
            }
        }
    })
}

const getContract = async(nftaddress) =>{
    switch(nftaddress){
        case address:
            return contract;
        break;
        case ecladdress:
            return eclcontract;
        break;
        default:
            return contract;
        break;
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function enableLiveWatch(rumbleId){
    $('#btnWatchLive').fadeIn(200);
    $('#btnWatchLive').attr("href", homeurl + "/watch/" + rumbleId.toString());
}
function populateResultBtns(rumbleId){
    let html = '<div class="col-6 col-sm-3 my-3"><h1 class="text-center">Rumble #' + rumbleId.toString() + '</h1>'
    html += '<div class="d-grid gap-2">'
    html += "<a type='button' href='" + homeurl + "/watch/" + rumbleId.toString() + "' title='Watch Rumble' class='btn btn-dark btn-watch' data-rumbleid='" + rumbleId.toString() + "'><i class='fal fa-swords'></i> Watch Rumble</a>"
    html += "<a type='button' href='" + homeurl + "/results/egg/" + rumbleId.toString() + "' title='View Results' class='btn btn-dark btn-view' data-rumbleid='" + rumbleId.toString() + "'><i class='far fa-trophy'></i> View Results</a>"
    html += '</div></div>'
    $('#danceResults').prepend(html)
}

function templateSelect(data, container){
    $(data.element).attr('data-tokenid', data.tokenid);
    $(data.element).attr('data-contract', data.contract);
    return data.text;
}

function formatSelect (state) {
    if (!state.id) {
        return state.text;
    }
    else if(state.id == -1){
        var $state = $(
            '<span><img src="' + homeurl + '/dist/img/1.png" class="img-flag" /> ' + state.text + '</span>'
        );
        return $state;
    }
    var $state = $(
        '<span><img src="' + imgArray[state.id] + '" class="img-flag" /> ' + state.text + '</span>'
    );
    return $state;
};

$(document).on('click', '#btnEnterRumble', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = parseInt($('#mikeSelect').find(':selected').data('tokenid'))
    let nftaddr = $('#mikeSelect').find(':selected').data('contract')
    let hgh = parseInt($('#hghJuice').find(':selected').val());

    enterRoyaleConnect(nftaddr, id, hgh);
})
// on select
$(document).on('select2:select', '#mikeSelect', function(e){
    let data = e.params.data;
    if(data.id != -1){
        $('#selected-mike img').attr('src', data.image);
        let html = data.name + '<br><small class="purple">Power Level <span data-powerlevel="' + data.powerlevel + '" id="selected-powerlevel">' + data.powerlevel + '</span></small>'
        $('#selected-name').html(html);
        $('#btnEnterRumble').prop('disabled', false);
    }
    else{
        $('#selected-mike img').attr('src', 'dist/img/polyfarm-sample.png');
         $('#selected-name').html("Select your Fox, Hen, Mike, or Club Lord...");
        $('#btnEnterRumble').prop('disabled', true);
    }
});

$(document).on('click', '.btn-connect', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    switchNetworkPoly();

    if (typeof window.ethereum !== 'undefined') {
        getAccount();
    }
    else if(isMobile){
            window.open('https://metamask.app.link/dapp/polyfarm.maticmike.club/#mint', '_blank');
    }
    else{
        $('#alertModal .modal-title').html("Wallet Connection Error");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('MetaMask is not installed. Install MetaMask on a supported browser for minting.<br><br>You can <a href="https://metamask.io/download.html" rel="noreferrer" target="_blank" title="Install MetaMask here for supported browsers">install MetaMask here.</a>');
        alertModal.show();
    }
})

if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0];
        $('.btn-connect').each(function(){
            $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
        })
        
        try{
            $("#mikeSelect").select2("destroy")
            $("#mikeSelect").html('');
        }
        catch(err){
            console.log(err);
        }
        mikesPulled = []
        getMikes(ethereum.selectedAddress);
    });
}


$(function(){
    setInterval(rumbleInfo, 30*1000);
    rumbleInfo();
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
                getMikes(ethereum.selectedAddress);
            }
        }
        catch(err){
            console.log('Wallet not yet connected');
        }
    }, 1000);
})