let qstring = window.location.href.split("/")
const rumbleId = parseInt(qstring.pop()) || 0;
const royaleContract = 'egg';

const royaleAddress = getRoyaleAddress(royaleContract);
const dancecontract = getDanceContract(royaleAddress);

let winners = []

if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0]
        $('.btn-connect').each(function(){
            $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase())
        })
    })
}

 $(document).on('click', '.btn-connect', function(e){
    e.preventDefault()
    e.stopImmediatePropagation()
    switchNetworkPoly()

    if (typeof window.ethereum !== 'undefined') {
        getAccount()
    }
    else if(isMobile){
            window.open('https://metamask.app.link/dapp/polyfarm.maticmike.club/#mint', '_blank')
    }
    else{
        $('#alertModal .modal-title').html("Wallet Connection Error")
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('MetaMask is not installed. Install MetaMask on a supported browser for minting.<br><br>You can <a href="https://metamask.io/download.html" rel="noreferrer" target="_blank" title="Install MetaMask here for supported browsers">install MetaMask here.</a>')
        alertModal.show()
    }
})

async function getAccount(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    $('.btn-connect').each(function(){
         $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase())
    })
}

const pullMike =  async(args, i) => {
    let thecontract = getContractByAddress(args._contract);
    
    let result = await thecontract.methods.tokenURI(parseInt(args.tokenId)).call()
    let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")))
    metadata['id'] = parseInt(args.tokenId);
    metadata['contract'] = args._contract;
    metadata['index'] = i;
    return metadata;
}

const getStats = async(meta) => {
    if(meta.contract == undefined){
        meta.contract = address;
    }

    let tempAddress = '';

    if(royaleAddress == legacy){
        tempAddress = danceoffaddress;
    }
    else{
        tempAddress = royaleAddress;
    }
    let entered = await dancecontract.methods.getRumblesEntered(meta.id, meta.contract).call()

    let placed = await dancecontract.methods.getPlacementsByToken(meta.id, meta.contract).call()

    meta['entered'] = parseInt(entered.length)
    meta['placed'] = placed
    meta['placepercent'] = parseFloat(placed.length / parseInt(entered.length) * 100).toFixed(2).toString() + '%'

    let firsts = 0
    let seconds = 0
    let thirds = 0

    for(let i=0; i<placed.length; i++){
        switch(placed[i].placement){
            case '1':
                firsts++
            break
            case '2':
                seconds++
            break
            case '3':
                thirds++
            break
        }
    }

    meta['firstpercent'] = parseFloat(firsts / entered.length * 100).toFixed(2).toString() + '%'
    meta['secondpercent'] = parseFloat(seconds / entered.length * 100).toFixed(2).toString() + '%'
    meta['thirdpercent'] = parseFloat(thirds / entered.length * 100).toFixed(2).toString() + '%'

    return meta
}

