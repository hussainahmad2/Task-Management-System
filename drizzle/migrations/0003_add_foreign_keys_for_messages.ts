import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { messages } from "../../shared/models/chat";

// This migration adds foreign key constraints that couldn't be added initially due to circular references
export function migrate(db: any) {
  // Add foreign key constraint for reply_to_message_id in messages table
  db.execute(sql`
    ALTER TABLE messages 
    ADD CONSTRAINT fk_messages_reply_to_message 
    FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) 
    ON DELETE SET NULL
  `);

  // Add foreign key constraint for last_read_message_id in chat_room_participants table
  db.execute(sql`
    ALTER TABLE chat_room_participants 
    ADD CONSTRAINT fk_chat_room_participants_last_read_message 
    FOREIGN KEY (last_read_message_id) REFERENCES messages(id) 
    ON DELETE SET NULL
  `);
}

// Note: This is a manual migration approach since DrizzleORM has limitations with circular references
// In a real scenario, you would handle this differently based on your specific DrizzleORM setup