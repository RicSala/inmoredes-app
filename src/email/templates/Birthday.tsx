import { Body, Container, Head, Html, Preview } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import { z } from 'zod';

interface VercelInviteUserEmailProps {
  _url: string;
}

export const EmailSignin = ({ _url }: VercelInviteUserEmailProps) => {
  const previewText = `Entra en inmoredes`;

  return (
    <Html className=''>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='mx-auto my-auto bg-white px-2 font-sans'>
          <Container className='mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]'>
            FELICIDADES 🎉
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const EmailSignInPayloadSchema = z.any();
