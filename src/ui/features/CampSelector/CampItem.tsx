import Avatar from '@/ui/common/Avatar/Avatar';
import Button from '@/ui/common/Button';
import { ISpace } from '@/types';
import './CampItem.scss';

const CampItem = (props: { camp: ISpace }) => {
  const { camp } = props;

  return (
    <Button className="camp-item flex justify-center">
      <Avatar src={camp?.image} name={camp?.name} className={camp?.selected ? "selected-camp" : "camp"}/>
    </Button>
  );
};

export default CampItem;
