//Frames
export const EDITOR_FRAMES = [
    { id: 'editor-frame-1', thumbnail: null, name: 'First'},
    { id: 'editor-frame-2', thumbnail: null, name: 'Second'},
    { id: 'editor-frame-3', thumbnail: null, name: 'Third'},
];
//Stickers
const stickerModules = import.meta.glob(
    "@assets/images/photo-editor/stickers/*.svg",
    { eager: true, import: "default" }
);

const stickerThumbnails = Object.keys(stickerModules)
    .sort()
    .map((path) => stickerModules[path]);

export const EDITOR_STICKERS = stickerThumbnails.map((thumbnail, i) => ({
    id: `sticker-${i + 1}`,
    thumbnail,
    name: `Sticker ${i + 1}`,
}));