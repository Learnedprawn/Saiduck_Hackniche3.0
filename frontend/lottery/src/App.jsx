import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import RafflePage from './pages/RafflePage';
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage';
import RaffleFactory from './pages/RaffleFactory';
import AddRaffel from './pages/Admin';


const queryClient = new QueryClient();

const Anvil = {
  id: 31337,
  name: "Anvil",
  iconUrl:
    "https://cdn2.vectorstock.com/i/1000x1000/98/71/anvil-block-icon-black-color-in-circle-vector-20529871.jpg",
  iconBackground: "#fff",
  nativeCurrency: { name: "Anvil", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["HTTP://127.0.0.1:8545"] },
  },
};


const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, Anvil],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
function App() {
  const [count, setCount] = useState(0)

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <div className="bg-white min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              {/* <Route path="/raffle" element={<Raffle />} /> */}
              <Route path="/raffle" element={<RafflePage />} />
              <Route path="/rafflefactory" element={<RaffleFactory />} />
              <Route path="/addrafel" element={<AddRaffel />} />
            </Routes>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );

}

export default App
