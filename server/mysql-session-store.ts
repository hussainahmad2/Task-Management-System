import { Store } from "express-session";
import { pool } from "./db";
import type { RowDataPacket } from "mysql2";

export class MySQLStore extends Store {
    constructor() {
        super();
    }

    get = (sid: string, callback: (err: any, session?: any) => void) => {
        pool.query('SELECT sess FROM sessions WHERE sid = ?', [sid])
            .then(([rows]: any) => {
                if (rows.length) {
                    callback(null, rows[0].sess);
                } else {
                    callback(null, null);
                }
            })
            .catch(err => callback(err));
    }

    set = (sid: string, session: any, callback?: (err?: any) => void) => {
        const expire = session.cookie.expires ? new Date(session.cookie.expires) : new Date(Date.now() + 86400000);
        pool.query('INSERT INTO sessions (sid, sess, expire) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE sess = ?, expire = ?',
            [sid, JSON.stringify(session), expire, JSON.stringify(session), expire])
            .then(() => callback && callback())
            .catch(err => callback && callback(err));
    }

    destroy = (sid: string, callback?: (err?: any) => void) => {
        pool.query('DELETE FROM sessions WHERE sid = ?', [sid])
            .then(() => callback && callback())
            .catch(err => callback && callback(err));
    }
}
