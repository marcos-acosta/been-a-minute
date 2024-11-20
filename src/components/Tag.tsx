import { TagBasic } from "../../triplit/schema";
import { tagToColor } from "../logic/rendering";
import styles from "./Tag.module.css";

export default function Tag({ tag }: { tag: TagBasic }) {
  return (
    <div
      className={styles.tagContainer}
      style={{ backgroundColor: tagToColor(tag) }}
    >
      <span className={styles.grayText}>#</span>
      {tag.name}
    </div>
  );
}
