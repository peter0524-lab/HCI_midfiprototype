
import React from 'react';
import { motion } from 'framer-motion';
import { LogoIcon } from './Icons';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div
      className="absolute inset-0 bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <LogoIcon className="h-24 w-24 text-white" />
      </motion.div>
      <motion.p
        className="text-white text-lg mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        당신을 환영합니다
      </motion.p>
    </motion.div>
  );
};
