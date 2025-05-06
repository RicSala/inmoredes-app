import { contactService } from '@/contacts/contactService';

export default async function Page() {
  const contacts = await contactService.getContactsWithBirthdayToday();

  return (
    <div>
      <h1>Birthday Today</h1>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} {contact.surname}
          </li>
        ))}
      </ul>
    </div>
  );
}
