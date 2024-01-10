'use client';

import { ICloneAudioItem, IUserPrivateProps } from '@/types/supabase';
import { useMemo } from 'react';
import { filter, isEmpty, isFunction, map, pick, size } from 'lodash';
import { CrossIcon, PlayIcon } from '@/icons';
import { maxVocalSampleAudioFiles } from '@/constants';
import { updateUserPrivateDataProps } from '@/lib/supabase';
import { useAuth } from '@/hooks';

import Button from '@/components/common/Button';
import './VocalSamples.css';

const VocalSampleItem = (props: {
  item: ICloneAudioItem;
  blockUpdate: boolean;
  setUpdating: (bool: boolean) => void;
  userPrivateData: IUserPrivateProps;
  setUserPrivateData: (userPrivateData: IUserPrivateProps) => void;
}) => {
  const {
    item,
    blockUpdate,
    userPrivateData,
    setUserPrivateData,
    setUpdating,
  } = props;

  const { userId } = useAuth();

  const cloneAudioFiles: ICloneAudioItem[] = useMemo(
    () => userPrivateData?.cloneAudio?.data || [],
    [userPrivateData?.cloneAudio?.data],
  );

  const removeItem = async () => {
    if (blockUpdate) {
      return;
    }

    if (isFunction(setUserPrivateData) && !isEmpty(userPrivateData)) {
      setUpdating(true);
    }

    const name = item?.name;
    const fileUrl = item?.url;
    const filterAudioFiles = filter(
      cloneAudioFiles,
      (fileInfo: ICloneAudioItem) => {
        return fileInfo?.name !== name && fileInfo?.url !== fileUrl;
      },
    );
    const updatedUserPrivateData = {
      ...userPrivateData,
    };

    if (updatedUserPrivateData?.cloneAudio) {
      updatedUserPrivateData.cloneAudio = {
        ...updatedUserPrivateData.cloneAudio,
        data: [...filterAudioFiles],
      };

      setUserPrivateData({
        ...updatedUserPrivateData,
      } as IUserPrivateProps);

      updateUserPrivateDataProps(
        userId,
        pick(updatedUserPrivateData, ['cloneAudio']),
      )
        .catch(console.log)
        .finally(() => setUpdating(false));
    } else {
      setUpdating(false);
    }
  };

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
          isDisabled={blockUpdate}
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
  blockUpdate: boolean;
  setUpdating: (b: boolean) => void;
  setUserPrivateData: (userPrivateData: IUserPrivateProps) => void;
}) => {
  const { userPrivateData, blockUpdate, setUserPrivateData, setUpdating } =
    props;

  const cloneAudioFiles: ICloneAudioItem[] = useMemo(
    () => userPrivateData?.cloneAudio?.data || [],
    [userPrivateData?.cloneAudio?.data],
  );

  const maxAudioFilesReached = useMemo(
    () => size(cloneAudioFiles) >= maxVocalSampleAudioFiles,
    [cloneAudioFiles],
  );

  return (
    <>
      <div className="vocal-samples">
        {!isEmpty(cloneAudioFiles) && (
          <ul className="vocal-samples-list">
            {map(cloneAudioFiles, (audioFile, index) => {
              const key = `${audioFile.name}${index}`;

              return (
                <VocalSampleItem
                  userPrivateData={userPrivateData}
                  blockUpdate={blockUpdate}
                  setUpdating={setUpdating}
                  setUserPrivateData={setUserPrivateData}
                  item={audioFile}
                  key={key}
                />
              );
            })}
          </ul>
        )}
      </div>

      {maxAudioFilesReached && (
        <div className="vocal-samples-max">
          <p>Audio files are limited to only 5 files.</p>
        </div>
      )}
    </>
  );
};

export default VocalSamples;
