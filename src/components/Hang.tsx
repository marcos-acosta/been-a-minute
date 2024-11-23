import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { FriendBasic, HangBasic } from "../../triplit/schema";
import { getFullName } from "../logic/logic";
import { joinNodes } from "../logic/util";
import styles from "./Hang.module.css";
import friendCardStyles from "./FriendCard.module.css";
import { removeHang } from "../logic/database";
import { useState } from "react";

interface HangProps {
  hang: HangBasic;
  friends: FriendBasic[];
  selectFriendFn: (id: string) => void;
  selectedFriendId: string;
  startEditingHang: () => void;
}

export default function Hang(props: HangProps) {
  const [isFocused, setIsFocused] = useState(false);

  const friendsFromHang = [...props.hang.friend_ids]
    .map((friendId) =>
      props.friends.find(
        (friend) =>
          friend.id === friendId && friend.id !== props.selectedFriendId
      )
    )
    .filter(Boolean) as FriendBasic[];

  const friendNames = joinNodes(
    friendsFromHang.map((friend) => (
      <button
        className={styles.friendName}
        onClick={() => props.selectFriendFn(friend.id)}
      >
        {getFullName(friend)}
      </button>
    )),
    ", "
  );

  return (
    <div
      className={styles.hangContainer}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <div className={styles.hangDateContainer}>
        <div className={styles.hangDate}>
          {props.hang.date_contacted.toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        {isFocused && (
          <div className={styles.actionButtonContainer}>
            {joinNodes(
              [
                <button
                  className={friendCardStyles.actionButton}
                  onClick={props.startEditingHang}
                >
                  <Pencil1Icon />
                </button>,
                <button
                  className={friendCardStyles.actionButton}
                  onClick={() => removeHang(props.hang.id)}
                >
                  <TrashIcon />
                </button>,
              ],
              <div className={styles.space}></div>
            )}
          </div>
        )}
      </div>
      {friendsFromHang.length > 0 && (
        <div className={styles.hangWith}>With {friendNames}</div>
      )}
      {props.hang.notes && (
        <>
          <div className={styles.hangNote}>{props.hang.notes}</div>
        </>
      )}
    </div>
  );
}
