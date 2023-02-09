import "./App.scss";
import React from "react";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { Wallet } from "./components/Wallet";
import { Spinner } from "./components/shared/Spinner";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import pokemonsNFTsContract from "../assets/PokemonsNFTsContract.json";

function App() {
  const initialState = { address: "Connect wallet", provider: {}, signer: {} };
  const [user, setUser] = React.useState(initialState);
  const [nfts, setNfts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const onSafeMint = async () => {
    try {
      setLoading(true);

      const contract = new ethers.Contract(
        pokemonsNFTsContract.address,
        pokemonsNFTsContract.abi,
        user.signer
      );
      contract.on("CreatePokemon", (requestId, tokenId, id, uri) => {
        const uriSplited = uri.split("data:application/json;base64,");
        const base64 = uriSplited[1];

        const decodeBase64 = Buffer.from(base64, "base64").toString("utf8");
        const uriJson = JSON.parse(decodeBase64);

        const types = uriJson.attributes
          .map((attribute) => attribute.value)
          .join(", ");

        setNfts([...nfts, { ...uriJson, types }]);
        setLoading(false);
      });

      await contract.safeMint({ gasLimit: 250000 });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
            setUser({ address: "Connect wallet", provider: {}, signer: {} });
          }
        });
      });
      window.ethereum.on("accountsChanged", () => {
        setUser({ address: "Connect wallet", provider: {}, signer: {} });
      });
    }
  }, []);

  return (
    <React.Fragment>
      <nav>
        <Wallet user={user} setUser={setUser} setNfts={setNfts} />
      </nav>
      {user.address !== "Connect wallet" && (
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
