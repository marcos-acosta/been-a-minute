import { useRef, useState } from "react";
import { triplit } from "../triplit/client";
import { useQuery } from "@triplit/react";
import styles from "./App.module.css";
import {
  combineClasses,
  filterFriendsByQuery,
  sortFriendsByOverdueThenName,
} from "./logic/logic";
import FriendCard from "./components/FriendCard";
import {
  MagnifyingGlassIcon,
  Pencil1Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import useKeyboardControl, { KeyboardHook } from "react-keyboard-control";
import AddFriendForm from "./components/AddFriendForm";

function useFriends() {
  const friendsQuery = triplit.query("friends").include("meetings");
  const { results: friends, error } = useQuery(triplit, friendsQuery);
  return { friends, error };
}

enum PageState {
  FRIEND_LIST,
  ADD_A_FRIEND,
}

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [pageState, setPageState] = useState(PageState.FRIEND_LIST);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const { friends } = useFriends();

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

  const keyboardHooks: KeyboardHook[] = [
    {
      keyboardEvent: [{ key: "/" }],
      callback: focusSearchBar,
      preventDefault: true,
    },
  ];
  useKeyboardControl(keyboardHooks);

  const switchToAddFriendForm = () => setPageState(PageState.ADD_A_FRIEND);

  return (
    <div className={combineClasses(styles.appContainer, "sourceSansBasic")}>
      {pageState === PageState.FRIEND_LIST ? (
        <>
          <div className={styles.filterPanel}>
            <div className={styles.addFriendButtonContainer}>
              <button
                className={styles.themedButton}
                onClick={switchToAddFriendForm}
              >
                <PersonIcon className={styles.withinButtonIcon} /> add friend
              </button>
            </div>
            <div className={styles.searchIconContainer}>
              <MagnifyingGlassIcon />
            </div>
            <input
              className={styles.searchInput}
              value={searchText}
              placeholder="fuzzy search"
              onChange={(e) => setSearchText(e.target.value)}
              ref={searchBarRef}
            />
            <div className={styles.addHangButtonContainer}>
              <button className={styles.themedButton}>
                <Pencil1Icon className={styles.withinButtonIcon} />
                record hang
              </button>
            </div>
          </div>
          <div className={styles.friendListContainer}>
            {sortedFriends?.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </>
      ) : (
        <AddFriendForm />
      )}
    </div>
  );
}
