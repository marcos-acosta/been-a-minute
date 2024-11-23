import { Friend, FriendBasic, HangBasic, TagBasic } from "../../triplit/schema";
import { addFriend, addHangNew, saveTagWithId } from "./database";

export const addAllFriends = (friends: FriendBasic[]) => {
  friends.forEach((friend) => addFriend(friend));
};

export const addAllHangs = (friends: Friend[]) => {
  let uniqueHangs = [] as HangBasic[];
  friends.forEach((friend) => {
    friend.meetings.forEach((hang) => {
      if (!uniqueHangs.find((h) => h.id === hang.id)) {
        uniqueHangs = [...uniqueHangs, hang];
      }
    });
  });
  console.log(uniqueHangs);
  uniqueHangs.forEach((hang) => addHangNew(hang));
};

export const addAllTags = (tags: TagBasic[]) => {
  tags.forEach((tag) => saveTagWithId(tag));
};
