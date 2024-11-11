import { differenceInCalendarDays } from "date-fns";
import { Friend, HangBasic, TimeUnit } from "../../triplit/schema";

export const getFullName = (friend: Friend) =>
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
      hangB.date_contacted.valueOf() - hangA.date_contacted.valueOf()
  );

export const getLastHangDate = (friend: Friend) => {
  const sortedHangs = sortHangsByRecency(friend.meetings);
  console.log(friend.first_name, sortedHangs);
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
  getFullName(friendA) > getFullName(friendB) ? 1 : -1;

export const sortFriendsByOverdueThenName = (friends: Friend[]) =>
  friends.sort((friendA, friendB) => {
    const daysOverdueA = getDaysOverdue(friendA) || Infinity;
    const daysOverdueB = getDaysOverdue(friendB) || Infinity;
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
    }
    return comparatorValue || compareFriendsNames(friendA, friendB);
  });

const setDateToMidday = (date: Date) => {
  let newDate = new Date(date);
  newDate.setHours(12);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const convertLocalDateStringToDate = (dateString: string) => {
  let date = setDateToMidday(new Date());
  const [year, month, day] = dateString.split("-");
  date.setFullYear(parseInt(year));
  date.setMonth(parseInt(month) - 1);
  date.setDate(parseInt(day));
  return date;
};
