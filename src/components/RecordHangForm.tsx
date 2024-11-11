import { useState } from "react";
import styles from "./RecordHangForm.module.css";
import { triplit } from "../../triplit/client";
import { Friend } from "../../triplit/schema";
import { convertLocalDateStringToDate, getFullName } from "../logic/logic";

interface RecordHangProps {
  onSubmit: () => void;
  friends: Friend[];
}

export default function RecordHangForm(props: RecordHangProps) {
  const [hangDate, setHangDate] = useState("");
  const [friendIds, setFriendIds] = useState([] as string[]);
  const [friendNameInput, setFriendNameInput] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triplit.insert("friend_log", {
      date_contacted: convertLocalDateStringToDate(hangDate),
      friend_ids: new Set(friendIds),
      notes: note.length > 0 ? note : undefined,
    });
    props.onSubmit();
  };

  const addFriendToList = () => {
    if (friendNameInput.length > 0) {
      setFriendIds([...friendIds, friendNameInput]);
      setFriendNameInput("");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="friend-input">Who&apos;d you hang with?</label>
          <input
            id="friend-input"
            value={friendNameInput}
            onChange={(e) => setFriendNameInput(e.target.value)}
          />
          <button onClick={addFriendToList} type="button">
            Add
          </button>
        </div>
        <div>
          {friendIds.map((friendId) => (
            <div key={friendId}>
              {getFullName(
                props.friends.find((friend) => friend.id === friendId) as Friend
              )}
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="date">When did you meet up?</label>
          <input
            id="date"
            onChange={(e) => setHangDate(e.target.value)}
            value={hangDate}
          />
        </div>
        <div>
          <label htmlFor="note">
            What do you want to remember about the hang?
          </label>
          <input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
