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
  const hangs = props.friend.meetings.sort(
    (hangA, hangB) =>
      hangB.date_contacted.valueOf() - hangA.date_contacted.valueOf()
  );

  return (
    <div className={styles.friendDetailPageContainer}>
      <div className={styles.friendDetailsContainer}>
        <div className={styles.friendDetails}>
          <div className={styles.backButtonContainer}>
            <button className={formStyles.backButton} onClick={props.onGoBack}>
              back
            </button>
          </div>
          <div className={styles.nameContainer}>
            {getFullName(props.friend)}
          </div>
          {props.friend.tags.length > 0 && (
            <div className={styles.friendTagContainer}>
              {joinNodes(
                props.friend.tags.map((tag) => (
                  <Tag tag={tag} styleClasses={[styles.tagContainer]} />
                )),
                <div className={styles.tagDelimiter} />
              )}
            </div>
          )}
          {props.friend.relation && (
            <div className={styles.friendNote}>{props.friend.relation}</div>
          )}
        </div>
        <div className={styles.hangListContainer}>
          {hangs.length > 0 ? (
            <>
              <div className={styles.hangTitleContainer}>
                <div className={styles.hangTitle}>Recent hangs</div>
              </div>
              <div className={styles.hangList}>
                {hangs.map((hang) => (
                  <Hang
                    hang={hang}
                    friends={props.friends}
                    key={hang.id}
                    selectFriendFn={props.selectFriendFn}
                    selectedFriendId={props.friend.id}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.noHangsContainer}>
              <div className={styles.noHangsMessageContainer}>
                <div className={styles.bears}>
                  &#661; º ᴥ º&#660;&nbsp;&nbsp;&nbsp;&#661;º ᴥ º &#660;
                </div>
                <div className={styles.noHangsMessage}>
                  You haven't met up yet! Once you do, it'll show up here.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
