// let qstring = window.location.href.split("/")
// let rumbleId = parseInt(qstring.pop()) || -1
// let contract = qstring.pop() || "hgh"

let qstring = window.location.href.split("/")
let rumbleId = parseInt(qstring.pop()) || -1
let royaleContract = 'egg'

const royaleAddress = getRoyaleAddress(royaleContract);
const dancecontract = getDanceContract(royaleAddress);

const pony = new Audio(homeurl + '/dist/media/pony.mp3');

let meta = [];

// these now need to be objects of id, contract
let winners = [];
let winnerIds = [];
let loserIds = [];

let participants = [];
let rumbleActive = false;
let startedDance = false;

let shakecss = ['shake-1', 'shake-2', 'shake-3', 'shake-4', 'shake-5', 'shake-6', 'shake-7', 'shake-8']


function muteMe(elem) {
    localStorage.setItem('muted', true);
    try{
        pony.muted = true;
        pony.pause();
    }
    catch(err){
        console.log(err);
    }
    
}

function unmuteMe(elem){
    localStorage.setItem('muted', false);
    try{
        if(startedDance){
            pony.play();
            pony.muted = false;
        }
    }
    catch(err){
        console.log(err);
    }
}
// Try to mute all video and audio elements on the page
function mutePage() {
    document.querySelectorAll("video, audio").forEach( elem => muteMe(elem) );
}

function unmutePage() {
    document.querySelectorAll("video, audio").forEach( elem => unmuteMe(elem) );
}

$(document).on('click', '#btnMute', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(localStorage.getItem("muted") == 'true'){
        $('#btnMute').html('<i class="fas fa-volume-up"></i>')
        unmuteMe();
    }
    else{
        $('#btnMute').html('<i class="fas fa-volume-mute"></i>')
        muteMe();
    }
})

const pullMike =  async(args) => {
    let thecontract = getContractByAddress(args._contract);
    
    let result = await thecontract.methods.tokenURI(parseInt(args.tokenId)).call()
    let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")))
    metadata['id'] = parseInt(args.tokenId);
    metadata['contract'] = args._contract;

    return metadata;
}

// pull array
const pullInfo = async(id) => {
    let results = await dancecontract.methods.getEntriesByRumble(id).call()
    let newentries = [];

    for(let i=0; i<results.length; i++){
        let found = false;
        for(let j=0; j<participants.length; j++){
            try{
                if(results[i].tokenId == participants[j].tokenId && results[i]._contract == participants[i]._contract){
                    found = true;
                }
            }
            catch(err){
                console.log(err)
            }
        }
        if(!found){
            newentries.push(results[i]);
        }
    }

    for(let i=0; i<newentries.length; i++){
        participants.push(newentries[i]);
        let mike = pullMike(newentries[i]);
        mike.then(function(metadata){
            switch(metadata.contract){
                case address:
                    meta[metadata.id] = metadata;
                break;
                case ecladdress:
                    meta[metadata.id + 10000] = metadata;
                break;
                default:
                    meta[metadata.id + 100000] = metadata;
                break;
            }
            
            let html = '<div style="display:none;" class="mike col-2 col-md-1 text-center" data-id="' + metadata.id.toString() + '" data-contract="' + metadata.contract + '"><img src="' + metadata.image + '" class="img img-fluid" />'
            html += '<span class="text-center">#' + metadata.id + '</span></div>'

            $('#mike-canvas').append(html)
            $('#mike-canvas').find(`[data-id='${metadata.id}'][data-contract='${metadata.contract}']`).fadeIn(200)
        })
    }

    rumbleActive = await dancecontract.methods.isComplete(id).call();
    if(rumbleActive){
        loserIds = participants
        winners = await dancecontract.methods.getPlacementsByRumble(id).call()
        for(let i=0; i<winners.length; i++){
            let winner = {};
            
            winner['tokenId'] = winners[i].tokenId;
            winner['_contract'] = winners[i]._contract;
            winnerIds.push(winner)

            loserIds = filterLosers(loserIds, winner);
        }
    }

    shuffleArray(loserIds);
}

function filterLosers(loserIds, winner){
    newLosers = [];
    for(let i=0; i<loserIds.length; i++){
        if (loserIds[i].tokenId == winner.tokenId && loserIds[i]._contract == winner._contract){
            
        }
        else{
            newLosers.push(loserIds[i]);
        }
    }

    return newLosers;
}

