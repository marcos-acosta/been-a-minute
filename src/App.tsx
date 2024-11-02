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
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import useKeyboardControl, { KeyboardHook } from "react-keyboard-control";

function useFriends() {
  const friendsQuery = triplit.query("friends").include("meetings");
  const { results: friends, error } = useQuery(triplit, friendsQuery);
  return { friends, error };
}

export default function App() {
  const [searchText, setSearchText] = useState("");
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

  return (
    <div className={combineClasses(styles.appContainer, "sourceSansBasic")}>
      <div className={styles.filterPanel}>
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
        {/* <button className={styles.tagSelectButton}>+ tag</button> */}
      </div>
      <div className={styles.friendListContainer}>
        {sortedFriends?.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
}
