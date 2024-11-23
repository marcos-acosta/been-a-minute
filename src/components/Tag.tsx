import { TagBasic } from "../../triplit/schema";
import { tagToColor } from "../logic/rendering";
import styles from "./Tag.module.css";

export default function Tag({ tag }: { tag: TagBasic }) {
  return (
    <div
      className={styles.tagContainer}
      style={{ backgroundColor: tagToColor(tag) }}
    >
      {tag.name}
    </div>
  );
}
