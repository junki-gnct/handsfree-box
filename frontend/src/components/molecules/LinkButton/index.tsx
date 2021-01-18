import { LinkButtonProps } from './interface';
import Link from 'next/link';
import { Button } from '@material-ui/core';

const LinkButton: React.FunctionComponent<LinkButtonProps> = (props) => {
  return (
    <Link href={props.href}>
      <Button
        variant={props.variant}
        color={props.color}
        type={props.type}
        disabled={props.disabled}
      >
        {props.children}
      </Button>
    </Link>
  );
};

export default LinkButton;
