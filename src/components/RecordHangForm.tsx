import { useState } from "react";
import { triplit } from "../../triplit/client";
import { Friend } from "../../triplit/schema";
import { getFullName } from "../logic/logic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./RecordHangForm.module.css";
import AutocompleteInput from "./AutocompleteInput";

interface RecordHangProps {
  onSubmit: () => void;
  friends: Friend[];
}

export default function RecordHangForm(props: RecordHangProps) {
  const [selectedDate, setSelectedDate] = useState(new Date() as Date | null);
  const [selectedFriends, setSelectedFriends] = useState([] as Friend[]);
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedFriends.length > 0) {
      await triplit.insert("friend_log", {
        date_contacted: selectedDate,
        friend_ids: new Set(selectedFriends.map((friend) => friend.id)),
        notes: note.length > 0 ? note : undefined,
      });
      props.onSubmit();
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="friend-input">Who&apos;d you hang with?</label>
          <AutocompleteInput
            options={props.friends}
            selectedOptions={selectedFriends}
            setSelectedOptions={setSelectedFriends}
            labelFunction={(friend) => getFullName(friend)}
            getOptionId={(friend) => friend.id}
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="date">When did you meet up?</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
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
