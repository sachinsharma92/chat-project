import { colorStore, hairStyleStore } from '@/store/AvatarStore';
import React, { useState } from 'react';
import { motion as m } from 'framer-motion';

const Configurator = () => {
  const setColor = colorStore((state: any) => state.setColor);
  const setHairStyle = hairStyleStore((state: any) => state.setHairStyle);

  const [config, setConfig] = useState(false);
  return (
    <>
      <div className="w-screen h-screen abso flex justify-end items-center z-[100]">
        <div className="w-16 h-16 rounded-lg border-black border-2 flex absolute">
          <div className="w-full h-full flex justify-center items-center">
            <h1
              onClick={() => setConfig(true)}
              className="text-sm cursor-pointer"
            >
              EDIT
            </h1>
          </div>
        </div>

        {config && (
          <m.div
            onClick={() => setConfig(false)}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white w-full h-2/5 mt-[25rem] rounded-xl"
          >
            {/* color */}
            <div className="flex flex-row justify-center items-center gap-4 mt-4">
              <div
                onClick={() => setColor('yellow')}
                className="bg-yellow-200 w-10 h-10 rounded-full"
              />
              <div
                onClick={() => setColor('blue')}
                className="bg-blue-300 w-10 h-10 rounded-full"
              />
              <div
                onClick={() => setColor('green')}
                className="bg-green-300 w-10 h-10 rounded-full"
              />
              <div
                onClick={() => setColor('pink')}
                className="bg-pink-400 w-10 h-10 rounded-full"
              />
            </div>
            <h1 onClick={() => setHairStyle('short')}>box</h1>
          </m.div>
        )}
      </div>
    </>
  );
};

export default Configurator;
