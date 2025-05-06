import { NextResponse } from 'next/server';
import { createLogger } from '@/logging/Logger';
import { contactService } from '@/contacts/contactService';

export async function POST(_request: Request) {
  // Verify the request is from QStash
  // (implement verification based on QStash documentation)

  try {
    await checkBirthdays();

    // await checkOneMonthAfterProject(today);

    // await checkPurchaseAnniversaries(today);

    // await checkQuarterlyMessages(today);

    // await checkHolidayMessages(today);

    // await checkWeeklyNewsletters(today);

    // await checkBiweeklyBulletins(today);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error in daily message check:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(_request: Request) {
  return NextResponse.json({ success: true });
}

const logger = createLogger('message-check');

const checkBirthdays = async () => {
  const contacts = await contactService.getContactsWithBirthdayToday();

  contacts.forEach((contact) => {
    logger.info(
      `Queuing birthday message for ${contact.name} ${contact.surname}`
    );
  });
};

// export const checkOneMonthAfterProject = async (today: Date) => {
//   const contacts = await db.contact.findMany({
//     where: {
//       purchaseDate: {
//         gte: new Date(today.getFullYear(), today.getMonth(), 1),
//         lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
//       },
//     },
//   });
// };

// export const checkPurchaseAnniversaries = async (today: Date) => {
//   // one year after purchase
//   const contacts = await db.contact.findMany({
//     where: {
//       purchaseDate: {
//         gte: new Date(
//           today.getFullYear() - 1,
//           today.getMonth(),
//           today.getDate()
//         ),
//         lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
//       },
//     },
//   });
// };
