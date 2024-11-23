import { Friend, FriendBasic } from "../../triplit/schema";
import { getFullName } from "../logic/logic";
import styles from "./FriendDetailPage.module.css";
import mainStyles from "./MainPage.module.css";
import formStyles from "./FormStyling.module.css";
import Hang from "./Hang";
import Tag from "./Tag";
import { joinNodes } from "../logic/util";
import {
  ArrowLeftIcon,
  HomeIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

interface FriendDetailPageProps {
  friend: Friend;
  friends: FriendBasic[];
  onGoBack: () => void;
  selectFriendFn: (id: string) => void;
  edit: () => void;
  delete: () => void;
  goHome: () => void;
  showHomeIcon: boolean;
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
            {joinNodes(
              [
                props.showHomeIcon && (
                  <button
                    className={formStyles.backButton}
                    onClick={props.goHome}
                  >
                    <HomeIcon className={mainStyles.withinButtonIcon} />
                    home
                  </button>
                ),
                <button
                  className={formStyles.backButton}
                  onClick={props.onGoBack}
                >
                  <ArrowLeftIcon className={mainStyles.withinButtonIcon} />
                  back
                </button>,
                <button
                  className={mainStyles.themedButton}
                  onClick={props.edit}
                >
                  <Pencil1Icon className={mainStyles.withinButtonIcon} />
                  edit
                </button>,
                <button
                  className={mainStyles.themedButton}
                  onClick={props.delete}
                >
                  <TrashIcon className={mainStyles.withinButtonIcon} />
                  delete
                </button>,
              ].filter(Boolean),
              <span className={styles.buttonSeparator} />
            )}
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
          <div className={styles.friendNote}>
            {props.friend.relation ? (
              <span>{props.friend.relation}</span>
            ) : (
              <span className={styles.noDescription}>
                No description for {props.friend.first_name}! But you can{" "}
                <button className={styles.editText} onClick={props.edit}>
                  add one
                </button>{" "}
                anytime.
              </span>
            )}
          </div>
        </div>
        <div className={styles.hangListContainer}>
          {hangs.length > 0 ? (
            <>
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
