export const EDITOR_FRAMES = [
    { id: 'editor-frame-1', thumbnail: null, name: 'First'},
    { id: 'editor-frame-2', thumbnail: null, name: 'Second'},
    { id: 'editor-frame-3', thumbnail: null, name: 'Third'},
];
export const EDITOR_STICKERS = Array.from({ length: 10 }, (_, i) => ({
    id: `sticker-${i + 1}`,
    thumbnail: null,
    name: `Sticker ${i + 1}`,
}));