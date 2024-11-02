import { useState } from "react";
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

function useFriends() {
  const friendsQuery = triplit.query("friends").include("meetings");
  const { results: friends, error } = useQuery(triplit, friendsQuery);
  return { friends, error };
}

export default function App() {
  const [searchText, setSearchText] = useState("");
  const { friends } = useFriends();

  const filteredFriends =
    friends &&
    (searchText.length > 0
      ? filterFriendsByQuery(friends, searchText)
      : friends);

  const sortedFriends =
    filteredFriends && sortFriendsByOverdueThenName(filteredFriends);

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