const pullInfo = async(id) => {
    let rumbleActive = await dancecontract.methods.isComplete(id).call()
    if(rumbleActive){
        winners = await dancecontract.methods.getPlacementsByRumble(id).call()
        for(let i=0; i<winners.length; i++){
            let mike = pullMike(winners[i], i)
            mike.then(function(metadata){
                let html = ''
                html += '<img src="' + metadata.image + '" class="img img-fluid" /><br>'
                switch(winners[metadata.index].placement){
                    case '1':
                        html += `<h3 class="text-center purple">First Place<br><small class="purple">${metadata.name}</small></h1>`
                        html += `<b class="text-center">Payout: ${parseFloat(web3.utils.fromWei(winners[metadata.index].payout, 'ether')).toFixed(2).toString()} <i class="fal fa-egg"></i>EGGs</b>`
                        
                        html += '<br><i>' + winners[metadata.index].holder.substring(0, 2) + winners[metadata.index].holder.substring(2, 6).toUpperCase() + '...' + winners[metadata.index].holder.substring(winners[metadata.index].holder.length-4).toUpperCase() + '</i>'
                        $('#winnersRow .first-place').html(html)

                        var stats = getStats(metadata)

                        stats.then(function(result){
                            let stathtml = '<b>' + result.name + '</b><br><ul class="list-group">'
                            stathtml += `<li class="list-group-item">Entered <span class="purple">${result.entered}</span> Dance Royales</li>`
                            stathtml += `<li class="list-group-item">Placement %: <span class="purple">${result.placepercent}</span></li>`
                            stathtml += `<li class="list-group-item">First Place: <span class="purple">${result.firstpercent}</span></li>`
                            stathtml += `<li class="list-group-item">Second Place: <span class="purple">${result.secondpercent}</span></li>`
                            stathtml += `<li class="list-group-item">Third Place: <span class="purple">${result.thirdpercent}</span></li>`
                            stathtml += '</ul>'
                            $('#winnerInfo .first-place').html(stathtml)
                        })
                    break
                    case '2':
                        html += `<h3 class="text-center purple">Second Place<br><small class="purple">${metadata.name}</small></h1>`
                        html += `<b class="text-center">Payout: ${parseFloat(web3.utils.fromWei(winners[metadata.index].payout, 'ether')).toFixed(2).toString()} <i class="fal fa-egg"></i>EGGs</b>`
                        
                        html += '<br><i>' + winners[metadata.index].holder.substring(0, 2) + winners[metadata.index].holder.substring(2, 6).toUpperCase() + '...' + winners[metadata.index].holder.substring(winners[metadata.index].holder.length-4).toUpperCase() + '</i>'
                        $('#winnersRow .second-place').html(html)

                        var stats = getStats(metadata)

                        stats.then(function(result){
                            let stathtml = '<b>' + result.name + '</b><br><ul class="list-group">'
                            stathtml += `<li class="list-group-item">Entered <span class="purple">${result.entered}</span> Dance Royales</li>`
                            stathtml += `<li class="list-group-item">Placement %: <span class="purple">${result.placepercent}</span></li>`
                            stathtml += `<li class="list-group-item">First Place: <span class="purple">${result.firstpercent}</span></li>`
                            stathtml += `<li class="list-group-item">Second Place: <span class="purple">${result.secondpercent}</span></li>`
                            stathtml += `<li class="list-group-item">Third Place: <span class="purple">${result.thirdpercent}</span></li>`
                            stathtml += '</ul>'
                            $('#winnerInfo .second-place').html(stathtml)
                        })
                    break
                    case '3':
                        html += `<h3 class="text-center purple">Third Place<br><small class="purple">${metadata.name}</small></h1>`
                        html += `<b class="text-center">Payout: ${parseFloat(web3.utils.fromWei(winners[metadata.index].payout, 'ether')).toFixed(2).toString()} <i class="fal fa-egg"></i>EGGs</b>`
                        
                        html += '<br><i>' + winners[metadata.index].holder.substring(0, 2) + winners[metadata.index].holder.substring(2, 6).toUpperCase() + '...' + winners[metadata.index].holder.substring(winners[metadata.index].holder.length-4).toUpperCase() + '</i>'
                        $('#winnersRow .third-place').html(html)

                        var stats = getStats(metadata)

                        stats.then(function(result){
                            let stathtml = '<b>' + result.name + '</b><br><ul class="list-group">'
                            stathtml += `<li class="list-group-item">Entered <span class="purple">${result.entered}</span> Dance Royales</li>`
                            stathtml += `<li class="list-group-item">Placement %: <span class="purple">${result.placepercent}</span></li>`
                            stathtml += `<li class="list-group-item">First Place: <span class="purple">${result.firstpercent}</span></li>`
                            stathtml += `<li class="list-group-item">Second Place: <span class="purple">${result.secondpercent}</span></li>`
                            stathtml += `<li class="list-group-item">Third Place: <span class="purple">${result.thirdpercent}</span></li>`
                            stathtml += '</ul>'
                            $('#winnerInfo .third-place').html(stathtml)
                        })
                    break
                }
                
            })
        }
    }
    else{
        let html = '<div class="col-12 text-center"><h1 class="text-center">This Rumble Has Not Started</h1><br><br><a href="' + homeurl + '/watch/' + id.toString() + '" class="btn btn-dark btn-lg"><i class="fak fa-dance"></i> Watch Live</a></div>'

        $('#winnersRow').html(html)
        $('#statsSection').hide()
    }
}

$(function(){
    pullInfo(rumbleId)
})