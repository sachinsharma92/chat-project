import Button from '@/components/common/Button';

import './SpaceDescription.css';

const GiftCard = () => {

  return (
    <div className='gift-card bg-black p-4 w-full mt-4'>
      <div className='flex justify-between'>
        <h4 className="text-xs uppercase text-white">Gift</h4>
        <Button className="text-xs text-white p-0">
          Close
        </Button>
      </div>

      <form action="" className="flex flex-col gap-1 mt-4">
        <Button className="text-input text-sm uppercase">
          candy — $1
        </Button>
        <Button className="text-input text-sm uppercase">
          rose — $3
        </Button>
        <Button className="text-input text-sm uppercase">
          coffee — $5
        </Button>
        <Button className="text-input text-sm uppercase">
          drink — $10
        </Button>
        <Button className="text-input text-sm uppercase">
          teddy bear — $25
        </Button>
        <Button className="text-input text-sm uppercase">
          dinner — $50
        </Button>
        <Button className="text-input text-sm uppercase">
          bag — $100
        </Button>
        <Button className="text-input text-sm uppercase">
          ring — $200
        </Button>
        <Button className="text-input text-sm uppercase">
          custom video — $250
        </Button>
        <Button className="text-[22px] bg-white rounded-full font-bold h-[36px] mt-3">
          Pay
        </Button>
        <div className='flex justify-center items-center'>
          <p className="text-white text-xs">proceeds go to bot | satisfaction guaranteed</p>
        </div>
      </form>
    </div>
  );
};

export default GiftCard;
