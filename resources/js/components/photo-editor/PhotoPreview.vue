<template>
    <div class="photo-preview"
    @pointerdown="$emit('select-sticker', null)">
        <h3
            :class="headerPositionClass"
        >
            OceanBooth
        </h3>
        <img :src="frameSrc" class="frame" alt="photo frame" />
        <div
            v-for="(slot, index) in slots"
            :key="index"
            class="photo-slot"
            :class="{ 'photo-slot--filled': photos[index] }"
            :style="{ top: slot.top, left: slot.left, width: slot.width, height: slot.height, transform: slot.transform }"
            @click="$emit('snap', index)"
        >
            <div v-if="isLiveSlot(index)" class="video-wrapper">
                <video :ref="setVideoRef" class="live-video" autoplay playsinline muted />
                <div v-if="countdown > 0" class="countdown-overlay">{{ countdown }}</div>
            </div>
            <img v-else-if="photos[index]" :src="photos[index]" class="uploaded-photo" alt="uploaded photo" />
            <span v-else>{{ emptySlotPlaceholderText }}</span>

            <div v-if="photos[index]" class="photo-slot-overlay">
                <button class="btn pink-button" @click.stop="$emit('snap', index)">
                    {{filledSlotPlaceholderText}}
                </button>
            </div>
        </div> 
        <button
            v-if="mode === 'camera' && nextEmptyIndex < photos.length && !isRetaking"
            class="btn pink-button camera-button"
            :class="buttonPositionClass"
            :disabled="!cameraReady || isCapturing"
            aria-label="Snap photo"
            @click="$emit('start-capture')"
        >
            <SnapPhoto style="margin-right: 4px"/> Snap
        </button>

        <div
            v-for="s in placedStickers"
            :key="s.uid"
            class="placed-sticker"
            :class="{ 'placed-sticker--selected': s.uid === selectedStickerId }"
            :style="{ left: s.x + '%', top: s.y + '%', width: (s.size || 80) + 'px' }"
            @pointerdown.stop="startDrag(s, $event)"
        >
            <img :src="s.src" draggable="false" alt="sticker" />
            <template v-if="s.uid === selectedStickerId">
                <div
                    v-for="corner in ['tl', 'tr', 'bl', 'br']"
                    :key="corner"
                    class="resize-handle"
                    :class="['resize-handle--corner', `resize-handle--${corner}`]"
                    @pointerdown.stop="startResize(s, $event)"
                />
            </template>
        </div>
    </div>
</template>
<script>
import SnapPhoto from "@components/svgs/SnapPhoto.vue";
import defaultSingleFrame from "@assets/images/photo-editor/frames/default-single-frame.svg";
import defaultDoubleFrame from "@assets/images/photo-editor/frames/default-double-frame.svg";
import defaultTripleFrame from "@assets/images/photo-editor/frames/default-triple-frame.svg";
import { useTemplateSlots } from "@composables/useTemplateSlots";

const TEMPLATE_CONFIG = {
    1: { frame: defaultSingleFrame, buttonClass: "camera-button--single", headerClass: "header--single" },
    2: { frame: defaultDoubleFrame, buttonClass: "camera-button--double", headerClass: "header--double" },
    3: { frame: defaultTripleFrame, buttonClass: "camera-button--triple", headerClass: "header--triple" },
};

