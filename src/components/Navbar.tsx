import Link from 'next/link';

export function Navbar() {
  return (
    <nav className='flex items-center justify-end gap-4'>
      {NAVBAR_ITEMS.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

const NAVBAR_ITEMS = [
  {
    label: 'Dashboard',
    href: '/app',
  },
  {
    label: 'Contacts',
    href: '/app/contacts',
  },
  {
    label: 'Messages',
    href: '/app/messages',
  },
  {
    label: '[TEMP] Birthday',
    href: '/app/contacts/birthday-today',
  },
];
