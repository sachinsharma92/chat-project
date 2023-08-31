import Avatar from '@/ui/common/Avatar/Avatar';
import Button from '@/ui/common/Button';
import { ICamp } from '@/types';
import './CampItem.scss';

const CampItem = (props: { camp: ICamp }) => {
  const { camp } = props;

  return (
    <Button className="camp-item flex justify-center">
      <Avatar src={camp?.image} name={camp?.name} className="selected-camp" />
    </Button>
  );
};

export default CampItem;
