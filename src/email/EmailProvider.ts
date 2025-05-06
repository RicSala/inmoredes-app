import { createLogger } from '@/logging/Logger';
import { Email, IEmailProvider } from './IEmailProvider';
import { CreateEmailOptions, Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const logger = createLogger('EmailProvider');

export class EmailServiceProvider implements IEmailProvider {
  async sendEmail(email: Email) {
    const { from, to, bcc, subject, content, type } = email;

    if (!to) {
      throw new Error('to is required');
    }
    if (!subject) {
      throw new Error('subject is required');
    }
    if (!content) {
      throw new Error('content is required');
    }
    if (!type) {
      throw new Error('type is required');
    }

    const payload: Partial<CreateEmailOptions> = {
      from,
      to,
      subject,
    };

    if (bcc) {
      payload.bcc = bcc;
    }
    if (type === 'HTML') {
      payload.html = content;
    } else {
      payload.text = content;
    }

    logger.info('💌 Sending email', payload);
    try {
      const info = await resend.emails.send(payload as CreateEmailOptions);
      logger.info('💌 Email sent:', { info });
      return info.data?.id;
    } catch (error) {
      logger.error('💌 Email failed:', { error });
      throw error;
    }
  }
}
