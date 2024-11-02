import { TimeUnit } from "../../triplit/schema";
import {
  differenceInCalendarDays,
  differenceInHours,
  formatDistanceToNow,
} from "date-fns";

const NUMBER_WORDS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

export function formatHangFrequency({
  amount,
  unit,
}: {
  amount: number;
  unit: TimeUnit;
}) {
  const unit_string = amount == 1 ? unit : `${unit}s`;
  return amount > 10
    ? `${amount} ${unit_string}`
    : `${NUMBER_WORDS[amount - 1]} ${unit_string}`;
}

export function formatTimeSinceLastHang(lastHang: Date) {
  const diffInDays = differenceInCalendarDays(Date.now(), lastHang);
  const diffInHours = differenceInHours(Date.now(), lastHang);
  if (diffInDays < 1) {
    return "today";
  } else if (diffInHours < 24) {
    // This is to avoid the situation where the assigned date is late yesterday and we query
    // in the morning today, formatDistanceToNow would format in hours.
    return "yesterday";
  } else {
    return `${formatDistanceToNow(lastHang)} ago`;
  }
}
