import "./App.scss";
import React from "react";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { Wallet } from "./components/Wallet";
import axios from "axios";
import { Spinner } from "./components/shared/Spinner";
import { ethers } from "ethers";
const BACKEND = "https://chainlink-workshop-node.onrender.com";

function App() {
  const [user, setUser] = React.useState("Connect wallet");
  const [nfts, setNfts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const onSafeMint = async () => {
    setLoading(true);
    const idRamdom = Math.floor(Math.random() * 151) + 1;

    const response = await axios.get(`${BACKEND}/getPokemon`, {
      params: { idRamdom },
    });
    const data = response.data;

    const types = data.attributes
      .map((attribute) => attribute.value)
      .join(", ");

    setNfts([...nfts, { ...data, types }]);
    setLoading(false);
  };

  React.useEffect(() => {
    const currentNetwork = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const chainId = await web3Signer.getChainId();
      return chainId;
    };
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        currentNetwork().then((response) => {
          if (response !== 80001) {
            setUser("Connect wallet");
          }
        });
      });
      window.ethereum.on("accountsChanged", () => {
        setUser("Connect wallet");
      });
    }
  }, []);

  return (
    <React.Fragment>
      <nav>
        <Wallet user={user} setUser={setUser} setNfts={setNfts} />
      </nav>
      {user !== "Connect wallet" && (
        <div className="app">
          <p className="app__title">{`Your news NFTs - AnyAPIs 💥`}</p>
          <button className="app__get" onClick={onSafeMint}>
            safeMint
          </button>
          <>
            {loading ? (
              <Spinner />
            ) : (
              <div className="app-list">
                {nfts.map((nft, index) => {
                  return (
                    <Card
                      key={index}
                      title={nft.name}
                      cover={<img src={nft.image} alt={"img"} />}
                    >
                      <Meta description={nft.types}></Meta>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
