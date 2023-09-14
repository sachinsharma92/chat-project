'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useWorldStore } from '@/store/CanvasProvider';
import { useProgress } from '@react-three/drei';

function LoadingScreen() {
  const { progress } = useProgress();
  const isLoading = progress < 100;
  const { isStarted } = useWorldStore();

  return (
    <>
      <AnimatePresence>
        {!isStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute flex w-full h-full z-1 top-0 left-0 bg-white overflow-hidden"
          >
            <AnimatePresence>
              {isLoading && (
                <>
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 4, ease: 'easeOut' }}
                    className="w-full h-full  absolute top-2 left-0 z-10 flex text-gray-500 justify-center items-center flex-col"
                  >
                    <Image
                      alt="logo"
                      src="/assets/textures/one.jpg"
                      width={1000}
                      height={1000}
                      objectFit="cover"
                      priority
                    />
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
