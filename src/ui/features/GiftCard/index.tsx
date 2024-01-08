import { FC, useState } from 'react';
import Button from '@/components/common/Button';

import './GiftCardStyle.css';

interface GiftCardProps {
  closeHandler?: () => void;
}

const GiftCard: FC<GiftCardProps> = ({ closeHandler }) => {
  const [selectedGift, setSelectedGift] = useState(0);
  const inputText = [
    {
      btnText: 'candy — $1',
    },
    {
      btnText: 'rose — $3',
    },
    {
      btnText: 'coffee — $5',
    },
    {
      btnText: 'drink — $10',
    },
    {
      btnText: 'teddy bear — $25',
    },
    {
      btnText: 'dinner — $50',
    },
    {
      btnText: 'bag — $100',
    },
    {
      btnText: 'ring — $200',
    },
    {
      btnText: 'custom video — $250',
    },
  ];
  return (
    <div className="gift-card bg-white dark:bg-black p-4 w-full mt-4 bottom-0 rounded-t-[10px] z-10">
      <div className="flex justify-between">
        <h4 className="text-xs uppercase text-black dark:text-white">Gift</h4>
        <Button className="text-xs text-black dark:text-white p-0" onClick={closeHandler}>
          Close
        </Button>
      </div>

      <form action="" className="flex flex-col gap-1 mt-4">
        {inputText.map((items, index) => (
          <Button
            key={index}
            onClick={() => setSelectedGift(index)}
            className={`text-sm uppercase justify-start ${index === selectedGift ? 'btn-active' : 'btn-gift'
              }`}
          >
            {items.btnText}
          </Button>
        ))}
        <Button className="text-[22px] bg-black dark:bg-white rounded-full font-bold h-[36px] mt-[12px] text-white dark:text-black">
          Pay
        </Button>
        <div className="flex justify-center items-center mt-3">
          <p className="text-black dark:text-white text-xs uppercase">
            Satisfaction guaranteed.
          </p>
        </div>
      </form>
    </div>
  );
};

export default GiftCard;
