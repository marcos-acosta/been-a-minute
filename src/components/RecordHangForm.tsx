import { useState } from "react";
import formStyles from "./FormStyling.module.css";
import mainStyles from "./MainPage.module.css";
import { FriendBasic } from "../../triplit/schema";
import AutocompleteInput from "./AutocompleteInput";
import { combineClasses } from "../logic/util";
import { ArrowLeftIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { getFullName } from "../logic/logic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addHang } from "../logic/database";

interface RecordHangProps {
  onSubmit: () => void;
  friends: FriendBasic[];
}

export default function RecordHang(props: RecordHangProps) {
  const [selectedDate, setSelectedDate] = useState(new Date() as Date | null);
  const [selectedFriends, setSelectedFriends] = useState([] as FriendBasic[]);
  const [note, setNote] = useState("");

  const canSubmit = selectedFriends.length > 0 && selectedDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      const noteOrNothing = note.length > 0 ? note : undefined;
      addHang(
        selectedFriends.map((friend) => friend.id),
        selectedDate,
        noteOrNothing
      );
      props.onSubmit();
    }
  };

  return (
    <div className={formStyles.formPage}>
      <button className={formStyles.backButton} onClick={props.onSubmit}>
        <ArrowLeftIcon />
        <span className={formStyles.backButtonText}>back</span>
      </button>
      <div className={formStyles.title}>Record a hang</div>
      <form onSubmit={handleSubmit}>
        <div className={formStyles.formContainer}>
          <div className={formStyles.formLabelContainer}>
            <div className={formStyles.labelContainer}>
              <label className={formStyles.formLabel} htmlFor="tag-input">
                who did you hang with?
              </label>
            </div>
            <div className={formStyles.line} />
          </div>
          <div className={formStyles.inputContainer}>
            <AutocompleteInput
              options={props.friends as FriendBasic[]}
              selectedOptions={selectedFriends as FriendBasic[]}
              setSelectedOptions={
                setSelectedFriends as (t: FriendBasic[]) => void
              }
              labelFunction={(friend) => getFullName(friend)}
              getOptionId={(friend) => friend.id}
              placeholder="add a friend"
              inputClasses={[formStyles.inputHeight]}
              autoFocus
            />
          </div>
          <div className={formStyles.formLabelContainer}>
            <div className={formStyles.labelContainer}>
              <label className={formStyles.formLabel} htmlFor="note">
                what did you do?
              </label>
            </div>
            <div className={formStyles.line} />
          </div>
          <div className={formStyles.inputContainer}>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoComplete="off"
              className={formStyles.textArea}
              placeholder="add a note"
              rows={3}
            />
          </div>
          <div className={formStyles.formLabelContainer}>
            <div className={formStyles.labelContainer}>
              <label className={formStyles.formLabel} htmlFor="date">
                when did you meet up?
              </label>
            </div>
            <div className={formStyles.line} />
          </div>
          <div className={formStyles.inputContainer}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className={formStyles.formInput}
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div />
          <div className={formStyles.submitButtonContainer}>
            <button
              type="submit"
              className={combineClasses(
                mainStyles.themedButton,
                formStyles.submitButton
              )}
              disabled={!canSubmit}
            >
              <Pencil2Icon className={mainStyles.withinButtonIcon} /> record
              hang
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
