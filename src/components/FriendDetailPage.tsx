import { Friend, FriendBasic } from "../../triplit/schema";
import { getFullName } from "../logic/logic";
import styles from "./FriendDetailPage.module.css";
import formStyles from "./FormStyling.module.css";
import Hang from "./Hang";
import Tag from "./Tag";
import { joinNodes } from "../logic/util";

interface FriendDetailPageProps {
  friend: Friend;
  friends: FriendBasic[];
  onGoBack: () => void;
  selectFriendFn: (id: string) => void;
}

export default function FriendDetailPage(props: FriendDetailPageProps) {
  return (
    <div className={styles.friendDetailPageContainer}>
      <div className={styles.backButtonContainer}>
        <button className={formStyles.backButton} onClick={props.onGoBack}>
          back
        </button>
      </div>
      <div className={styles.friendDetailsContainer}>
        <div className={styles.friendDetails}>
          <div className={styles.nameContainer}>
            {getFullName(props.friend)}
          </div>
          {props.friend.tags.length > 0 && (
            <div className={styles.friendTagContainer}>
              {joinNodes(
                props.friend.tags.map((tag) => <Tag tag={tag} />),
                <div className={styles.tagDelimiter} />
              )}
            </div>
          )}
          {props.friend.relation && (
            <>
              <hr className={styles.divider} />
              <div className={styles.friendNote}>{props.friend.relation}</div>
            </>
          )}
        </div>
        <div className={styles.hangListContainer}>
          <div className={styles.hangListTitle}>Recent hangs</div>
          <div className={styles.hangList}>
            {props.friend.meetings.map((hang) => (
              <Hang
                hang={hang}
                friends={props.friends}
                key={hang.id}
                selectFriendFn={props.selectFriendFn}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
