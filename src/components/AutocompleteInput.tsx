import { useEffect, useRef, useState } from "react";
import styles from "./AutocompleteInput.module.css";
// import formStyles from "./FormStyling.module.css";
import { callbackOn, callbackOnEnter, combineClasses } from "../logic/util";

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
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
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

  const handleDelete = () => {
    if (textInput.length === 0 && props.selectedOptions.length > 0) {
      props.setSelectedOptions(props.selectedOptions.slice(0, -1));
    }
  };

  const handleEnter = () => {
    if (textInput.length === 0) {
      return;
    }
    if (matchingOptions.length > 0) {
      addOptionToSelected(matchingOptions[selectedSuggestionIndex]);
    } else if (props.allowAddNew && addNewOption) {
      addNewOptionAndSelect();
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

  const scrollUp = () =>
    setSelectedSuggestionIndex(
      selectedSuggestionIndex === 0
        ? matchingOptions.length - 1
        : selectedSuggestionIndex - 1
    );

  const scrollDown = () =>
    setSelectedSuggestionIndex(
      selectedSuggestionIndex === matchingOptions.length - 1
        ? 0
        : selectedSuggestionIndex + 1
    );

  useEffect(() => {
    setSelectedSuggestionIndex(0);
  }, [textInput]);

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.autocompleteInputContainer}>
        {props.selectedOptions.length > 0 && (
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
        )}
        <input
          className={combineClasses(styles.textInput, styles.formInput)}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            callbackOnEnter(e, handleEnter);
            callbackOn(e, "Backspace", handleDelete, false);
            callbackOn(e, "ArrowDown", scrollDown, true);
            callbackOn(e, "ArrowUp", scrollUp, true);
          }}
          autoFocus={props.autoFocus}
          autoComplete="off"
        />
      </div>
      <div className={styles.suggestionsContainer}>
        {matchingOptions.length > 0
          ? matchingOptions.map((option, i) => (
              <button
                key={props.getOptionId(option)}
                onClick={() => addOptionToSelected(option)}
                className={combineClasses(
                  styles.suggestion,
                  i === selectedSuggestionIndex && styles.selectedSuggestion
                )}
              >
                {props.labelFunction(option)}
              </button>
            ))
          : props.allowAddNew &&
            addNewOption &&
            textInput.length > 0 && (
              <button
                onClick={addNewOptionAndSelect}
                className={styles.suggestion}
              >
                {formatNewOption(textInput)}
              </button>
            )}
      </div>
    </div>
  );
}
