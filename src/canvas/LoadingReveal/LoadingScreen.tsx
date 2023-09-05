'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLoadingProgress, useWorldStore } from '@/store/CanvasProvider';

function LoadingScreen() {
  const progress = useLoadingProgress();
  const isLoading = progress < 100;
  const { isStarted } = useWorldStore();

  return (
    <>
      <AnimatePresence>
        {!isStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute flex w-full h-full z-1 top-0 left-0 bg-white"
          >
            <AnimatePresence>
              {isLoading && (
                <>
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full absolute -top-10 left-0 z-10 flex text-gray-500 justify-center items-center flex-col"
                  >
                    <Image
                      alt="logo"
                      src="/assets/textures/one.jpg"
                      fill
                      objectFit='cover'
                      priority
                    />
                    {/* <motion.span className="loader" /> */}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default LoadingScreen;

//* Start Button if needed later
{
  /* <AnimatePresence>
              {!isLoading && (
                <motion.button
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={styles.start}
                  onClick={start}
                >
                  Start
                </motion.button>
              )}
      </AnimatePresence> */
}
