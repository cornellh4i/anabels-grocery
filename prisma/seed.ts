import { PrismaClient, Role, SwapStatus, AttendanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('seeding db! 🌱 ');

  // ─── Clean up existing data (order matters for foreign keys) ───
  await prisma.attendance.deleteMany();
  await prisma.swapFulfillment.deleteMany();
  await prisma.swapRequest.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.timeBlock.deleteMany();
  await prisma.user.deleteMany();

  // ─── Time Blocks ───────────────────────────────────────────────
  const [morning, midday, afternoon, evening] = await Promise.all([
    prisma.timeBlock.create({ data: { name: 'Morning',   startTime: '09:00', endTime: '11:00' } }),
    prisma.timeBlock.create({ data: { name: 'Midday',    startTime: '11:00', endTime: '13:00' } }),
    prisma.timeBlock.create({ data: { name: 'Afternoon', startTime: '13:00', endTime: '15:00' } }),
    prisma.timeBlock.create({ data: { name: 'Evening',   startTime: '15:00', endTime: '17:00' } }),
  ]);
  console.log('time blocks created');

  // ─── Users ─────────────────────────────────────────────────────
  // Note: firebaseUid would normally come from Firebase — using placeholder values for seeding
  const [admin1, admin2, v1, v2, v3, v4, v5, v6, v7, v8] = await Promise.all([
    prisma.user.create({ data: {
      firebaseUid: 'firebase-admin-001',
      name: 'brian sa',
      email: '1@cornell.edu',
      role: Role.ADMIN,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-admin-002',
      name: 'jade lee',
      email: '2@cornell.edu',
      role: Role.ADMIN,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-001',
      name: 'afran ahmed',
      email: '3@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-002',
      name: 'selena chen',
      email: '4@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-003',
      name: 'avery yang',
      email: '5@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-004',
      name: 'ben han',
      email: '6@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-005',
      name: 'nalini a',
      email: '7@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-006',
      name: 'nathan d',
      email: '8@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-007',
      name: 'alanna',
      email: '9@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
    prisma.user.create({ data: {
      firebaseUid: 'firebase-vol-008',
      name: 'zoey',
      email: '10@cornell.edu',
      role: Role.VOLUNTEER,
    }}),
  ]);
  console.log('users created');

  // ─── Shifts (this week Mon–Fri) ────────────────────────────────
  // Get Monday of the current week
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  function weekday(offset: number) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d;
  }

  const [monMorning, monAfternoon, tueMidday, tueEvening,
         wedMorning, wedMidday, thuAfternoon, thuEvening,
         friMorning, friMidday] = await Promise.all([
    // Monday
    prisma.shift.create({ data: { date: weekday(0), timeBlockId: morning.id,   userId: v1.id, } }),
    prisma.shift.create({ data: { date: weekday(0), timeBlockId: afternoon.id, userId: v5.id } }),
    // Tuesday
    prisma.shift.create({ data: { date: weekday(1), timeBlockId: midday.id,    userId: v3.id } }),
    prisma.shift.create({ data: { date: weekday(1), timeBlockId: evening.id,   userId: v7.id } }),
    // Wednesday
    prisma.shift.create({ data: { date: weekday(2), timeBlockId: morning.id,   userId: v5.id } }),
    prisma.shift.create({ data: { date: weekday(2), timeBlockId: midday.id,    userId: v7.id } }),
    // Thursday
    prisma.shift.create({ data: { date: weekday(3), timeBlockId: afternoon.id, userId: v1.id } }),
    prisma.shift.create({ data: { date: weekday(3), timeBlockId: evening.id,   userId: v4.id } }),
    // Friday
    prisma.shift.create({ data: { date: weekday(4), timeBlockId: morning.id,   userId: v6.id } }),
    prisma.shift.create({ data: { date: weekday(4), timeBlockId: midday.id,    userId: v8.id } }),
  ]);
  console.log('shifts created');

  // ─── Swap Requests ─────────────────────────────────────────────
  const [swap1, swap2, swap3] = await Promise.all([
    // v1 wants to give away their Monday morning shift (open)
    prisma.swapRequest.create({ data: {
      requesterId: v1.id,
      shiftId: monMorning.id,
      timeBlockId: morning.id,
      status: SwapStatus.OPEN,
      reason: 'exam conflict',
    }}),
    // v3 wants to give away Tuesday midday (partially filled)
    prisma.swapRequest.create({ data: {
      requesterId: v3.id,
      shiftId: tueMidday.id,
      timeBlockId: midday.id,
      status: SwapStatus.PARTIALLY_FILLED,
      reason: 'appointment',
    }}),
    // v5 already got their swap filled
    prisma.swapRequest.create({ data: {
      requesterId: v5.id,
      shiftId: wedMorning.id,
      timeBlockId: morning.id,
      status: SwapStatus.FILLED,
      reason: 'visiting',
    }}),
  ]);
  console.log('swap requests created');

  // ─── Swap Fulfillments ─────────────────────────────────────────
  await Promise.all([
    // v6 is covering v3's Tuesday midday swap (pending admin approval)
    prisma.swapFulfillment.create({ data: {
      swapRequestId: swap2.id,
      volunteerId: v6.id,
      timeBlockId: midday.id,
    }}),
    // v2 covered v5's Wednesday morning swap (approved by admin)
    prisma.swapFulfillment.create({ data: {
      swapRequestId: swap3.id,
      volunteerId: v2.id,
      timeBlockId: morning.id,
      approvedBy: admin1.id,
      approvedAt: new Date(),
    }}),
  ]);
  console.log('swap fulfillments created');

  // ─── Attendance ────────────────────────────────────────────────
  await Promise.all([
    prisma.attendance.create({ data: { userId: v1.id, shiftId: monMorning.id,   status: AttendanceStatus.PRESENT, markedBy: admin1.id } }),
    prisma.attendance.create({ data: { userId: v5.id, shiftId: monAfternoon.id, status: AttendanceStatus.PRESENT, markedBy: admin1.id } }),
    prisma.attendance.create({ data: { userId: v3.id, shiftId: tueMidday.id,    status: AttendanceStatus.ABSENT,  markedBy: admin2.id, notes: 'No show, no notice' } }),
    prisma.attendance.create({ data: { userId: v7.id, shiftId: tueEvening.id,   status: AttendanceStatus.EXCUSED, markedBy: admin2.id, notes: 'Medical excuse submitted' } }),
  ]);
  console.log('attendance records created');

  // suppress unused-var warnings for users not referenced above
  void v2; void v4; void v8; void swap1;
  void monAfternoon; void wedMidday; void thuAfternoon; void thuEvening; void friMorning; void friMidday;

  console.log('\nSeed complete!');
  console.log(`   2 admins, 8 volunteers`);
  console.log(`   4 time blocks, 10 shifts this week`);
  console.log(`   3 swap requests (1 open, 1 partial, 1 filled)`);
  console.log(`   2 swap fulfillments`);
  console.log(`   4 attendance records`);
}

main()
  .catch((e) => {
    console.error('seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
