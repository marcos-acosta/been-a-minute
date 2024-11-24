import { useRef, useState } from "react";
import { client } from "../../triplit/client";
import { useQuery } from "@triplit/react";
import styles from "./MainPage.module.css";
import {
  filterFriendsByQueryAndTags,
  sortFriendsByOverdueThenName,
} from "./../logic/logic";
import FriendCard from "./FriendCard";
import {
  MagnifyingGlassIcon,
  Pencil2Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import useKeyboardControl, { KeyboardHook } from "react-keyboard-control";
import AddFriendForm from "./AddFriendForm";
import RecordHangForm from "./RecordHangForm";
import { combineClasses, joinNodes } from "./../logic/util";
import { PageState } from "../App";
import {
  addFriend,
  addHang,
  removeFriend,
  updateFriend,
  updateHang,
} from "../logic/database";
import { FriendToSubmit, HangToSubmit, Tag } from "../../triplit/schema";
import AutocompleteInput from "./AutocompleteInput";
import { tagToColor } from "../logic/rendering";
import FriendDetailPage from "./FriendDetailPage";
import Dev from "./Dev";

function useFriends() {
  const friendsQuery = client
    .query("friends")
    .include("meetings")
    .include("tags");
  const { results: friends, error } = useQuery(client, friendsQuery);
  return { friends, error };
}

function useTags() {
  const tagsQuery = client.query("tags").include("tagged_friends");
  const { results: tags, error } = useQuery(client, tagsQuery);
  return { tags, error };
}

function useHangs() {
  const hangsQuery = client.query("friend_log");
  const { results: hangs, error } = useQuery(client, hangsQuery);
  return { hangs, error };
}

interface MainPageProps {
  pageState: PageState;
  setPageState: (p: PageState) => void;
}

export default function MainPage(props: MainPageProps) {
  const [searchText, setSearchText] = useState("");
  const [friendIdBeingUpdated, setFriendIdBeingUpdated] = useState(
    null as null | string
  );
  const [hangIdBeingUpdated, setHangIdBeingUpdated] = useState(
    null as null | string
  );
  const [selectedFriendId, setSelectedFriendId] = useState(
    null as null | string
  );
  const [selectedTags, setSelectedTags] = useState([] as Tag[]);
  const [backStack, setBackStack] = useState([] as (() => void)[]);

  const searchBarRef = useRef<HTMLInputElement>(null);

  const { friends } = useFriends();
  const { tags } = useTags();
  const { hangs } = useHangs();

  const filteredFriends =
    friends &&
    filterFriendsByQueryAndTags(friends, searchText.trim(), selectedTags);

  const sortedFriends =
    filteredFriends && sortFriendsByOverdueThenName(filteredFriends);

  const focusSearchBar = () => {
    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  };

  const addToBackStack = (backFn: () => void) => {
    setBackStack([...backStack, backFn]);
  };

  const popOffBackStack = () => {
    setBackStack(backStack.slice(0, -1));
  };

  const switchToAddFriendForm = () =>
    props.setPageState(PageState.ADD_A_FRIEND);
  const switchToRecordHangForm = () =>
    props.setPageState(PageState.RECORD_A_HANG);
  const switchToFriendList = () => props.setPageState(PageState.FRIEND_LIST);
  const switchToEditHangForm = () => props.setPageState(PageState.EDIT_HANG);

  const keyboardHooks: KeyboardHook[] = [
    {
      keyboardEvent: [{ key: "q" }],
      callback: focusSearchBar,
      preventDefault: true,
      allowWhen: props.pageState === PageState.FRIEND_LIST,
    },
  ];
  useKeyboardControl(keyboardHooks);

  const editFriend = (id: string) => {
    setFriendIdBeingUpdated(id);
    props.setPageState(PageState.EDIT_FRIEND);
  };

  const editFriendFromHome = (id: string) => {
    editFriend(id);
    addToBackStack(switchToFriendList);
  };

  const selectFriend = (id: string) => {
    setSelectedFriendId(id);
    props.setPageState(PageState.FRIEND_DETAIL);
  };

  const selectFriendFromHome = (id: string) => {
    selectFriend(id);
    addToBackStack(switchToFriendList);
  };

  const selectFriendFromDetail = (id: string) => {
    selectFriend(id);
    if (selectedFriendId) {
      addToBackStack(() => selectFriend(selectedFriendId));
    }
  };

  const editFriendFromDetail = (id: string) => {
    editFriend(id);
    if (selectedFriendId) {
      addToBackStack(() => selectFriend(selectedFriendId));
    }
  };

  const editHang = (id: string) => {
    setHangIdBeingUpdated(id);
    switchToEditHangForm();
  };

  const startEditingHangFromDetail = (hangId: string) => {
    editHang(hangId);
    if (selectedFriendId) {
      addToBackStack(() => selectFriend(selectedFriendId));
    }
  };

  const friendBeingEdited =
    friends && friends.find((friend) => friend.id === friendIdBeingUpdated);
  const selectedFriend =
    friends && friends.find((friend) => friend.id === selectedFriendId);
  const hangBeingEdited =
    hangs && hangs.find((hang) => hang.id === hangIdBeingUpdated);

  const goBack = () => {
    if (backStack.length === 0) {
      switchToFriendList();
    } else {
      const goBackFn = backStack[backStack.length - 1];
      goBackFn();
      popOffBackStack();
    }
  };

  const deleteAndGoBack = async (friendId: string) => {
    removeFriend(friendId).then(() => goBack);
  };

  const goHome = () => {
    setBackStack([]);
    switchToFriendList();
  };

  return (
    friends &&
    tags && (
      <>
        <div className={combineClasses(styles.appContainer, "sourceSansBasic")}>
          {props.pageState === PageState.FRIEND_LIST ? (
            <>
              <div className={styles.header}>
                <div className={styles.filterPanel}>
                  <div className={styles.addFriendButtonContainer}>
                    {joinNodes(
                      [
                        <button
                          className={styles.themedButton}
                          onClick={switchToAddFriendForm}
                        >
                          <PersonIcon className={styles.withinButtonIcon} /> add
                          friend
                        </button>,
                        <button
                          className={styles.themedButton}
                          onClick={switchToRecordHangForm}
                        >
                          <Pencil2Icon className={styles.withinButtonIcon} />
                          record hang
                        </button>,
                      ],
                      <div className={styles.buttonGap} />
                    )}
                  </div>
                  <div className={styles.searchContainer}>
                    <div className={styles.searchIconContainer}>
                      <MagnifyingGlassIcon />
                    </div>
                    <AutocompleteInput
                      options={tags}
                      selectedOptions={selectedTags}
                      setSelectedOptions={setSelectedTags}
                      labelFunction={(t: Tag) => t.name}
                      getOptionId={(t: Tag) => t.id}
                      allowAddNew={false}
                      optionStylingFunction={(t: Tag) => ({
                        backgroundColor: tagToColor(t),
                        fontFamily: "monospace",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        fontSize: "14px",
                      })}
                      placeholder={"search"}
                      activationCharacter="#"
                      remainderText={searchText}
                      setRemainderText={setSearchText}
                      inputClasses={[styles.searchInput]}
                      inputRef={searchBarRef}
                      showResultsOnActivationCharacter
                    />
                  </div>
                  <div className={styles.addHangButtonContainer}>
                    sign in/out
                  </div>
                </div>
              </div>
              <div className={styles.friendListContainer}>
                {sortedFriends?.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    startEditingFn={() => editFriendFromHome(friend.id)}
                    selectFriendFn={() => selectFriendFromHome(friend.id)}
                  />
                ))}
              </div>
            </>
          ) : props.pageState === PageState.ADD_A_FRIEND ? (
            <AddFriendForm
              onSubmit={goHome}
              submitFriendFn={addFriend}
              tags={tags}
            />
          ) : props.pageState === PageState.EDIT_FRIEND &&
            friendIdBeingUpdated &&
            friendBeingEdited ? (
            <AddFriendForm
              onSubmit={goBack}
              submitFriendFn={(f: FriendToSubmit) =>
                updateFriend(friendIdBeingUpdated, f)
              }
              tags={tags}
              existingFriend={friendBeingEdited}
            />
          ) : props.pageState === PageState.RECORD_A_HANG ? (
            <RecordHangForm
              onSubmit={goHome}
              friends={friends}
              submitHangFn={addHang}
            />
          ) : props.pageState === PageState.FRIEND_DETAIL && selectedFriend ? (
            <FriendDetailPage
              goHome={goHome}
              friend={selectedFriend}
              friends={friends}
              onGoBack={goBack}
              selectFriendFn={selectFriendFromDetail}
              edit={() => editFriendFromDetail(selectedFriend.id)}
              delete={() => deleteAndGoBack(selectedFriend.id)}
              showHomeIcon={backStack.length > 1}
              startEditingHang={startEditingHangFromDetail}
            />
          ) : props.pageState === PageState.DEV ? (
            <Dev friends={friends} tags={tags} />
          ) : props.pageState === PageState.EDIT_HANG && hangIdBeingUpdated ? (
            <RecordHangForm
              onSubmit={goBack}
              friends={friends}
              submitHangFn={(h: HangToSubmit) =>
                updateHang(hangIdBeingUpdated, h)
              }
              hangToUpdate={hangBeingEdited}
            />
          ) : (
            <div>Unknown page state</div>
          )}
        </div>
      </>
    )
  );
}