export default {    
    name: "PhotoPreview",
    components: {
        SnapPhoto,
    },
    props: {
        templateId: {
            type: Number,
            required: true,
        },
        mode: {
            type: String,
            required: true,
            validator: (v) => ["camera", "upload"].includes(v),
        },
        photos: {
            type: Array,
            default: () => [],
        },
        cameraReady: {
            type: Boolean,
            default: false,
        },
        activeSlotIndex: {
            type: Number,
            default: null,
        },
        countdown: {
            type: Number,
            default: 0,
        },
        isCapturing: {
            type: Boolean,
            default: false,
        },
        isRetaking: {
            type: Boolean,
            default: false,
        },
        placedStickers: {            
            type: Array,
            default: () => [],
        },
        selectedStickerId: { 
            type: String, 
            default: null,
        },
    },
    emits: ["snap", "start-capture", "video-ref", "move-sticker", "select-sticker", "resize-sticker"],
    methods: {
        isLiveSlot(index) {
            return this.mode === "camera"
                && this.cameraReady
                && index === this.activeSlotIndex
                && !this.photos[index];
        },
        setVideoRef(el) {
            this.$emit("video-ref", el);
        },
        startDrag(sticker, event) {
            event.preventDefault();
            this.$emit("select-sticker", sticker.uid);
            const container = this.$el.getBoundingClientRect();
            const onMove = (e) => {
                const x = ((e.clientX - container.left) / container.width) * 100;
                const y = ((e.clientY - container.top) / container.height) * 100;
                this.$emit("move-sticker", sticker.uid, { x, y });
            };
            const onUp = () => {
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
            };
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        },
        startResize(sticker, event) {
            event.preventDefault();
            const container = this.$el.getBoundingClientRect();
            const centerX = container.left + (sticker.x / 100) * container.width;
            const centerY = container.top + (sticker.y / 100) * container.height;
            const initialDist = Math.hypot(event.clientX - centerX, event.clientY - centerY);
            const initialSize = sticker.size || 80;

            const onMove = (e) => {
                const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
                const newSize = Math.min(200, Math.max(30, initialSize * (dist / initialDist)));
                this.$emit("resize-sticker", sticker.uid, newSize);
            };
            const onUp = () => {
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
            };
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        }
    },
    computed: {
        nextEmptyIndex() {
            const index = this.photos.findIndex((p) => !p);
            return index === -1 ? this.photos.length : index;
        },
        frameSrc() {
            return TEMPLATE_CONFIG[this.templateId]?.frame ?? defaultSingleFrame;
        },
        buttonPositionClass() {
            return TEMPLATE_CONFIG[this.templateId]?.buttonClass ?? "camera-button--single";
        },
        headerPositionClass() {
            return TEMPLATE_CONFIG[this.templateId]?.headerClass ?? "header--single";
        },
        slots() {
            return useTemplateSlots(this.templateId);
        },
        emptySlotPlaceholderText() {
            return this.mode === "camera"
            ? "Click to access camera"
            : "Click to upload image";
        },
        filledSlotPlaceholderText() {
            return this.mode === "camera"
            ? "Re-snap"
            : "Re-upload";
        },
    },
};
</script>
<style scoped>
.photo-preview {
    position: relative;
    width: 440px;
}
.frame {
    display: block;
    width: 100%;
    height: auto;
}
.camera-button {
    position: absolute;
    height: 45px;
    z-index: var(--z-controls);
}
.camera-button:disabled {
    background: #d8d8d8;
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
}
.camera-button--single {
    bottom: 23%;
    right: 40%;
}
.camera-button--double {
    bottom: 36%;
    right: 63%;
}
.camera-button--triple {
    bottom: 50%;
    right: 63%;
}
.header--single {
    font-family: var(--font-cursive);
    position: absolute;
    top: 23%;
    left: 50%;
    transform: translateX(-50%);
}
.header--double {
    font-family: var(--font-cursive);
    position: absolute;
    top: 40%;
    left: 72%;
    transform: rotate(7.8deg)
}
.header--triple {
    font-family: var(--font-cursive);
    position: absolute;
    top: 27%;
    left: 72%;
    transform: rotate(7.5deg)
}
.photo-slot {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 0.75rem;
    color: #999;
    border: 1px dashed #aaa;
    box-sizing: border-box;
    z-index: 1;
}
.photo-slot-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
}
.photo-slot--filled:hover .photo-slot-overlay {
    opacity: 1;
    pointer-events: auto;
}
.video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.countdown-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
}
.live-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
}
.uploaded-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.placed-sticker {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: grab;
    z-index: var(--z-sticker);
}
.placed-sticker img { 
    width: 100%;
    pointer-events: none; 
}
.placed-sticker--selected {
    outline: 1.5px solid black;
    outline-offset: 4px;
}
.resize-handle {
    position: absolute;
    z-index: var(--z-sticker-handle);
    background: white;
    border: 1.5px solid black;
}
.resize-handle--corner {
    width: 11px;
    height: 11px;
    border-color: black;
}
.resize-handle--tl { top: -10px; left: -10px; cursor: nwse-resize; }
.resize-handle--tr { top: -10px; right: -10px; cursor: nesw-resize; }
.resize-handle--bl { bottom: -10px; left: -10px; cursor: nesw-resize; }
.resize-handle--br { bottom: -10px; right: -10px; cursor: nwse-resize; }

.resize-handle--top, .resize-handle--bottom {
    left: 50%; transform: translateX(-50%);
    cursor: ns-resize;
}
.resize-handle--left, .resize-handle--right {
    width: 6px; height: 16px; top: 50%; transform: translateY(-50%); cursor: ew-resize;
}
.resize-handle--top { top: -3px; }
.resize-handle--bottom { bottom: -3px; }
.resize-handle--left { left: -3px; }
.resize-handle--right { right: -3px; }
</style>
