import { mysqlTable, int, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// User contacts table
export const userContacts = mysqlTable("user_contacts", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  contactId: varchar("contact_id", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 255 }),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat rooms table
export const chatRooms = mysqlTable("chat_rooms", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 20, enum: ["private", "group", "broadcast"] }).default("private"),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  description: text("description"),
  createdById: varchar("created_by", { length: 255 }),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Updated messages table with enhanced features
export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  chatRoomId: int("chat_room_id").notNull().references(() => chatRooms.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  messageType: varchar("message_type", { length: 20, enum: ["text", "image", "video", "audio", "document", "sticker", "location", "contact"] }).default("text"),
  content: text("content"),
  mediaUrl: varchar("media_url", { length: 255 }),
  mediaType: varchar("media_type", { length: 50 }),
  fileSize: int("file_size"),
  duration: int("duration"), // for audio/video
  replyToMessageId: int("reply_to_message_id"),
  isEdited: boolean("is_edited").default(false),
  isDeleted: boolean("is_deleted").default(false),
  deletedForEveryone: boolean("deleted_for_everyone").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Chat room participants table
export const chatRoomParticipants = mysqlTable("chat_room_participants", {
  id: int("id").primaryKey().autoincrement(),
  chatRoomId: int("chat_room_id").notNull().references(() => chatRooms.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  role: varchar("role", { length: 20, enum: ["admin", "member"] }).default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastReadMessageId: int("last_read_message_id"),
});

// Message reactions table
export const messageReactions = mysqlTable("message_reactions", {
  id: int("id").primaryKey().autoincrement(),
  messageId: int("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Message status table
export const messageStatus = mysqlTable("message_status", {
  id: int("id").primaryKey().autoincrement(),
  messageId: int("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 20, enum: ["sent", "delivered", "read"] }).default("sent"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
});

// Calls table
export const calls = mysqlTable("calls", {
  id: int("id").primaryKey().autoincrement(),
  chatRoomId: int("chat_room_id").references(() => chatRooms.id, { onDelete: "cascade" }),
  callerId: varchar("caller_id", { length: 255 }).notNull(),
  calleeId: varchar("callee_id", { length: 255 }),
  callType: varchar("call_type", { length: 10, enum: ["voice", "video"] }).notNull(),
  status: varchar("status", { length: 20, enum: ["initiated", "ringing", "connected", "ended", "missed", "rejected"] }).default("initiated"),
  duration: int("duration").default(0),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meetings table
export const meetings = mysqlTable("meetings", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  chatRoomId: int("chat_room_id").references(() => chatRooms.id, { onDelete: "cascade" }),
  organizerId: varchar("organizer_id", { length: 255 }).notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  duration: int("duration").notNull(), // in minutes
  meetingLink: varchar("meeting_link", { length: 255 }),
  status: varchar("status", { length: 20, enum: ["scheduled", "ongoing", "completed", "cancelled"] }).default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Meeting participants table
export const meetingParticipants = mysqlTable("meeting_participants", {
  id: int("id").primaryKey().autoincrement(),
  meetingId: int("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 20, enum: ["invited", "accepted", "declined", "attended"] }).default("invited"),
  joinedAt: timestamp("joined_at"),
  leftAt: timestamp("left_at"),
});

// Sticker packs table
export const stickerPacks = mysqlTable("sticker_packs", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  creatorId: varchar("creator_id", { length: 255 }),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Stickers table
export const stickers = mysqlTable("stickers", {
  id: int("id").primaryKey().autoincrement(),
  packId: int("pack_id").notNull().references(() => stickerPacks.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User sticker packs table
export const userStickerPacks = mysqlTable("user_sticker_packs", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  packId: int("pack_id").notNull().references(() => stickerPacks.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Notifications table - For system notifications (messages, activity, etc.)
export const notifications = mysqlTable("notifications", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 50, enum: ["message", "mention", "call", "meeting", "activity", "system"] }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  relatedId: varchar("related_id", { length: 255 }),
  relatedType: varchar("related_type", { length: 50 }),
  isRead: boolean("is_read").default(false),
  actionUrl: varchar("action_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

// Schemas for Zod validation
export const insertUserContactSchema = createInsertSchema(userContacts).omit({
  id: true,
  createdAt: true,
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatRoomParticipantSchema = createInsertSchema(chatRoomParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageReactionSchema = createInsertSchema(messageReactions).omit({
  id: true,
  createdAt: true,
});

export const insertMessageStatusSchema = createInsertSchema(messageStatus).omit({
  id: true,
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  createdAt: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMeetingParticipantSchema = createInsertSchema(meetingParticipants).omit({
  id: true,
});

export const insertStickerPackSchema = createInsertSchema(stickerPacks).omit({
  id: true,
  createdAt: true,
});

export const insertStickerSchema = createInsertSchema(stickers).omit({
  id: true,
  createdAt: true,
});

export const insertUserStickerPackSchema = createInsertSchema(userStickerPacks).omit({
  id: true,
  addedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

// Type exports
export type UserContact = typeof userContacts.$inferSelect;
export type InsertUserContact = z.infer<typeof insertUserContactSchema>;

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;

export type ChatRoomParticipant = typeof chatRoomParticipants.$inferSelect;
export type InsertChatRoomParticipant = z.infer<typeof insertChatRoomParticipantSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type MessageReaction = typeof messageReactions.$inferSelect;
export type InsertMessageReaction = z.infer<typeof insertMessageReactionSchema>;

export type MessageStatus = typeof messageStatus.$inferSelect;
export type InsertMessageStatus = z.infer<typeof insertMessageStatusSchema>;

export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export type MeetingParticipant = typeof meetingParticipants.$inferSelect;
export type InsertMeetingParticipant = z.infer<typeof insertMeetingParticipantSchema>;

export type StickerPack = typeof stickerPacks.$inferSelect;
export type InsertStickerPack = z.infer<typeof insertStickerPackSchema>;

export type Sticker = typeof stickers.$inferSelect;
export type InsertSticker = z.infer<typeof insertStickerSchema>;

export type UserStickerPack = typeof userStickerPacks.$inferSelect;
export type InsertUserStickerPack = z.infer<typeof insertUserStickerPackSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
