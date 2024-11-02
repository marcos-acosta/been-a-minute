import { differenceInCalendarDays } from "date-fns";
import { Friend, HangBasic, TimeUnit } from "../../triplit/schema";

const getFullName = (friend: Friend) =>
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

export const combineClasses = (...classNames: (string | undefined | null)[]) =>
  classNames.filter(Boolean).join(" ");

export const filterFriendsByQuery = (friends: Friend[], query: string) => {
  return friends.filter(
    (friend) =>
      getFullName(friend).toLowerCase().search(query.toLowerCase()) !== -1
  );
};

export const sortHangsByRecency = (hangs: HangBasic[]) =>
  hangs.sort(
    (hangA, hangB) =>
      hangB.date_contacted.getUTCMilliseconds() -
      hangA.date_contacted.getUTCMilliseconds()
  );

export const getLastHangDate = (friend: Friend) => {
  const sortedHangs = sortHangsByRecency(friend.meetings);
  if (sortedHangs.length === 0) {
    return undefined;
  }
  return sortedHangs[0].date_contacted;
};

export const getDaysOverdue = (friend: Friend) => {
  if (!friend.max_time_between_contact) {
    return undefined;
  }
  const lastHangDate = getLastHangDate(friend);
  if (!lastHangDate) {
    return undefined;
  }
  const desiredMaxTimeBetweenHangs = getDaysFromHangFrequency(
    friend.max_time_between_contact
  );
  const actualDaysSinceLastHang = differenceInCalendarDays(
    Date.now(),
    lastHangDate
  );
  return actualDaysSinceLastHang - desiredMaxTimeBetweenHangs;
};

const compareFriendsNames = (friendA: Friend, friendB: Friend) =>
  getFullName(friendA) > getFullName(friendB) ? -1 : 1;

export const sortFriendsByOverdueThenName = (friends: Friend[]) =>
  friends.sort((friendA, friendB) => {
    const daysOverdueA = getDaysOverdue(friendA);
    const daysOverdueB = getDaysOverdue(friendB);
    if (daysOverdueA == daysOverdueB) {
      return compareFriendsNames(friendA, friendB);
    } else if (daysOverdueA === undefined) {
      return 1;
    } else if (daysOverdueB === undefined) {
      return -1;
    } else {
      return daysOverdueB - daysOverdueA;
    }
  });
