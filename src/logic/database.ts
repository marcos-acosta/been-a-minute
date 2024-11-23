import { triplit } from "../../triplit/client";
import {
  Friend,
  FriendToSubmit,
  HangBasic,
  HangToSubmit,
  TagBasic,
} from "../../triplit/schema";

export const addFriend = async (friend: FriendToSubmit) => {
  const inserted = await triplit.insert("friends", friend);
  return inserted;
};

export const updateFriend = async (
  friendId: string,
  newFriend: Partial<Friend>
) => {
  return await triplit.update("friends", friendId, async (friend) => {
    Object.assign(friend, newFriend);
  });
};

export const removeFriend = async (friendId: string) => {
  return await triplit.delete("friends", friendId);
};

export const addHang = async (hang: HangToSubmit) => {
  await triplit.insert("friend_log", hang);
};

export const addHangNew = async (hang: HangBasic) => {
  await triplit.insert("friend_log", hang);
};

export const removeHang = async (hangId: string) => {
  return await triplit.delete("friend_log", hangId);
};

export const updateHang = async (
  hangId: string,
  newHang: Partial<HangBasic>
) => {
  return await triplit.update("friend_log", hangId, async (hang) => {
    Object.assign(hang, newHang);
  });
};

export const saveTag = async (tagText: string) => {
  return await triplit.insert("tags", {
    name: tagText,
  });
};

export const saveTagWithId = async (tag: TagBasic) => {
  return await triplit.insert("tags", tag);
};
