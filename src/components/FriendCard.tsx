import { PersonIcon } from "@radix-ui/react-icons";
import { Friend } from "../../triplit/schema";
import {
  formatHangFrequency,
  formatTimeSinceLastHang,
} from "../logic/rendering";
import styles from "./FriendCard.module.css";
import { getDaysOverdue, getLastHangDate } from "../logic/logic";
import { combineClasses } from "../logic/util";

export default function FriendCard({ friend }: { friend: Friend }) {
  const lastHangDate = getLastHangDate(friend);
  const daysOverdue = getDaysOverdue(friend);
  return (
    <div className={styles.friendCardContainer}>
      <div className={combineClasses(styles.nameContainer, "notoSerifBasic")}>
        <div className={styles.personIconContainer}>
          <PersonIcon />
        </div>
        <div className={styles.firstName}>{friend.first_name}</div>
        {friend.last_name && (
          <div className={styles.lastName}>{friend.last_name}</div>
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
