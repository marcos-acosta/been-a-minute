import {
  ChangeEvent,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./AutocompleteInput.module.css";
import {
  callbackOn,
  callbackOnEnter,
  combineClasses,
  joinNodes,
} from "../logic/util";

interface ActivationMatchResult {
  matchedActivationChar: boolean;
  relevantText: string;
  existingText: string;
}

const matchActivationChar = (
  input: string,
  activationChar: string
): ActivationMatchResult => {
  const activationCharMatch = input.match(
    `(?<existing>.*)${activationChar}(?<option>.*)`
  );
  if (!activationCharMatch?.groups) {
    return {
      matchedActivationChar: false,
      relevantText: "",
      existingText: input,
    };
  } else {
    return {
      matchedActivationChar: true,
      relevantText: activationCharMatch.groups["option"],
      existingText: activationCharMatch.groups["existing"],
    };
  }
};

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
  optionStylingFunction?: (o: OptionType) => object;
  autoFocus?: boolean;
  placeholder?: string;
  inputClasses?: string[];
  hideSelections?: boolean;
  inputText?: string;
  setInputText?: (s: string) => void;
  remainderText?: string;
  setRemainderText?: (s: string) => void;
  activationCharacter?: string;
  displayLabelFn?: (s: string) => ReactNode;
  maxSuggestions?: number;
  showResultsOnActivationCharacter?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  disableEscapeDefault?: boolean;
}) {
  const [textInput, setTextInput] =
    props.inputText !== undefined && props.setInputText
      ? [props.inputText, props.setInputText]
      : useState("");
  const [remainderText, setRemainderText] =
    props.remainderText !== undefined && props.setRemainderText
      ? [props.remainderText, props.setRemainderText]
      : useState("");
  const [isActivated, setIsActivated] = useState(
    !Boolean(props.activationCharacter)
  );
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const constructedInput = props.activationCharacter
    ? isActivated
      ? `${remainderText}${props.activationCharacter}${textInput}`
      : remainderText
    : textInput;

  const inputRef = props.inputRef || useRef<HTMLInputElement>(null);

  const addNewOption = props.addNewOption;

  const formatNewOption =
    props.addNewOptionFormatter || ((s: string) => `Add new option: "${s}"`);

  const matchFunction =
    props.matchFunction ||
    ((o: string, q: string) => o.toLowerCase().startsWith(q.toLowerCase()));

  const displayLabelFn =
    props.displayLabelFn || ((s: string) => <span>{s}</span>);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const maxSuggestions =
    props.maxSuggestions === undefined
      ? 10
      : props.maxSuggestions < 0
      ? undefined
      : props.maxSuggestions;

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
    focusInput();
    setTextInput("");
    setRemainderText(remainderText.trim());
    if (props.activationCharacter) {
      setIsActivated(false);
    }
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
    if (constructedInput.length === 0 && props.selectedOptions.length > 0) {
      props.setSelectedOptions(props.selectedOptions.slice(0, -1));
    }
  };

  const handleEnter = () => {
    if (!showOptions) {
      return;
    }
    if (matchingOptions.length > 0) {
      addOptionToSelected(matchingOptions[selectedSuggestionIndex]);
    } else if (props.allowAddNew && addNewOption) {
      addNewOptionAndSelect();
    }
  };

  const showOptions =
    isActivated &&
    (textInput.length > 0 || props.showResultsOnActivationCharacter);

  const matchingOptions = showOptions
    ? props.options
        .filter(
          (option) =>
            matchFunction(props.labelFunction(option), textInput) &&
            !optionIsSelected(option)
        )
        .slice(0, maxSuggestions)
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

  const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    if (props.activationCharacter) {
      const { matchedActivationChar, relevantText, existingText } =
        matchActivationChar(newText, props.activationCharacter);
      setTextInput(relevantText);
      setRemainderText(existingText);
      setIsActivated(matchedActivationChar);
    } else {
      setTextInput(newText);
    }
  };

  const handleEscape = () => {
    if (!props.disableEscapeDefault) {
      setTextInput("");
      setRemainderText("");
      props.setSelectedOptions([]);
      setIsActivated(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    setSelectedSuggestionIndex(0);
  }, [constructedInput]);

  return (
    <div className={styles.dropdownContainer}>
      <div
        className={combineClasses(
          styles.autocompleteInputContainer,
          isFocused && styles.focused,
          ...(props.inputClasses ? props.inputClasses : [])
        )}
      >
        {props.selectedOptions.length > 0 && !props.hideSelections && (
          <div className={styles.selectedOptionsContainer}>
            {joinNodes(
              props.selectedOptions.map((selectedOption) => (
                <button
                  className={styles.selectedOption}
                  key={props.getOptionId(selectedOption)}
                  onClick={() => removeOption(selectedOption)}
                  style={
                    props.optionStylingFunction &&
                    props.optionStylingFunction(selectedOption)
                  }
                >
                  {displayLabelFn(props.labelFunction(selectedOption))}
                </button>
              )),
              <div className={styles.interTagSpace} />
            )}
          </div>
        )}
        <input
          className={styles.textInput}
          value={constructedInput}
          onChange={handleInputOnChange}
          ref={inputRef}
          onKeyDown={(e) => {
            callbackOnEnter(e, handleEnter);
            callbackOn(e, "Backspace", handleDelete, false);
            callbackOn(e, "ArrowDown", scrollDown, true);
            callbackOn(e, "ArrowUp", scrollUp, true);
            callbackOn(e, "Escape", handleEscape, true);
          }}
          autoFocus={props.autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete="off"
          placeholder={props.placeholder}
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
                className={combineClasses(
                  styles.suggestion,
                  styles.selectedSuggestion
                )}
              >
                {formatNewOption(textInput)}
              </button>
            )}
      </div>
    </div>
  );
}
