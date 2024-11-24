import { ClientSchema, Entity, Schema as S } from "@triplit/client";

export const schema = {
  friends: {
    schema: S.Schema({
      id: S.Id(),
      created_at: S.Date({ default: S.Default.now() }),
      first_name: S.String(),
      last_name: S.Optional(S.String()),
      relation: S.Optional(S.String()),
      long_distance: S.Boolean({ default: false }),
      max_time_between_contact: S.Optional(
        S.Record({
          amount: S.Number(),
          unit: S.String({
            enum: ["day", "week", "month", "year"] as const,
          }),
        })
      ),
      tag_ids: S.Set(S.String()),
      tags: S.RelationMany("tags", {
        where: [["id", "in", "$tag_ids"]],
      }),
      meetings: S.RelationMany("friend_log", {
        where: [["friend_ids", "has", "$id"]],
      }),
    }),
  },
  friend_log: {
    schema: S.Schema({
      id: S.Id(),
      created_at: S.Date({ default: S.Default.now() }),
      friend_ids: S.Set(S.String()),
      date_contacted: S.Date(),
      notes: S.Optional(S.String()),
      friends: S.RelationMany("friends", {
        where: [["id", "in", "$friend_ids"]],
      }),
    }),
  },
  tags: {
    schema: S.Schema({
      id: S.Id(),
      created_at: S.Date({ default: S.Default.now() }),
      name: S.String(),
      tagged_friends: S.RelationMany("friends", {
        where: [["tag_ids", "has", "$id"]],
      }),
    }),
  },
} satisfies ClientSchema;

export type FriendBasic = Entity<typeof schema, "friends">;
export type TagBasic = Entity<typeof schema, "tags">;
export type HangBasic = Entity<typeof schema, "friend_log">;
export type TimeUnit = "day" | "week" | "month" | "year";

export interface Friend extends FriendBasic {
  meetings: HangBasic[];
  tags: TagBasic[];
}
export interface FriendToSubmit
  extends Omit<FriendBasic, "id" | "created_at"> {}

export interface HangToSubmit extends Omit<HangBasic, "id" | "created_at"> {}

export interface Tag extends TagBasic {
  tagged_friends: FriendBasic[];
}
