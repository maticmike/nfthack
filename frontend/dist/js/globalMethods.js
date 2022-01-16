async function loadHGHBalance(){
    // current-hgh-held
    hghcontract.methods.balanceOf(ethereum.selectedAddress).call((err, result) => { 
        hghBalance = parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(2)
        $('.current-hgh-held').html(hghBalance);
    });
}

async function loadEggBalance(){
    // current-hgh-held
    wethcontract.methods.balanceOf(ethereum.selectedAddress).call((err, result) => { 
        wethBalance = parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(2)
        $('.current-weth-held').html(wethBalance);
    });
}

const getCurrentPot = async() => {
    hsroyalecontract.methods.getCurrentPot().call((err, result) => {
        $('.current-weth-pot').html(parseInt(web3.utils.fromWei(result, 'ether')))
    });
    
}


$(document).on('click', '.btn-traits', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let html = '<div class="container-fluid">';

    let traits = JSON.parse($(this).attr('data-traits'));

    html += '<div class="row">';
    for(let i=0; i<traits.length; i++){
        
        html += '<div class="col-6 mb-2">';
        html += '<div class="card"><div class="card-body"><p class="card-title">'+ traits[i].trait_type + '</p>'
        html += '<p class="card-text">' + traits[i].value + '</p></div></div>';
        html += '</div>';
    }

    html += '</div></div>';

    $('#alertModal .modal-title').html("Traits");
    // change this to allow coinbase and trust wallet links
    $('#alertModal .modal-body').html(html);
    alertModal.show();
})

function nicknameToTokenAddress(nickname){
    switch(nickname.toLowerCase()){
        case 'mike':
            return address;
            break;
        case 'ecl':
            return ecladdress;
            break;
        default:
            return address;
            break;
    }
}

function addressToNickname(theaddress){
    switch(theaddress){
        case danceoffaddress:
            return 'hgh';
            break;
        case legacy:
            return 'legacy';
            break;
        case address:
            return 'mike';
            break;
        case ecladdress:
            return 'ecl';
            break;
        case hsroyaleaddress:
            return 'egg';
        case henhousecontract:
            return 'henhouse';
        case polyfarmcontract:
            return 'polyfarm';
        default:
            return 'hgh';
            break;
    }
}

function getContractByAddress(theaddress){
    switch(theaddress){
        case address:
            return contract;
            break;
        case ecladdress:
            return eclcontract;
            break;
        case polyfarmaddress:
            return polyfarmcontract;
        default:
            return contract;
            break;
    }
}

function getDanceContract(thecontract){
    switch(thecontract){
        case danceoffaddress:
            return danceoff;
            break;
        case legacy:
            return legacycontract;
            break;
        case hsroyaleaddress:
            return hsroyalecontract;
        default:
            return danceoff;
            break;
    }
}

function getRoyaleAddress(nickname){
    switch(nickname.toLowerCase()){
        case 'hgh':
            return danceoffaddress;
            break;
        case 'egg':
            return hsroyaleaddress;
        case 'legacy':
            return legacy;
        default:
            return danceoffaddress;
            break;
    }  
}