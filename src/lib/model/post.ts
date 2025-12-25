import * as v from 'valibot';

export const postFields = {
    id: {
        form_label: 'ID',
        sql: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        valibot: v.pipe(v.number('ID ต้องเป็นตัวเลข'), v.integer('ID ต้องเป็นจำนวนเต็ม'))
    },
    title: {
        form_label: 'ชื่อเรื่อง',
        sql: 'VARCHAR(255) NOT NULL',
        valibot: v.pipe(
            v.string('ชื่อเรื่องต้องเป็นข้อความ'),
            v.minLength(1, 'กรุณากรอกชื่อเรื่อง'),
            v.maxLength(255, 'ชื่อเรื่องต้องไม่เกิน 255 ตัวอักษร')
        )
    },
    slug: {
        form_label: 'ชื่อบน URL',
        sql: 'VARCHAR(255) NOT NULL',
        valibot: v.pipe(
            v.string('ชื่อบน URL ต้องเป็นข้อความ'),
            v.minLength(1, 'กรุณากรอกชื่อบน URL'),
            v.maxLength(255, 'ชื่อบน URL ต้องไม่เกิน 255 ตัวอักษร'),
            v.regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                'ชื่อบน URL ต้องเป็นตัวพิมพ์เล็ก ใช้ตัวเลข และขีด (-) เท่านั้น'
            )
        )
    },
    content: {
        form_label: 'เนื้อหา',
        sql: 'TEXT NOT NULL',
        valibot: v.pipe(v.string('เนื้อหาต้องเป็นข้อความ'), v.minLength(1, 'กรุณากรอกเนื้อหา'))
    },
    created_at: {
        form_label: 'สร้างเมื่อ',
        sql: "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))",
        valibot: v.pipe(
            v.string('วันที่สร้างต้องเป็นข้อความ'),
            v.isoTimestamp('วันที่สร้างต้องอยู่ในรูปแบบเวลา ISO')
        )
    },

    updated_at: {
        form_label: 'แก้ไขเมื่อ',
        sql: "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))",
        valibot: v.pipe(
            v.string('วันที่แก้ไขต้องเป็นข้อความ'),
            v.isoTimestamp('วันที่แก้ไขต้องอยู่ในรูปแบบเวลา ISO')
        )
    }
} as const;
