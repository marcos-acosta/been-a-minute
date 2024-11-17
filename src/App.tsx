import { useState } from "react";
import useKeyboardControl, { KeyboardHook } from "react-keyboard-control";
import MainPage from "./components/MainPage";

export enum PageState {
  FRIEND_LIST,
  ADD_A_FRIEND,
  RECORD_A_HANG,
  EDIT_FRIEND,
}

export default function App() {
  const [pageState, setPageState] = useState(PageState.FRIEND_LIST);

  const switchToAddFriendForm = () => setPageState(PageState.ADD_A_FRIEND);
  const switchToRecordHangForm = () => setPageState(PageState.RECORD_A_HANG);
  const switchToFriendList = () => setPageState(PageState.FRIEND_LIST);

  const keyboardHooks: KeyboardHook[] = [
    {
      keyboardEvent: [{ key: "f" }],
      callback: switchToAddFriendForm,
      allowWhen: pageState === PageState.FRIEND_LIST,
      preventDefault: true,
    },
    {
      keyboardEvent: [{ key: "h" }],
      callback: switchToRecordHangForm,
      allowWhen: pageState === PageState.FRIEND_LIST,
      preventDefault: true,
    },
    {
      keyboardEvent: [{ key: "Escape" }],
      callback: switchToFriendList,
      allowWhen: pageState !== PageState.FRIEND_LIST,
    },
  ];
  useKeyboardControl(keyboardHooks);

  return <MainPage pageState={pageState} setPageState={setPageState} />;
}
