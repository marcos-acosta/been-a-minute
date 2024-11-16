import { differenceInCalendarDays } from "date-fns";
import { Friend, FriendBasic, HangBasic, TimeUnit } from "../../triplit/schema";

export const getFullName = (friend: FriendBasic) =>
  friend.first_name + (friend.last_name ? ` ${friend.last_name}` : "");

const UNIT_TO_DAYS = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};

function getDaysFromHangFrequency({
  amount,
  unit,
}: {
  amount: number;
  unit: TimeUnit;
}) {
  return UNIT_TO_DAYS[unit] * amount;
}

export const filterFriendsByQuery = (friends: Friend[], query: string) => {
  return friends.filter(
    (friend) =>
      getFullName(friend).toLowerCase().search(query.toLowerCase()) !== -1
  );
};

export const sortHangsByRecency = (hangs: HangBasic[]) =>
  hangs.sort(
    (hangA, hangB) =>
      hangB.date_contacted.valueOf() - hangA.date_contacted.valueOf()
  );

export const getLastHangDate = (friend: Friend) => {
  const sortedHangs = sortHangsByRecency(friend.meetings);
  if (sortedHangs.length === 0) {
    return undefined;
  }
  return sortedHangs[0].date_contacted;
};

const getDaysSinceLastHang = (friend: Friend) => {
  const lastHangDate = getLastHangDate(friend);
  if (lastHangDate === undefined) {
    return undefined;
  }
  return differenceInCalendarDays(Date.now(), lastHangDate);
};

export const getDaysOverdue = (friend: Friend) => {
  if (!friend.max_time_between_contact) {
    return undefined;
  }
  const daysSinceLastHang = getDaysSinceLastHang(friend);
  if (daysSinceLastHang === undefined) {
    return undefined;
  }
  const desiredMaxTimeBetweenHangs = getDaysFromHangFrequency(
    friend.max_time_between_contact
  );
  return daysSinceLastHang - desiredMaxTimeBetweenHangs;
};

const compareFriendsNames = (friendA: Friend, friendB: Friend) =>
  getFullName(friendA) > getFullName(friendB) ? 1 : -1;

const undefinedToInfinity = (n: number | undefined) =>
  n === undefined ? Infinity : n;

export const sortFriendsByOverdueThenName = (friends: Friend[]) =>
  friends.sort((friendA, friendB) => {
    const daysOverdueA = undefinedToInfinity(getDaysOverdue(friendA));
    const daysOverdueB = undefinedToInfinity(getDaysOverdue(friendB));
    const daysSinceLastHangA = undefinedToInfinity(
      getDaysSinceLastHang(friendA)
    );
    const daysSinceLastHangB = undefinedToInfinity(
      getDaysSinceLastHang(friendB)
    );
    const wantToKeepInTouchWithFriendA = Boolean(
      friendA.max_time_between_contact
    );
    const wantToKeepInTouchWithFriendB = Boolean(
      friendB.max_time_between_contact
    );
    let comparatorValue = 0;
    if (wantToKeepInTouchWithFriendA != wantToKeepInTouchWithFriendB) {
      return (
        +Boolean(wantToKeepInTouchWithFriendB) -
        +Boolean(wantToKeepInTouchWithFriendA)
      );
    } else if (wantToKeepInTouchWithFriendA && wantToKeepInTouchWithFriendB) {
      comparatorValue = daysOverdueB - daysOverdueA;
    } else {
      comparatorValue = daysSinceLastHangB - daysSinceLastHangA;
    }
    return comparatorValue || compareFriendsNames(friendA, friendB);
  });

export const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
  return hash;
};
