import { useState } from "react";
import formStyles from "./FormStyling.module.css";
import mainStyles from "./MainPage.module.css";
import { FriendBasic, HangBasic, HangToSubmit } from "../../triplit/schema";
import AutocompleteInput from "./AutocompleteInput";
import { combineClasses } from "../logic/util";
import { ArrowLeftIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { getFullName } from "../logic/logic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface RecordHangProps {
  onSubmit: () => void;
  friends: FriendBasic[];
  hangToUpdate?: HangBasic;
  submitHangFn: (h: HangToSubmit) => void;
}

const getInitialFriends = (friendIds: Set<string>, friends: FriendBasic[]) =>
  friends.filter((friend) => friendIds.has(friend.id));

export default function RecordHang(props: RecordHangProps) {
  const [selectedDate, setSelectedDate] = useState(
    props.hangToUpdate?.date_contacted || (new Date() as Date | null)
  );
  const [selectedFriends, setSelectedFriends] = useState(
    props.hangToUpdate
      ? getInitialFriends(props.hangToUpdate.friend_ids, props.friends)
      : ([] as FriendBasic[])
  );
  const [note, setNote] = useState(props.hangToUpdate?.notes || "");

  const canSubmit = selectedFriends.length > 0 && selectedDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      const noteOrNothing = note.length > 0 ? note : undefined;
      const newHang: HangToSubmit = {
        friend_ids: new Set(selectedFriends.map((friend) => friend.id)),
        date_contacted: selectedDate,
        notes: noteOrNothing,
      };
      props.submitHangFn(newHang);
      props.onSubmit();
    }
  };

  return (
    <div className={formStyles.formPage}>
      <button className={formStyles.backButton} onClick={props.onSubmit}>
        <ArrowLeftIcon className={mainStyles.withinButtonIcon} />
        <span className={formStyles.backButtonText}>back</span>
      </button>
      <div className={formStyles.title}>
        {props.hangToUpdate ? "Update" : "Record"} a hang
      </div>
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
              <Pencil2Icon className={mainStyles.withinButtonIcon} />{" "}
              {props.hangToUpdate ? "update " : "record "}
              hang
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