const startDance = async(id) => {
    startedDance = true;
    if(localStorage.getItem("muted") === 'false'){
        pony.play()
    }

    $('#dance').fadeOut(750);
    await sleep(1050);
    $('#countdown').fadeIn(750)
    await sleep(3000);
    $('#countdown').fadeOut(750);
    await sleep(1000);
    $('#dance').fadeIn(750);
    // assign random shakes
    for(let i=0; i<participants.length; i++){
        let shakeClass = shakecss[Math.floor(Math.random()*shakecss.length)];
        $('#mike-canvas').find(`[data-id='${participants[i].tokenId}'][data-contract='${participants[i]._contract}']`).addClass(shakeClass);
        animateDiv(participants[i]);
    }
    

    // bring top 3 to center of the screen
    let loserfade = fadeLosers();

    loserfade.then(function(){
        $('#resultsButton').attr('href', homeurl + "/results/" + addressToNickname(royaleAddress) + "/" + rumbleId.toString())
        for(let i=0; i<winners.length; i++){
        let html = '';
            let idMod = 0;
            switch(winners[i]._contract){
                case address:
                    idMod = 0;
                break;
                case ecladdress:
                    idMod = 10000;
                break;
                default:
                    idMod = 100000;
                break;
            }
            switch(winners[i].placement){
                case '1':
                    html += '<img src="' + meta[idMod+parseInt(winners[i].tokenId)].image + '" class="img img-fluid" /><br>'
                    html += `<h3 class="text-center purple">First Place<br><small class="purple">${meta[idMod+parseInt(winners[i].tokenId)].name}</small></h1>`
                    html += `<b class="text-center">Payout: ${parseFloat(web3.utils.fromWei(winners[i].payout, 'ether')).toFixed(4)} <i class="fal fa-egg"></i>EGGs</b>`
                    $('#firstPlace').html(html);
                break;
                case '2':
                    html += '<img src="' + meta[idMod+parseInt(winners[i].tokenId)].image + '" class="img img-fluid" /><br>'
                    html += `<h3 class="text-center purple">Second Place<br><small class="purple">${meta[idMod+parseInt(winners[i].tokenId)].name}</small></h3>`
                    html += `<b class="text-center">Payout: ${parseFloat(web3.utils.fromWei(winners[i].payout, 'ether')).toFixed(4)} <i class="fal fa-egg"></i>EGGs</b>`
                    $('#secondPlace').html(html);
                break;
                case '3':
                    html += '<img src="' + meta[idMod+parseInt(winners[i].tokenId)].image + '" class="img img-fluid" /><br>'
                    html += `<h3 class="text-center purple">Third Place<br><small class="purple">${meta[idMod+parseInt(winners[i].tokenId)].name}</small></h3>`
                    html += `<b class="text-center">Payout: ${parseFloat(web3.utils.fromWei(winners[i].payout, 'ether')).toFixed(4)} <i class="fal fa-egg"></i>EGGs</b>`
                    $('#thirdPlace').html(html);
                break;
            }
        }
        setTimeout(() => {
            $('#dance').fadeOut(950);
            setTimeout(() => {
                $('#winners').fadeIn(250);
            }, 1000);
        }, 5000)
    })
    
}

const animateDiv = async(args) =>{
    var newq = makeNewPosition();
    var oldq =  $('#mike-canvas').find(`[data-id='${args.tokenId}'][data-contract='${args._contract}']`).offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('#mike-canvas').find(`[data-id='${args.tokenId}'][data-contract='${args._contract}']`).animate({ top: newq[0], left: newq[1] }, speed, function(){
        if($('#mike-canvas').find(`[data-id='${args.tokenId}'][data-contract='${args._contract}']`).is(':visible')){
            animateDiv(args);
        }
        else{
            console.log(args.tokenId.toString() + " has been eliminated.")
        }
    });
}

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.1;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;

}

const fadeLosers = async() => {
    for(let i=0; i<loserIds.length; i++){
        await sleep(1000);
        // fade out one of losers;
        $('#mike-canvas').find(`[data-id='${loserIds[i].tokenId}'][data-contract='${loserIds[i]._contract}']`).fadeOut(250);
    }

    return new Promise(resolve => setTimeout(resolve, 5000));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getRumble = async() => {
    let result = await dancecontract.methods.getCurrentRumble().call();
    return result;
}
$(function(){
    if (localStorage.getItem("muted") === null) {
        localStorage.setItem("muted", false);
        $('#btnMute').html('<i class="fas fa-volume-up"></i>')
    }
    else if(localStorage.getItem("muted") === 'true'){
        $('#btnMute').html('<i class="fas fa-volume-mute"></i>')
    }
    else{
        $('#btnMute').html('<i class="fas fa-volume-up"></i>')
    }

    if(rumbleId === -1 && window.location.href.split("/").pop() !== '0'){
        if(royaleContract.toLowerCase == 'watch'){
            royaleContract = 'hgh';
        }
        result = getRumble();
        result.then(function(id){
            rumbleId = id;
            setInterval(() => {
                if(!rumbleActive){
                    pullInfo(rumbleId)
                }
                else if(!startedDance){
                    startDance(rumbleId)
                }
            }, 15000);
            pullInfo(rumbleId);
        })
    }
    else if(window.location.href.split("/").pop() === '0'){
        rumbleId = 0;
        setInterval(() => {
            if(!rumbleActive){
                pullInfo(rumbleId)
            }
            else if(!startedDance){
                startDance(rumbleId)
            }
        }, 15000);
        pullInfo(rumbleId);
    }
    else{
        setInterval(() => {
            if(!rumbleActive){
                pullInfo(rumbleId)
            }
            else if(!startedDance){
                startDance(rumbleId)
            }
        }, 15000);
        pullInfo(rumbleId);
    }
    
})