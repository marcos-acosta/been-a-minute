import { useState } from "react";
import styles from "./AddFriendForm.module.css";
import mainStyles from "./MainPage.module.css";
import { triplit } from "../../triplit/client";
import { Tag, TagBasic, TimeUnit } from "../../triplit/schema";
import AutocompleteInput from "./AutocompleteInput";
import { combineClasses, tryToParseInt } from "../logic/util";
import { ArrowLeftIcon, PersonIcon } from "@radix-ui/react-icons";
import { textToColor } from "../logic/rendering";

interface AddFriendFormProps {
  onSubmit: () => void;
  tags: Tag[];
}

export default function AddFriendForm(props: AddFriendFormProps) {
  const [fullName, setFullName] = useState("");
  const [isLocal, setIsLocal] = useState(true);
  const [maxTimeAmount, setMaxTimeAmount] = useState("1");
  const [keepInTouch, setKeepInTouch] = useState(true);
  const [maxTimeUnit, setMaxTimeUnit] = useState("month" as TimeUnit);
  const [selectedTags, setSelectedTags] = useState([] as Tag[]);
  const [note, setNote] = useState("");

  const parsedMaxTimeAmount = tryToParseInt(maxTimeAmount);

  const canSubmit =
    parsedMaxTimeAmount && parsedMaxTimeAmount > 0 && fullName.length > 0;

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
            amount: parseInt(maxTimeAmount),
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
    parsedMaxTimeAmount === 1 ? str : `${str}s`;

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

  const getYesNoCheckbox = (value: boolean, setter: (b: boolean) => void) => (
    <select
      value={value ? "yes" : "no"}
      className={combineClasses(styles.selector)}
      onChange={(e) => setter(e.target.value === "yes")}
    >
      <option value="yes">yes</option>
      <option value="no">no</option>
    </select>
  );

  return (
    <div className={styles.formPage}>
      <button className={styles.backButton} onClick={props.onSubmit}>
        <ArrowLeftIcon />
        <span className={styles.backButtonText}>back</span>
      </button>
      <div className={styles.title}>
        {fullName.length > 0 ? fullName : "A new friend!"}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <div className={styles.formLabelContainer}>
            <label className={styles.formLabel} htmlFor="name">
              what's their name?
            </label>
            <div className={styles.line} />
          </div>
          <div className={styles.inputContainer}>
            <input
              className={combineClasses(
                styles.formInput,
                fullName.length === 0 && styles.invalid
              )}
              id="name"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              autoFocus
              autoComplete="off"
            />
          </div>
          <div className={styles.formLabelContainer}>
            <div className={styles.labelContainer}>
              <label className={styles.formLabel} htmlFor="local">
                are they local?
              </label>
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.inputContainer}>
            {getYesNoCheckbox(isLocal, setIsLocal)}
          </div>
          <div className={styles.formLabelContainer}>
            <div className={styles.labelContainer}>
              <label className={styles.formLabel} htmlFor="keep-in-touch">
                do you want to keep in touch?
              </label>
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.inputContainer}>
            {getYesNoCheckbox(keepInTouch, setKeepInTouch)}
          </div>
          {keepInTouch && (
            <>
              <div className={styles.formLabelContainer}>
                <div className={styles.labelContainer}>
                  <label className={styles.formLabel} htmlFor="time-amount">
                    what's the longest you'd like to go between hangs?
                  </label>
                </div>
                <div className={styles.line} />
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  id="time-amount"
                  value={maxTimeAmount}
                  onChange={(e) => setMaxTimeAmount(e.target.value)}
                  autoComplete="off"
                  size={2}
                  className={combineClasses(
                    styles.formInput,
                    !(parsedMaxTimeAmount && parsedMaxTimeAmount > 0) &&
                      styles.invalid
                  )}
                />
                <select
                  value={maxTimeUnit}
                  className={combineClasses(
                    styles.selector,
                    styles.timeUnitSelector
                  )}
                  onChange={(e) => setMaxTimeUnit(e.target.value as TimeUnit)}
                >
                  <option value="day">{considerPlural("day")}</option>
                  <option value="week">{considerPlural("week")}</option>
                  <option value="month">{considerPlural("month")}</option>
                  <option value="year">{considerPlural("year")}</option>
                </select>
              </div>
            </>
          )}
          <div className={styles.formLabelContainer}>
            <div className={styles.labelContainer}>
              <label className={styles.formLabel} htmlFor="note">
                how do you know them?
              </label>
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.inputContainer}>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoComplete="off"
              className={styles.textArea}
              placeholder="add a note"
              rows={3}
            />
          </div>
          <div className={styles.formLabelContainer}>
            <div className={styles.labelContainer}>
              <label className={styles.formLabel} htmlFor="tag-input">
                what do you associate them with?
              </label>
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.inputContainer}>
            <AutocompleteInput
              options={props.tags as TagBasic[]}
              selectedOptions={selectedTags as TagBasic[]}
              setSelectedOptions={setSelectedTags as (t: TagBasic[]) => void}
              labelFunction={(tag) => tag.name}
              getOptionId={(tag) => tag.id}
              addNewOptionFormatter={(s: string) => `add new tag: ${s}`}
              allowAddNew
              addNewOption={addTagToDatabase}
              placeholder="add a tag"
              optionStylingFunction={(tag: TagBasic) => ({
                backgroundColor: textToColor(tag.name),
              })}
              inputClasses={[styles.inputHeight]}
            />
          </div>
          <div />
          <button
            type="submit"
            className={combineClasses(
              mainStyles.themedButton,
              styles.submitButton
            )}
            disabled={!canSubmit}
          >
            <PersonIcon className={mainStyles.withinButtonIcon} /> add friend
          </button>
        </div>
      </form>
    </div>
  );
}
