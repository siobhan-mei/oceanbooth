<template>
    <div class="photo-preview">
        <img :src="frameSrc" class="frame" alt="photo frame" />
        <div
            v-for="(slot, index) in slots"
            :key="index"
            class="photo-slot"
            :style="{ top: slot.top, left: slot.left, width: slot.width, height: slot.height, transform: slot.transform }"
        >
            {{ placeholderText }}
        </div>
        <button
            v-if="mode === 'camera'"
            class="btn pink-button camera-button"
            :class="buttonPositionClass"
            :style="{ '--btn-rotation': buttonRotation}"
            aria-label="Snap photo"
            @click="$emit('snap', nextEmptyIndex)"
        >
            <SnapPhoto />
        </button>
    </div>
</template>
<script>
import SnapPhoto from "@components/svgs/SnapPhoto.vue";
import defaultSingleFrame from "@assets/images/photo-editor/frames/default-single-frame.svg";
import defaultDoubleFrame from "@assets/images/photo-editor/frames/default-double-frame.svg";
import defaultTripleFrame from "@assets/images/photo-editor/frames/default-triple-frame.svg";
import { useTemplateSlots } from "@composables/useTemplateSlots";

const TEMPLATE_CONFIG = {
    1: { frame: defaultSingleFrame, buttonClass: "camera-button--single", rotation: "0deg" },
    2: { frame: defaultDoubleFrame, buttonClass: "camera-button--double", rotation: "8deg" },
    3: { frame: defaultTripleFrame, buttonClass: "camera-button--triple", rotation: "-8deg" },
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
    },
    emits: ["snap"],
    computed: {
        nextEmptyIndex() {
            const index = this.photos.findIndex((p) => !p);
            return index === 1 ? this.photos.length : index;
        },
        frameSrc() {
            return TEMPLATE_CONFIG[this.templateId]?.frame ?? defaultSingleFrame;
        },
        buttonPositionClass() {
            return TEMPLATE_CONFIG[this.templateId]?.buttonClass ?? "camera-button--single";
        },
        slots() {
            return useTemplateSlots(this.templateId);
        },
        placeholderText() {
            return this.mode === "camera"
            ? "Click to access camera"
            : "Click to upload image";
        },
        buttonRotation() {
            return TEMPLATE_CONFIG[this.templateId]?.rotation ?? "0deg";
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
    height: 50px;
}
.camera-button--single {
    bottom: 28%;
    right: 44%;
}
.camera-button--double {
    bottom: 13%;
    right: 32%;
    transform: rotate(var(--btn-rotation, 0deg));
}
.camera-button--double:active {
    transform: translateY(4px) rotate(var(--btn-rotation, 0deg));
    box-shadow: none;
}
.camera-button--triple {
    bottom: 57%;
    right: 66%;
    transform: rotate(var(--btn-rotation, 0deg));
}
.camera-button--triple:active {
    transform: translateY(4px) rotate(var(--btn-rotation, 0deg));
    box-shadow: none;
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
    padding: 6px;
    box-sizing: border-box;
}
</style>
