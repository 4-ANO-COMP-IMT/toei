import { Alert } from 'react-bootstrap';

interface AlertMessageProps {
    show: boolean;
    variant: string;
    title: string;
    message: string;
}

function alertMessage(props: AlertMessageProps) {
  return (
    <>
    <Alert className='mb-4' variant={props.variant} show={props.show}>
      <Alert.Heading>{props.title}</Alert.Heading>
      <p>{props.message}</p>
    </Alert>
    </>
  )
}

export default alertMessage