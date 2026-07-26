import type { Shift } from "@/hooks/useAllShifts";
import type { SwapRequestWithDetails } from "@/hooks/useSwapRequests";

// Mon Jul 13 2026 - Sun Jul 19 2026
export const TEST_WEEK_START = new Date(2026, 6, 13);

export const FIXTURE_USERS = {
  alice: { id: "user-alice", name: "Alice Chen", email: "alice@example.com" },
  bob: { id: "user-bob", name: "Bob Diaz", email: "bob@example.com" },
  carol: { id: "user-carol", name: "Carol Nguyen", email: "carol@example.com" },
  dave: { id: "user-dave", name: "Dave Kim", email: "dave@example.com" },
  erin: { id: "user-erin", name: "Erin Patel", email: "erin@example.com" },
};

function assignment(user: (typeof FIXTURE_USERS)[keyof typeof FIXTURE_USERS]) {
  return { id: `assignment-${user.id}`, userId: user.id, user };
}

export const FIXTURE_SHIFTS: Shift[] = [
  // Monday — fully staffed, 2/2
  {
    id: "shift-mon-full",
    date: new Date(2026, 6, 13),
    committee: "Produce",
    capacity: 2,
    timeBlock: { id: "tb-morning", name: "Morning", startTime: "08:00", endTime: "12:00" },
    assignments: [assignment(FIXTURE_USERS.alice), assignment(FIXTURE_USERS.bob)],
  },
  // Monday — understaffed, 1/4
  {
    id: "shift-mon-understaffed",
    date: new Date(2026, 6, 13),
    committee: "Bakery",
    capacity: 4,
    timeBlock: { id: "tb-afternoon", name: "Afternoon", startTime: "12:00", endTime: "16:00" },
    assignments: [assignment(FIXTURE_USERS.carol)],
  },
  // Tuesday — fully staffed, overflowing avatars (5 assignees, capacity 5)
  {
    id: "shift-tue-overflow",
    date: new Date(2026, 6, 14),
    committee: "Checkout",
    capacity: 5,
    timeBlock: { id: "tb-morning", name: "Morning", startTime: "08:00", endTime: "12:00" },
    assignments: [
      assignment(FIXTURE_USERS.alice),
      assignment(FIXTURE_USERS.bob),
      assignment(FIXTURE_USERS.carol),
      assignment(FIXTURE_USERS.dave),
      assignment(FIXTURE_USERS.erin),
    ],
  },
  // Wednesday — understaffed, 0/3
  {
    id: "shift-wed-empty",
    date: new Date(2026, 6, 15),
    committee: "Warehouse",
    capacity: 3,
    timeBlock: { id: "tb-evening", name: "Evening", startTime: "16:00", endTime: "20:00" },
    assignments: [],
  },
  // Next Monday — outside the fixture week, used to test week filtering
  {
    id: "shift-next-mon",
    date: new Date(2026, 6, 20),
    committee: "Produce",
    capacity: 2,
    timeBlock: { id: "tb-morning", name: "Morning", startTime: "08:00", endTime: "12:00" },
    assignments: [],
  },
];

export const FIXTURE_SWAP_REQUESTS: SwapRequestWithDetails[] = [
  {
    id: "swap-open-1",
    status: "OPEN",
    reason: "Doctor's appointment",
    createdAt: "2026-07-10T12:00:00.000Z",
    shiftAssignment: {
      id: "assignment-user-alice",
      userId: FIXTURE_USERS.alice.id,
      user: FIXTURE_USERS.alice,
      shift: {
        id: "shift-mon-full",
        date: "2026-07-13",
        committee: "Produce",
        capacity: 2,
        timeBlock: { id: "tb-morning", name: "Morning", startTime: "08:00", endTime: "12:00" },
      },
    },
    fulfillments: [],
  },
  {
    id: "swap-filled-1",
    status: "FILLED",
    reason: "Out of town",
    createdAt: "2026-07-09T12:00:00.000Z",
    shiftAssignment: {
      id: "assignment-user-carol",
      userId: FIXTURE_USERS.carol.id,
      user: FIXTURE_USERS.carol,
      shift: {
        id: "shift-mon-understaffed",
        date: "2026-07-13",
        committee: "Bakery",
        capacity: 4,
        timeBlock: { id: "tb-afternoon", name: "Afternoon", startTime: "12:00", endTime: "16:00" },
      },
    },
    fulfillments: [
      { id: "fulfillment-1", volunteerId: FIXTURE_USERS.dave.id, createdAt: "2026-07-09T13:00:00.000Z" },
    ],
  },
  {
    id: "swap-cancelled-1",
    status: "CANCELLED",
    reason: null,
    createdAt: "2026-07-08T12:00:00.000Z",
    shiftAssignment: {
      id: "assignment-user-erin",
      userId: FIXTURE_USERS.erin.id,
      user: FIXTURE_USERS.erin,
      shift: {
        id: "shift-tue-overflow",
        date: "2026-07-14",
        committee: "Checkout",
        capacity: 5,
        timeBlock: { id: "tb-morning", name: "Morning", startTime: "08:00", endTime: "12:00" },
      },
    },
    fulfillments: [],
  },
];
