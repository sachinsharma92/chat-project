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
    <div className="gift-card bg-black p-4 w-full mt-4 absolute bottom-0 rounded-t-[10px]">
      <div className="flex justify-between">
        <h4 className="text-xs uppercase text-white">Gift</h4>
        <Button className="text-xs text-white p-0" onClick={closeHandler}>
          Close
        </Button>
      </div>

      <form action="" className="flex flex-col gap-1 mt-4">
        {inputText.map((items, index) => (
          <Button
            key={index}
            onClick={() => setSelectedGift(index)}
            className={`text-sm uppercase ${index === selectedGift ? 'btn-active' : 'btn-gift'
              }`}
          >
            {items.btnText}
          </Button>
        ))}
        <Button className="text-[22px] bg-white rounded-full font-bold h-[36px] mt-[74px] text-black">
          Pay
        </Button>
        <div className="flex justify-center items-center mt-3">
          <p className="text-white text-xs uppercase">
            proceeds go to bot | satisfaction guaranteed
          </p>
        </div>
      </form>
    </div>
  );
};

export default GiftCard;
