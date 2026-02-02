import { mysqlTable, int, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Create the messaging system tables in the correct order to avoid foreign key issues
export function migrate(db: any) {
  // 1. User Contacts Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      contact_id VARCHAR(255) NOT NULL,
      nickname VARCHAR(255),
      is_blocked BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (contact_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_contact (user_id, contact_id)
    )
  `);

  // 2. Chat Rooms Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS chat_rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      type ENUM('private', 'group', 'broadcast') DEFAULT 'private',
      avatar_url VARCHAR(255),
      description TEXT,
      created_by VARCHAR(255),
      is_archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // 3. Chat Room Participants Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS chat_room_participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_room_id INT NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      role ENUM('admin', 'member') DEFAULT 'member',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_read_message_id INT,
      FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_participant (chat_room_id, user_id)
    )
  `);

  // 4. Enhanced Messages Table - add new columns
  db.execute(sql`
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS chat_room_id INT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type ENUM('text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'contact') DEFAULT 'text';
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url VARCHAR(255);
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_type VARCHAR(50);
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_size INT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS duration INT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_message_id INT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_for_everyone BOOLEAN DEFAULT FALSE;
  `);

  // 5. Add foreign key constraints after columns are added
  db.execute(sql`
    ALTER TABLE messages ADD FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE;
    -- Self-referencing foreign key added separately due to circular dependency
  `);

  // 6. Message Reactions Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS message_reactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message_id INT NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      emoji VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_reaction (message_id, user_id, emoji)
    )
  `);

  // 7. Message Status Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS message_status (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message_id INT NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
      delivered_at TIMESTAMP NULL,
      read_at TIMESTAMP NULL,
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_message_status (message_id, user_id)
    )
  `);

  // 8. Voice/Video Calls Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS calls (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_room_id INT,
      caller_id VARCHAR(255) NOT NULL,
      callee_id VARCHAR(255),
      call_type ENUM('voice', 'video') NOT NULL,
      status ENUM('initiated', 'ringing', 'connected', 'ended', 'missed', 'rejected') DEFAULT 'initiated',
      duration INT DEFAULT 0,
      started_at TIMESTAMP NULL,
      ended_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (caller_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (callee_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 9. Meetings Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS meetings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      chat_room_id INT,
      organizer_id VARCHAR(255) NOT NULL,
      scheduled_for TIMESTAMP NOT NULL,
      duration INT NOT NULL,
      meeting_link VARCHAR(255),
      status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 10. Meeting Participants Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS meeting_participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      meeting_id INT NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      status ENUM('invited', 'accepted', 'declined', 'attended') DEFAULT 'invited',
      joined_at TIMESTAMP NULL,
      left_at TIMESTAMP NULL,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 11. Sticker Packs Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS sticker_packs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      creator_id VARCHAR(255),
      is_public BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // 12. Stickers Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS stickers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pack_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      emoji VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pack_id) REFERENCES sticker_packs(id) ON DELETE CASCADE
    )
  `);

  // 13. User Sticker Packs Table
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_sticker_packs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      pack_id INT NOT NULL,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (pack_id) REFERENCES sticker_packs(id) ON DELETE CASCADE
    )
  `);

  // 14. Add indexes for better performance
  db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_messages_chat_room_created ON messages(chat_room_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
    CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
    CREATE INDEX IF NOT EXISTS idx_calls_chat_room ON calls(chat_room_id);
    CREATE INDEX IF NOT EXISTS idx_meetings_scheduled ON meetings(scheduled_for);
  `);

  // 15. Add the self-referencing foreign key for reply_to_message_id
  db.execute(sql`
    ALTER TABLE messages ADD FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) ON DELETE SET NULL;
    ALTER TABLE chat_room_participants ADD FOREIGN KEY (last_read_message_id) REFERENCES messages(id) ON DELETE SET NULL;
  `);
}