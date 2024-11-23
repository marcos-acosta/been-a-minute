import { Friend, TagBasic } from "../../triplit/schema";
import { addAllFriends, addAllHangs, addAllTags } from "../logic/dev";

interface DevProps {
  friends: Friend[];
  tags: TagBasic[];
}

export default function Dev(props: DevProps) {
  return (
    <div>
      <button onClick={() => addAllFriends(props.friends)}>
        add all friends
      </button>
      <button onClick={() => addAllHangs(props.friends)}>add all hangs</button>
      <button onClick={() => addAllTags(props.tags)}>add all tags</button>
    </div>
  );
}
