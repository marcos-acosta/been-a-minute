import { useRef, useState } from "react";
import { triplit } from "../../triplit/client";
import { useQuery } from "@triplit/react";
import styles from "./MainPage.module.css";
import {
  filterFriendsByQuery,
  sortFriendsByOverdueThenName,
} from "./../logic/logic";
import FriendCard from "./FriendCard";
import {
  MagnifyingGlassIcon,
  Pencil1Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import useKeyboardControl, { KeyboardHook } from "react-keyboard-control";
import AddFriendForm from "./AddFriendForm";
import RecordHangForm from "./RecordHangForm";
import { callbackOnEscape, combineClasses } from "./../logic/util";
import { PageState } from "../App";

function useFriends() {
  const friendsQuery = triplit.query("friends").include("meetings");
  const { results: friends, error } = useQuery(triplit, friendsQuery);
  return { friends, error };
}

function useTags() {
  const tagsQuery = triplit.query("tags").include("tagged_friends");
  const { results: tags, error } = useQuery(triplit, tagsQuery);
  return { tags, error };
}

interface MainPageProps {
  pageState: PageState;
  setPageState: (p: PageState) => void;
}

export default function MainPage(props: MainPageProps) {
  const [searchText, setSearchText] = useState("");
  const searchBarRef = useRef<HTMLInputElement>(null);
  const { friends } = useFriends();
  const { tags } = useTags();

  const filteredFriends =
    friends &&
    (searchText.length > 0
      ? filterFriendsByQuery(friends, searchText)
      : friends);

  const sortedFriends =
    filteredFriends && sortFriendsByOverdueThenName(filteredFriends);

  const focusSearchBar = () => {
    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  };

  const blurSearchBar = () => {
    if (searchBarRef.current) {
      searchBarRef.current.blur();
    }
    setSearchText("");
  };

  const switchToAddFriendForm = () =>
    props.setPageState(PageState.ADD_A_FRIEND);
  const switchToRecordHangForm = () =>
    props.setPageState(PageState.RECORD_A_HANG);
  const switchToFriendList = () => props.setPageState(PageState.FRIEND_LIST);

  const keyboardHooks: KeyboardHook[] = [
    {
      keyboardEvent: [{ key: "/" }],
      callback: focusSearchBar,
      preventDefault: true,
      allowWhen: props.pageState === PageState.FRIEND_LIST,
    },
  ];
  useKeyboardControl(keyboardHooks);

  return (
    friends &&
    tags && (
      <div className={combineClasses(styles.appContainer, "sourceSansBasic")}>
        {props.pageState === PageState.FRIEND_LIST ? (
          <>
            <div className={styles.header}>
              <div className={styles.filterPanel}>
                <div className={styles.addFriendButtonContainer}>
                  <button
                    className={styles.themedButton}
                    onClick={switchToAddFriendForm}
                  >
                    <PersonIcon className={styles.withinButtonIcon} /> add
                    friend
                  </button>
                </div>
                <div className={styles.searchIconContainer}>
                  <MagnifyingGlassIcon />
                </div>
                <input
                  className={styles.searchInput}
                  value={searchText}
                  placeholder="search"
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => callbackOnEscape(e, blurSearchBar)}
                  ref={searchBarRef}
                />
                <div className={styles.addHangButtonContainer}>
                  <button
                    className={styles.themedButton}
                    onClick={switchToRecordHangForm}
                  >
                    <Pencil1Icon className={styles.withinButtonIcon} />
                    record hang
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.friendListContainer}>
              {sortedFriends?.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </>
        ) : props.pageState === PageState.ADD_A_FRIEND ? (
          <AddFriendForm onSubmit={switchToFriendList} tags={tags} />
        ) : (
          <RecordHangForm onSubmit={switchToFriendList} friends={friends} />
        )}
      </div>
    )
  );
}
