import { PrismaClient, Role, SwapStatus, AttendanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean slate (order matters for foreign keys) ─────────────
  await prisma.attendance.deleteMany();
  await prisma.swapFulfillment.deleteMany();
  await prisma.swapRequest.deleteMany();
  await prisma.shiftAssignment.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.timeBlock.deleteMany();
  await prisma.user.deleteMany();

  // ─── Time Blocks (1 hour each) ────────────────────────────────
  const [tb9, tb10, tb11, tb12, tb13, tb14] = await Promise.all([
    prisma.timeBlock.create({ data: { name: '9am–10am',  startTime: '09:00', endTime: '10:00' } }),
    prisma.timeBlock.create({ data: { name: '10am–11am', startTime: '10:00', endTime: '11:00' } }),
    prisma.timeBlock.create({ data: { name: '11am–12pm', startTime: '11:00', endTime: '12:00' } }),
    prisma.timeBlock.create({ data: { name: '12pm–1pm',  startTime: '12:00', endTime: '13:00' } }),
    prisma.timeBlock.create({ data: { name: '1pm–2pm',   startTime: '13:00', endTime: '14:00' } }),
    prisma.timeBlock.create({ data: { name: '2pm–3pm',   startTime: '14:00', endTime: '15:00' } }),
  ]);
  console.log('✅ Time blocks created');

  // ─── Users ────────────────────────────────────────────────────
  const [admin1, admin2, v1, v2, v3, v4, v5, v6, v7, v8] = await Promise.all([
    prisma.user.create({ data: { firebaseUid: 'firebase-admin-001', name: 'Sarah Chen',      email: 'sc2345@cornell.edu', role: Role.ADMIN } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-admin-002', name: 'Marcus Johnson',  email: 'mj4567@cornell.edu', role: Role.ADMIN } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-001',   name: 'Aisha Patel',     email: 'ap1234@cornell.edu', role: Role.VOLUNTEER } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-002',   name: 'Jake Rivera',     email: 'jr5678@cornell.edu', role: Role.VOLUNTEER } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-003',   name: 'Emily Park',      email: 'ep9012@cornell.edu', role: Role.VOLUNTEER } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-004',   name: 'Liam Okafor',     email: 'lo3456@cornell.edu', role: Role.VOLUNTEER } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-005',   name: 'Priya Nair',      email: 'pn7890@cornell.edu', role: Role.VOLUNTEER } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-006',   name: 'Tyler Wu',        email: 'tw2468@cornell.edu', role: Role.VOLUNTEER } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-007',   name: 'Fatima Al-Hassan',email: 'fa1357@cornell.edu', role: Role.VOLUNTEER } }),
    prisma.user.create({ data: { firebaseUid: 'firebase-vol-008',   name: 'Noah Kim',        email: 'nk8024@cornell.edu', role: Role.VOLUNTEER } }),
  ]);
  console.log('✅ Users created');

  // ─── Shifts (this week Mon–Fri, multiple per day per committee) ─
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  function weekday(offset: number) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d;
  }

  const [
    monPurch9, monPurch10, monMktg9, monMktg10,
    tuePurch11, tuePurch12, tueCollab13,
    wedPeople9, wedMktg11, wedPurch14,
    thuCollab10, thuMktg13,
    friPurch9, friPeople12,
  ] = await Promise.all([
    // Monday
    prisma.shift.create({ data: { date: weekday(0), timeBlockId: tb9.id,  committee: 'purchasing',  capacity: 3 } }),
    prisma.shift.create({ data: { date: weekday(0), timeBlockId: tb10.id, committee: 'purchasing',  capacity: 2 } }),
    prisma.shift.create({ data: { date: weekday(0), timeBlockId: tb9.id,  committee: 'marketing',   capacity: 2 } }),
    prisma.shift.create({ data: { date: weekday(0), timeBlockId: tb10.id, committee: 'marketing',   capacity: 2 } }),
    // Tuesday
    prisma.shift.create({ data: { date: weekday(1), timeBlockId: tb11.id, committee: 'purchasing',  capacity: 3 } }),
    prisma.shift.create({ data: { date: weekday(1), timeBlockId: tb12.id, committee: 'purchasing',  capacity: 2 } }),
    prisma.shift.create({ data: { date: weekday(1), timeBlockId: tb13.id, committee: 'collab_edu',  capacity: 2 } }),
    // Wednesday
    prisma.shift.create({ data: { date: weekday(2), timeBlockId: tb9.id,  committee: 'people_ops',  capacity: 3 } }),
    prisma.shift.create({ data: { date: weekday(2), timeBlockId: tb11.id, committee: 'marketing',   capacity: 2 } }),
    prisma.shift.create({ data: { date: weekday(2), timeBlockId: tb14.id, committee: 'purchasing',  capacity: 2 } }),
    // Thursday
    prisma.shift.create({ data: { date: weekday(3), timeBlockId: tb10.id, committee: 'collab_edu',  capacity: 3 } }),
    prisma.shift.create({ data: { date: weekday(3), timeBlockId: tb13.id, committee: 'marketing',   capacity: 2 } }),
    // Friday
    prisma.shift.create({ data: { date: weekday(4), timeBlockId: tb9.id,  committee: 'purchasing',  capacity: 3 } }),
    prisma.shift.create({ data: { date: weekday(4), timeBlockId: tb12.id, committee: 'people_ops',  capacity: 2 } }),
  ]);
  console.log('✅ Shifts created');

  // ─── Shift Assignments ────────────────────────────────────────
  const [
    sa_aisha_monPurch9, sa_jake_monPurch9, sa_emily_monPurch9,
    sa_liam_monPurch10,
    sa_priya_monMktg9, sa_tyler_monMktg9,
    sa_fatima_monMktg10, sa_noah_monMktg10,
    sa_v1_tuePurch11, sa_v2_tuePurch11, sa_v3_tuePurch11,
    sa_v4_tuePurch12, sa_v5_tuePurch12,
    sa_v6_tueCollab13, sa_v7_tueCollab13,
    sa_v1_wedPeople9, sa_v2_wedPeople9,
    sa_v3_wedMktg11, sa_v4_wedMktg11,
    sa_v5_wedPurch14,
    sa_v6_thuCollab10, sa_v7_thuCollab10,
    sa_v8_thuMktg13,
    sa_v1_friPurch9, sa_v2_friPurch9,
    sa_v3_friPeople12,
  ] = await Promise.all([
    // Monday Purchasing 9am
    prisma.shiftAssignment.create({ data: { userId: v1.id, shiftId: monPurch9.id } }),
    prisma.shiftAssignment.create({ data: { userId: v2.id, shiftId: monPurch9.id } }),
    prisma.shiftAssignment.create({ data: { userId: v3.id, shiftId: monPurch9.id } }),
    // Monday Purchasing 10am
    prisma.shiftAssignment.create({ data: { userId: v4.id, shiftId: monPurch10.id } }),
    // Monday Marketing 9am
    prisma.shiftAssignment.create({ data: { userId: v5.id, shiftId: monMktg9.id } }),
    prisma.shiftAssignment.create({ data: { userId: v6.id, shiftId: monMktg9.id } }),
    // Monday Marketing 10am
    prisma.shiftAssignment.create({ data: { userId: v7.id, shiftId: monMktg10.id } }),
    prisma.shiftAssignment.create({ data: { userId: v8.id, shiftId: monMktg10.id } }),
    // Tuesday Purchasing 11am
    prisma.shiftAssignment.create({ data: { userId: v1.id, shiftId: tuePurch11.id } }),
    prisma.shiftAssignment.create({ data: { userId: v2.id, shiftId: tuePurch11.id } }),
    prisma.shiftAssignment.create({ data: { userId: v3.id, shiftId: tuePurch11.id } }),
    // Tuesday Purchasing 12pm
    prisma.shiftAssignment.create({ data: { userId: v4.id, shiftId: tuePurch12.id } }),
    prisma.shiftAssignment.create({ data: { userId: v5.id, shiftId: tuePurch12.id } }),
    // Tuesday Collab 1pm
    prisma.shiftAssignment.create({ data: { userId: v6.id, shiftId: tueCollab13.id } }),
    prisma.shiftAssignment.create({ data: { userId: v7.id, shiftId: tueCollab13.id } }),
    // Wednesday People Ops 9am
    prisma.shiftAssignment.create({ data: { userId: v1.id, shiftId: wedPeople9.id } }),
    prisma.shiftAssignment.create({ data: { userId: v2.id, shiftId: wedPeople9.id } }),
    // Wednesday Marketing 11am
    prisma.shiftAssignment.create({ data: { userId: v3.id, shiftId: wedMktg11.id } }),
    prisma.shiftAssignment.create({ data: { userId: v4.id, shiftId: wedMktg11.id } }),
    // Wednesday Purchasing 2pm
    prisma.shiftAssignment.create({ data: { userId: v5.id, shiftId: wedPurch14.id } }),
    // Thursday Collab 10am
    prisma.shiftAssignment.create({ data: { userId: v6.id, shiftId: thuCollab10.id } }),
    prisma.shiftAssignment.create({ data: { userId: v7.id, shiftId: thuCollab10.id } }),
    // Thursday Marketing 1pm
    prisma.shiftAssignment.create({ data: { userId: v8.id, shiftId: thuMktg13.id } }),
    // Friday Purchasing 9am
    prisma.shiftAssignment.create({ data: { userId: v1.id, shiftId: friPurch9.id } }),
    prisma.shiftAssignment.create({ data: { userId: v2.id, shiftId: friPurch9.id } }),
    // Friday People Ops 12pm
    prisma.shiftAssignment.create({ data: { userId: v3.id, shiftId: friPeople12.id } }),
  ]);
  console.log('✅ Shift assignments created');

  // ─── Swap Requests ────────────────────────────────────────────
  const [swap1, swap2, swap3] = await Promise.all([
    // Aisha wants to swap her Monday Purchasing 9am (OPEN)
    prisma.swapRequest.create({ data: {
      shiftAssignmentId: sa_aisha_monPurch9.id,
      status: SwapStatus.OPEN,
      reason: 'Have an exam conflict',
    }}),
    // Jake wants to swap his Monday Purchasing 9am (FILLED)
    prisma.swapRequest.create({ data: {
      shiftAssignmentId: sa_jake_monPurch9.id,
      status: SwapStatus.FILLED,
      reason: 'Family visiting',
    }}),
    // Priya wants to swap her Monday Marketing 9am (CANCELLED)
    prisma.swapRequest.create({ data: {
      shiftAssignmentId: sa_priya_monMktg9.id,
      status: SwapStatus.CANCELLED,
      reason: 'No longer needed',
    }}),
  ]);
  console.log('✅ Swap requests created');

  // ─── Swap Fulfillments ────────────────────────────────────────
  // v8 (Noah) covered Jake's filled swap
  await prisma.swapFulfillment.create({ data: {
    swapRequestId: swap2.id,
    volunteerId: v8.id,
  }});
  console.log('✅ Swap fulfillments created');

  // ─── Attendance ───────────────────────────────────────────────
  await Promise.all([
    prisma.attendance.create({ data: { userId: v1.id, shiftId: monPurch9.id,  status: AttendanceStatus.PRESENT, markedBy: admin1.id } }),
    prisma.attendance.create({ data: { userId: v2.id, shiftId: monPurch9.id,  status: AttendanceStatus.LATE,    markedBy: admin1.id, notes: 'Arrived 15 min late' } }),
    prisma.attendance.create({ data: { userId: v3.id, shiftId: monPurch9.id,  status: AttendanceStatus.PRESENT, markedBy: admin1.id } }),
    prisma.attendance.create({ data: { userId: v4.id, shiftId: monPurch10.id, status: AttendanceStatus.ABSENT,  markedBy: admin2.id, notes: 'No show' } }),
    prisma.attendance.create({ data: { userId: v5.id, shiftId: monMktg9.id,   status: AttendanceStatus.PRESENT, markedBy: admin2.id } }),
    prisma.attendance.create({ data: { userId: v6.id, shiftId: monMktg9.id,   status: AttendanceStatus.EXCUSED, markedBy: admin2.id, notes: 'Medical excuse submitted' } }),
  ]);
  console.log('✅ Attendance records created');

  console.log('\n🎉 Seed complete!');
  console.log(`   2 admins, 8 volunteers`);
  console.log(`   6 time blocks (all 1hr)`);
  console.log(`   14 shifts across Mon–Fri`);
  console.log(`   26 shift assignments`);
  console.log(`   3 swap requests (1 open, 1 filled, 1 cancelled)`);
  console.log(`   1 swap fulfillment`);
  console.log(`   6 attendance records`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
