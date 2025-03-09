import React, { useEffect, useState } from "react";
import { ConnectButton} from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const words = ["secure", "fair", "fun"];

const Homepage = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState(words[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isConnected) {
      navigate("/raffle");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    const typingSpeed = isDeleting ? 100 : 200;
    const changeWord = setTimeout(() => {
      setDisplayedWord((prev) =>
        isDeleting ? prev.slice(0, -1) : words[wordIndex].slice(0, prev.length + 1)
      );
      
      if (!isDeleting && displayedWord === words[wordIndex]) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && displayedWord === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);
    
    return () => clearTimeout(changeWord);
  }, [displayedWord, isDeleting, wordIndex]);

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen bg-black text-white px-6 md:px-12 overflow-hidden"
    >
      {/* Background GIF */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('https://images.barrons.com/im-614147?width=1280&size=1.33333333')" }}
      ></div>
      
      <motion.div 
        className="relative flex flex-col md:flex-row items-center max-w-7xl w-full z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side - Text and Connect Button */}
        <motion.div 
          className="md:w-1/2 text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-8xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient"
            animate={{ backgroundPosition: "200% 0" }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 3 }}
          >
            Welcome to <span className="font-extrabold">RaffleChain</span>
          </motion.h1>
          
          <motion.h2 
            className="text-5xl font-bold text-white-100 h-14 font-mono"
          >
            {displayedWord}|
          </motion.h2>
          
          <p className="text-gray-300 text-3xl mb-10">
            Join the <span className="font-bold text-indigo-400">excitement</span> and stand a chance to <span className="text-yellow-500">win big!</span> 
            Connect your wallet to get started.
          </p>
          <motion.div 
            className="flex justify-center md:justify-start"
            whileHover={{ scale: 1.2 }}
          >
            <ConnectButton className="px-10 py-5 text-3xl bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xl transition-all" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Homepage;
