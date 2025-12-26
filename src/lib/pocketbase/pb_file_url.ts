import { PUBLIC_PB_URL } from '$env/static/public';

export const getFileUrl = (
    record: { id: string; collectionName?: string; collectionId?: string },
    filename: string,
    opt: { token?: string } = {}
) => {
    return [
        PUBLIC_PB_URL,
        '/api/files/',
        encodeURIComponent(record.collectionName || record.collectionId || ''),
        '/',
        encodeURIComponent(record.id),
        '/',
        encodeURIComponent(filename),
        '?token=',
        encodeURIComponent(opt.token || '')
    ].join('');
};
