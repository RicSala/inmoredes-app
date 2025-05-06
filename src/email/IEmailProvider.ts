export interface IEmailProvider {
  sendEmail(email: Email): Promise<string | undefined>;
}

export interface Email {
  from: string;
  to: string;
  bcc?: string | string[] | null;
  subject: string;
  content: string;
  type?: 'HTML' | 'TEXT';
}
