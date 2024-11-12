import { useRef, useState } from "react";
import styles from "./AutocompleteInput.module.css";
import { callbackOnEnter } from "../logic/util";

export default function AutocompleteInput<OptionType>(props: {
  options: OptionType[];
  selectedOptions: OptionType[];
  setSelectedOptions: (os: OptionType[]) => void;
  labelFunction: (o: OptionType) => string;
  getOptionId: (o: OptionType) => string;
  allowAddNew?: boolean;
  addNewOption?: (s: string) => Promise<OptionType | undefined>;
  addNewOptionFormatter?: (s: string) => string;
  matchFunction?: (o: string, q: string) => boolean;
  autoFocus?: boolean;
}) {
  const [textInput, setTextInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addNewOption = props.addNewOption;
  const formatNewOption =
    props.addNewOptionFormatter || ((s: string) => `Add new option: "${s}"`);
  const matchFunction =
    props.matchFunction ||
    ((o: string, q: string) => o.toLowerCase().startsWith(q.toLowerCase()));

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeOption = (optionToRemove: OptionType) => {
    props.setSelectedOptions(
      props.selectedOptions.filter(
        (option) =>
          props.getOptionId(option) !== props.getOptionId(optionToRemove)
      )
    );
    focusInput();
  };

  const addOptionToSelected = (option: OptionType) => {
    props.setSelectedOptions([...props.selectedOptions, option]);
    setTextInput("");
    focusInput();
  };

  const optionIsSelected = (option: OptionType) =>
    props.selectedOptions.find(
      (o) => props.getOptionId(option) === props.getOptionId(o)
    );

  const addNewOptionAndSelect = async () => {
    if (!addNewOption) {
      return;
    }
    const newOption = await addNewOption(textInput);
    if (newOption) {
      addOptionToSelected(newOption);
    }
  };

  const matchingOptions =
    textInput.length > 0
      ? props.options.filter(
          (option) =>
            matchFunction(props.labelFunction(option), textInput) &&
            !optionIsSelected(option)
        )
      : [];

  const handleEnter = () => {
    if (textInput.length === 0) {
      return;
    }
    if (matchingOptions.length > 0) {
      addOptionToSelected(matchingOptions[0]);
    } else if (props.allowAddNew && addNewOption) {
      addNewOptionAndSelect();
    }
  };

  return (
    <>
      <div>
        <div className={styles.selectedOptionsContainer}>
          {props.selectedOptions.map((selectedOption) => (
            <div
              className={styles.selectedOption}
              key={props.getOptionId(selectedOption)}
            >
              {props.labelFunction(selectedOption)}
              <button
                className={styles.removeButton}
                onClick={() => removeOption(selectedOption)}
              >
                x
              </button>
            </div>
          ))}
        </div>
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => callbackOnEnter(e, handleEnter)}
          autoFocus={props.autoFocus}
        />
      </div>
      <div>
        {matchingOptions.length > 0
          ? matchingOptions.map((option) => (
              <div
                key={props.getOptionId(option)}
                onClick={() => addOptionToSelected(option)}
              >
                {props.labelFunction(option)}
              </div>
            ))
          : props.allowAddNew &&
            addNewOption &&
            textInput.length > 0 && (
              <div onClick={addNewOptionAndSelect}>
                {formatNewOption(textInput)}
              </div>
            )}
      </div>
    </>
  );
}
