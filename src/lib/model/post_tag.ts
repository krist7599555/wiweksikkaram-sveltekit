import * as v from 'valibot';

export const postTagFields = {
    post_id: {
        form_label: 'โพสต์',
        sql: 'INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE',
        valibot: v.pipe(
            v.number('รหัสโพสต์ต้องเป็นตัวเลข'),
            v.integer('รหัสโพสต์ต้องเป็นจำนวนเต็ม'),
            v.minValue(1, 'กรุณาระบุโพสต์')
        )
    },
    tag_id: {
        form_label: 'แท็ก',
        sql: 'INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE',
        valibot: v.pipe(
            v.number('รหัสแท็กต้องเป็นตัวเลข'),
            v.integer('รหัสแท็กต้องเป็นจำนวนเต็ม'),
            v.minValue(1, 'กรุณาระบุแท็ก')
        )
    },
    created_at: {
        form_label: 'เชื่อมเมื่อ',
        sql: "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))",
        valibot: v.pipe(
            v.string('วันที่เชื่อมต้องเป็นข้อความ'),
            v.isoTimestamp('วันที่เชื่อมต้องอยู่ในรูปแบบเวลา ISO')
        )
    }
} as const;
