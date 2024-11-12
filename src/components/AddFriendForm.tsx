import { useState } from "react";
import styles from "./AddFriendForm.module.css";
import { triplit } from "../../triplit/client";
import { Tag, TagBasic, TimeUnit } from "../../triplit/schema";
import AutocompleteInput from "./AutocompleteInput";

interface AddFriendFormProps {
  onSubmit: () => void;
  tags: Tag[];
}

export default function AddFriendForm(props: AddFriendFormProps) {
  const [fullName, setFullName] = useState("");
  const [isLocal, setIsLocal] = useState(true);
  const [maxTimeAmount, setMaxTimeAmount] = useState(1);
  const [keepInTouch, setKeepInTouch] = useState(true);
  const [maxTimeUnit, setMaxTimeUnit] = useState("month" as TimeUnit);
  const [selectedTags, setSelectedTags] = useState([] as Tag[]);
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [first, last] = splitFirstAndLastName();
    await triplit.insert("friends", {
      first_name: first,
      last_name: last,
      relation: note.length > 0 ? note : undefined,
      long_distance: !isLocal,
      max_time_between_contact: keepInTouch
        ? {
            amount: maxTimeAmount,
            unit: maxTimeUnit,
          }
        : undefined,
      tag_ids: new Set(selectedTags.map((tag) => tag.id)),
    });
    props.onSubmit();
  };

  const addTagToDatabase = async (
    tagText: string
  ): Promise<TagBasic | undefined> => {
    const insertedTag = await triplit.insert("tags", {
      name: tagText,
    });
    return insertedTag.output;
  };

  const considerPlural = (str: string) =>
    maxTimeAmount !== 1 ? `${str}s` : str;

  const splitFirstAndLastName = (): [string, string | undefined] => {
    const fullNameTrimmed = fullName.trim();
    const firstSpaceIndex = fullNameTrimmed.indexOf(" ");
    if (firstSpaceIndex === -1) {
      return [fullNameTrimmed, undefined];
    } else {
      return [
        fullNameTrimmed.slice(0, firstSpaceIndex),
        fullNameTrimmed.slice(firstSpaceIndex + 1),
      ];
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">What's their name?</label>
          <input
            className={styles.shortTextInput}
            id="name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="local">Are they local?</label>
          <input
            type="checkbox"
            checked={isLocal}
            onChange={(e) => setIsLocal(e.target.checked)}
          />
        </div>
        <div>
          <label htmlFor="keep-in-touch">
            Do you want to keep in touch?
            <input
              type="checkbox"
              checked={keepInTouch}
              onChange={(e) => setKeepInTouch(e.target.checked)}
            />
          </label>
        </div>
        {keepInTouch && (
          <div>
            <label htmlFor="time-amount">
              What's the longest you'd like to go without seeing them?
            </label>
            <input
              type="number"
              id="time-amount"
              value={maxTimeAmount}
              onChange={(e) =>
                !isNaN(+e.target.value) &&
                setMaxTimeAmount(parseInt(e.target.value))
              }
            />
            <select
              value={maxTimeUnit}
              onChange={(e) => setMaxTimeUnit(e.target.value as TimeUnit)}
            >
              <option value="day">{considerPlural("day")}</option>
              <option value="week">{considerPlural("week")}</option>
              <option value="month">{considerPlural("month")}</option>
              <option value="year">{considerPlural("year")}</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="note">What do you want to remember about them?</label>
          <input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tag-input">Tags:</label>
          <AutocompleteInput
            options={props.tags as TagBasic[]}
            selectedOptions={selectedTags as TagBasic[]}
            setSelectedOptions={setSelectedTags as (t: TagBasic[]) => void}
            labelFunction={(tag) => tag.name}
            getOptionId={(tag) => tag.id}
            allowAddNew
            addNewOption={addTagToDatabase}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
