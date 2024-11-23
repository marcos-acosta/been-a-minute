import { FriendBasic, HangBasic } from "../../triplit/schema";
import { getFullName } from "../logic/logic";
import { joinNodes } from "../logic/util";
import styles from "./Hang.module.css";

interface HangProps {
  hang: HangBasic;
  friends: FriendBasic[];
  selectFriendFn: (id: string) => void;
  selectedFriendId: string;
}

export default function Hang(props: HangProps) {
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
    <div className={styles.hangContainer}>
      <div className={styles.hangDate}>
        {props.hang.date_contacted.toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
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
