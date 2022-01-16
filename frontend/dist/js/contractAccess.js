// 100000000000000000000000
const hghAccess = async () => {
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
        hghAccessTransaction();
    }
}

const burnAccess = async () => {
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
        burnAccessTransaction();
    }
}

//btn-burn-setup
$(document).on('click', '.btn-burn-setup', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    hghAccess();
})

$(document).on('click', '.btn-hgh-setup', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    burnAccess();
})

async function hghAccessTransaction(){
    let weiValue = web3.utils.toWei("100000", "ether")
    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.approve(address, weiValue).encodeABI(),
        chainId: chainID
    }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
    })
}

async function burnAccessTransaction(){
    const tx = {
        from: ethereum.selectedAddress,
        to: address,
        data: contract.methods.setApprovalForAll(hghaddress, true).encodeABI(),
        chainId: chainID
    }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
    })
}