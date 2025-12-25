import * as v from 'valibot';

export const tagFields = {
    id: {
        form_label: 'ID',
        sql: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        valibot: v.pipe(v.number('ID ต้องเป็นตัวเลข'), v.integer('ID ต้องเป็นจำนวนเต็ม'))
    },
    name: {
        form_label: 'ชื่อแท็ก',
        sql: 'VARCHAR(100) NOT NULL UNIQUE',
        valibot: v.pipe(
            v.string('ชื่อแท็กต้องเป็นข้อความ'),
            v.minLength(1, 'กรุณากรอกชื่อแท็ก'),
            v.maxLength(100, 'ชื่อแท็กต้องไม่เกิน 100 ตัวอักษร')
        )
    },
    slug: {
        form_label: 'slug',
        sql: 'VARCHAR(100) NOT NULL UNIQUE',
        valibot: v.pipe(
            v.string('slug ต้องเป็นข้อความ'),
            v.minLength(1, 'กรุณากรอก slug'),
            v.maxLength(100, 'slug ต้องไม่เกิน 100 ตัวอักษร'),
            v.regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                'slug ต้องเป็นตัวพิมพ์เล็ก ใช้ตัวเลข และขีด (-) เท่านั้น'
            )
        )
    },
    created_at: {
        form_label: 'สร้างเมื่อ',
        sql: "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))",
        valibot: v.pipe(
            v.string('วันที่สร้างต้องเป็นข้อความ'),
            v.isoTimestamp('วันที่สร้างต้องอยู่ในรูปแบบเวลา ISO')
        )
    }
} as const;
