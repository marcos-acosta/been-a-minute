import { TagBasic } from "../../triplit/schema";
import { tagToColor } from "../logic/rendering";
import { combineClasses } from "../logic/util";
import styles from "./Tag.module.css";

interface TagProps {
  tag: TagBasic;
  styleClasses?: string[];
}

export default function Tag(props: TagProps) {
  return (
    <div
      className={combineClasses(
        ...[styles.tagContainer, ...(props.styleClasses || [])]
      )}
      style={{ backgroundColor: tagToColor(props.tag) }}
    >
      {props.tag.name}
    </div>
  );
}
