import { useState, useEffect } from "react";
// import Web3 from "web3";
import "./App.css";
const networks = {
  ethereum: {
    chainId: `0x${Number(1).toString(16)}`,
  },
  optimism: {
    chainId: `0x${Number(10).toString(16)}`,
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
  },
};
const changeNetwork = async ({ networkName, setError }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          ...networks[networkName],
        },
      ],
    });
  } catch (err) {
    setError(err.message);
  }
};
function App() {
  const [error, setError] = useState();
  const [chainId, setChainId] = useState("0x1");
  const [accounts, setAccounts] = useState("");
  const handleNetworkSwitch = async (networkName) => {
    setError();
    await changeNetwork({ networkName, setError });
  };

  const networkChanged = (chainId) => {
    setChainId(chainId);
  };
  useEffect(() => {
    window.ethereum.on("chainChanged", networkChanged);
    window.ethereum.on("accountsChanged", handleConnectWallet);
    return () => {
      window.ethereum.removeListener("chainChanged", networkChanged);
    };
  }, []);
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => setAccounts(result));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="App w-screen h-screen bg-purple-900 relative">
      <div className="w-96 relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          className="w-32 h-14 bg-white block relative left-1/2 -translate-x-1/2 rounded-3xl "
          onClick={handleConnectWallet}
        >
          {accounts === ""
            ? "Connect Wallet"
            : `${accounts[0].slice(0, 4)}...${accounts[0].slice(
                accounts[0].length - 4,
                accounts[0].length
              )}`}
        </button>
        <button
          className={`w-32 h-14 ${
            chainId === "0x1" ? "bg-blue-500" : "bg-white"
          } mt-3 block relative left-1/2 -translate-x-1/2 rounded-3xl `}
          onClick={() => handleNetworkSwitch("ethereum")}
        >
          Ethereum
        </button>
        <button
          className={`w-32 h-14 ${
            chainId === "0xa" ? "bg-blue-500" : "bg-white"
          } mt-3 block relative left-1/2 -translate-x-1/2 rounded-3xl `}
          onClick={() => handleNetworkSwitch("optimism")}
        >
          Optimism
        </button>
        <button
          className={`w-32 h-14 ${
            chainId === "0x89" ? "bg-blue-500" : "bg-white"
          } mt-3 block relative left-1/2 -translate-x-1/2 rounded-3xl `}
          onClick={() => handleNetworkSwitch("polygon")}
        >
          Polygon
        </button>
        <button
          className={`w-32 h-14 ${
            chainId === "0x38" ? "bg-blue-500" : "bg-white"
          } mt-3 block relative left-1/2 -translate-x-1/2 rounded-3xl`}
          onClick={() => handleNetworkSwitch("bsc")}
        >
          BSC
        </button>
        {error ? error.message : ""}
      </div>
    </div>
  );
}

export default App;
