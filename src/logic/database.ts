import { triplit } from "../../triplit/client";
import { TimeUnit } from "../../triplit/schema";

export const addFriend = async (
  firstName: string,
  isLocal: boolean,
  tagIds: string[],
  keepInTouch: boolean,
  lastName?: string,
  note?: string,
  timeBetweenContactAmount?: number,
  timeBetweenContactUnit?: TimeUnit
) => {
  const addHangFrequency =
    keepInTouch &&
    timeBetweenContactAmount !== undefined &&
    timeBetweenContactUnit;
  const inserted = await triplit.insert("friends", {
    first_name: firstName,
    last_name: lastName,
    relation: note,
    long_distance: !isLocal,
    max_time_between_contact: addHangFrequency
      ? {
          amount: timeBetweenContactAmount,
          unit: timeBetweenContactUnit,
        }
      : undefined,
    tag_ids: new Set(tagIds),
  });
  return inserted;
};

export const removeFriend = async (friendId: string) => {
  return await triplit.delete("friends", friendId);
};

export const addHang = async (
  friendIds: string[],
  date: Date,
  note?: string
) => {
  await triplit.insert("friend_log", {
    date_contacted: date,
    friend_ids: new Set(friendIds),
    notes: note,
  });
};

export const saveTag = async (tagText: string) => {
  return await triplit.insert("tags", {
    name: tagText,
  });
};
