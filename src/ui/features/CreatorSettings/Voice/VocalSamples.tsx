'use client';

import { ICloneAudioItem, IUserPrivateProps } from '@/types/supabase';
import { useMemo } from 'react';
import { isEmpty, map } from 'lodash';
import { CrossIcon, PlayIcon } from '@/icons';

import './VocalSamples.css';
import Button from '@/components/common/Button';

const VocalSampleItem = (props: { item: ICloneAudioItem }) => {
  const { item } = props;

  const removeItem = () => {};
  
  return (
    <div className="vocal-sample-item">
      <div className="flex justify-start items-center">
        <Button className="h-[30px] w-[30px] p-0 flex justify-center items-center">
          <PlayIcon />
        </Button>
        <p>{item?.name}</p>
      </div>

      <div className="flex justify-start items-center">
        <Button
          onClick={removeItem}
          className="h-[30px] w-[30px] p-0 flex justify-center items-center"
        >
          <CrossIcon />
        </Button>
      </div>
    </div>
  );
};

const VocalSamples = (props: {
  userPrivateData: IUserPrivateProps;
  setUserPrivateData: (userPrivateData: IUserPrivateProps) => void;
}) => {
  const { userPrivateData } = props;

  const cloneAudioFiles: ICloneAudioItem[] = useMemo(
    () => userPrivateData?.cloneAudio?.data || [],
    [userPrivateData],
  );

  return (
    <div className="vocal-samples">
      {!isEmpty(cloneAudioFiles) && (
        <ul className="vocal-samples-list">
          {map(cloneAudioFiles, (audioFile, index) => {
            const key = `${audioFile.name}${index}`;

            return <VocalSampleItem item={audioFile} key={key} />;
          })}
        </ul>
      )}
    </div>
  );
};

export default VocalSamples;
