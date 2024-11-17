import { Pencil1Icon, PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { Friend } from "../../triplit/schema";
import {
  formatHangFrequency,
  formatTimeSinceLastHang,
} from "../logic/rendering";
import styles from "./FriendCard.module.css";
import { getDaysOverdue, getLastHangDate } from "../logic/logic";
import { combineClasses, joinNodes } from "../logic/util";
import { useState } from "react";
import { removeFriend } from "../logic/database";

export default function FriendCard({
  friend,
  startEditingFn,
}: {
  friend: Friend;
  startEditingFn: () => void;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const lastHangDate = getLastHangDate(friend);
  const daysOverdue = getDaysOverdue(friend);

  const handleDelete = (id: string) => {
    removeFriend(id);
  };

  return (
    <div
      className={styles.friendCardContainer}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={combineClasses(styles.nameContainer, "notoSerifBasic")}>
        <div className={styles.personIconContainer}>
          <PersonIcon />
        </div>
        <div className={styles.firstName}>{friend.first_name}</div>
        {friend.last_name && (
          <div className={styles.lastName}>{friend.last_name}</div>
        )}
        {isHovering && (
          <div className={styles.actionButtonsContainer}>
            {joinNodes(
              [
                <button className={styles.actionButton}>
                  <Pencil1Icon onClick={startEditingFn} />
                </button>,
                <button className={styles.actionButton}>
                  <TrashIcon onClick={() => handleDelete(friend.id)} />
                </button>,
              ],
              <div className={styles.space}></div>
            )}
          </div>
        )}
      </div>
      <div className={styles.lastMeeting}>
        {!lastHangDate ? (
          "never hung out"
        ) : (
          <>
            last hang was {formatTimeSinceLastHang(lastHangDate)}
            {daysOverdue &&
              daysOverdue > 0 &&
              friend.max_time_between_contact && (
                <>
                  &nbsp; &#40;over&nbsp;
                  {formatHangFrequency(friend.max_time_between_contact)}{" "}
                  ago&#41;
                </>
              )}
          </>
        )}
      </div>
    </div>
  );
}
