import { FriendBasic, HangBasic } from "../../triplit/schema";
import { getFullName } from "../logic/logic";
import { joinNodes } from "../logic/util";
import styles from "./Hang.module.css";

interface HangProps {
  hang: HangBasic;
  friends: FriendBasic[];
  selectFriendFn: (id: string) => void;
}

export default function Hang(props: HangProps) {
  const friendsFromHang = [...props.hang.friend_ids]
    .map((friendId) => props.friends.find((friend) => friend.id === friendId))
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
    " "
  );

  return (
    <div className={styles.hangContainer}>
      <div className={styles.hangDate}>
        {props.hang.date_contacted.toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
      <div className={styles.hangWith}>With {friendNames}</div>
      {props.hang.notes && (
        <>
          <hr className={styles.divider} />
          <div className={styles.hangNote}>{props.hang.notes}</div>
        </>
      )}
    </div>
  );
}
