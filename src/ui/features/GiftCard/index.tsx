import { FC } from 'react';
import Button from '@/components/common/Button';

import './SpaceDescription.css';

interface GiftCardProps {
  closeHandler?: () => void;
}

const GiftCard: FC<GiftCardProps> = ({ closeHandler }) => {
  const inputText = [
    'candy — $1',
    'rose — $3',
    'coffee — $5',
    'drink — $10',
    'teddy bear — $25',
    'dinner — $50',
    'bag — $100',
    'ring — $200',
    'custom video — $250',
  ];
  return (
    <div className="gift-card bg-black p-4 w-full mt-4">
      <div className="flex justify-between">
        <h4 className="text-xs uppercase text-white">Gift</h4>
        <Button className="text-xs text-white p-0" onClick={closeHandler}>
          Close
        </Button>
      </div>

      <form action="" className="flex flex-col gap-1 mt-4">
        {inputText.map((items, index) => (
          <Button key={index} className="text-input text-sm uppercase">
            {items}
          </Button>
        ))}
        <Button className="text-[22px] bg-white rounded-full font-bold h-[36px] mt-3">
          Pay
        </Button>
        <div className="flex justify-center items-center">
          <p className="text-white text-xs">
            proceeds go to bot | satisfaction guaranteed
          </p>
        </div>
      </form>
    </div>
  );
};

export default GiftCard;
