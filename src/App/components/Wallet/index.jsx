import "./Wallet.scss";
import React from "react";
import { ethers } from "ethers";

export function Wallet(props) {
  const { user, setUser, setNfts } = props;
  const [loading, setLoading] = React.useState(false);

  const connectWallet = async () => {
    if (!window.ethereum?.isMetaMask) {
      window.alert(
        "Metamask wasn't detected, please install metamask extension"
      );
      return;
    }

    if (user.address === "Connect wallet") {
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];

      const signer = provider.getSigner();
      const chainId = await signer.getChainId();
      if (chainId !== 5) {
        window.alert("Change your network to Goerli testnet!");
        setLoading(false);
        return;
      }
      setNfts([]);
      setUser({ address: account, provider, signer });
      setLoading(false);
    } else {
      setUser({ address: "Connect wallet", provider: {}, signer: {} });
      setLoading(false);
    }
  };

  return (
    <button className="button-wallet" onClick={connectWallet}>
      {loading
        ? "loading..."
        : user.address !== "Connect wallet"
        ? "..." + String(user.address).slice(36)
        : "Connect wallet"}
    </button>
  );
}
