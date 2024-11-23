import { Pencil1Icon, PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { Friend } from "../../triplit/schema";
import {
  formatHangFrequency,
  formatTimeSinceLastHang,
} from "../logic/rendering";
import styles from "./FriendCard.module.css";
import { getDaysOverdue, getLastHangDate } from "../logic/logic";
import { joinNodes } from "../logic/util";
import { useState } from "react";
import { removeFriend } from "../logic/database";
import Tag from "./Tag";

export default function FriendCard({
  friend,
  startEditingFn,
  selectFriendFn,
}: {
  friend: Friend;
  startEditingFn: () => void;
  selectFriendFn: () => void;
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
      <div className={styles.nameContainer}>
        <div className={styles.personIconContainer}>
          <PersonIcon />
        </div>
        <button className={styles.fullNameContainer} onClick={selectFriendFn}>
          <div className={styles.firstName}>{friend.first_name}</div>
          {friend.last_name && (
            <>
              {" "}
              <div className={styles.lastName}>{friend.last_name}</div>
            </>
          )}
        </button>
        {isHovering && (
          <div className={styles.actionButtonsContainer}>
            {joinNodes(
              [
                <button
                  className={styles.actionButton}
                  onClick={startEditingFn}
                >
                  <Pencil1Icon />
                </button>,
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(friend.id)}
                >
                  <TrashIcon />
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
      <div className={styles.tagContainer}>
        {joinNodes(
          friend.tags.map((tag) => <Tag tag={tag} />),
          <div className={styles.tagDelimiter} />
        )}
      </div>
    </div>
  );
}
