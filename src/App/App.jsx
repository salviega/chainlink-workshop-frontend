import "./App.scss";
import React from "react";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { Wallet } from "./components/Wallet";
import axios from "axios";
const BACKEND = "https://chainlink-workshop-node.onrender.com";

function App() {
  const [user, setUser] = React.useState("Connect wallet");
  const [nfts, setNfts] = React.useState([]);

  const onSafeMint = async () => {
    const idRamdom = Math.floor(Math.random() * 151) + 1;

    const response = await axios.get(`${BACKEND}/getPokemon`, {
      params: { idRamdom },
    });
    const responseJSON = response.data;

    setNfts([...nfts, responseJSON]);
  };

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
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
