<template>
    <Teleport to="body">
        <div v-if="show" class="cropper-modal-overlay">
            <div class="card modal-card p-4 text-center">
                <button
                    class="btn white-button modal-close"
                    aria-label="Close"
                    @click="handleCancel"
                >
                <CloseButton />
            </button>

            <h5 class="modal-title">Crop your photo</h5>
            <p class="modal-subtitle">Drag to reposition, resize the corners to zoom!</p>

            <div class="cropper-wrapper">
                <Cropper
                    v-if="src"
                    ref="cropperRef" 
                    class="cropper"
                    :src="src"
                    :stencil-props="{ aspectRatio: 1 / 1 }"
                />
            </div>

            <div class="modal-actions">
                <button class="btn pink-button reset-button" @click="handleReset">
                    <ResetButton />
                </button>
                <button class="btn pink-button" @click="handleCancel">
                    Cancel
                </button>
                <button class="btn pink-button" @click="handleConfirm">
                    Crop and upload
                </button>
            </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import CloseButton from "@components/svgs/CloseButton.vue";
import ResetButton from "@components/svgs/ResetButton.vue";

export default {
    name: "PhotoCropperModal",
    components: {
        Cropper,
        CloseButton,
        ResetButton,
    },
    props: {
        show: { type: Boolean, default: false },
        src: { type: String, default: null },
    },
    emits: ["cancel", "confirm"],
    methods: {
        handleReset() {
            this.$refs.cropperRef?.reset();
        },
        handleCancel() {
            this.$emit("cancel");
        },
        handleConfirm() {
            const result = this.$refs.cropperRef.getResult();
            if (!result?.canvas) return;
            const dataUrl = result.canvas.toDataURL("image/jpeg", 0.9);
            this.$emit("confirm", dataUrl);
        },
    },
};
</script>

<style scoped>
.cropper-modal-overlay {
    position: fixed;
    inset: 0;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
}
.modal-card {
    position: relative;
    width: 420px;
    border-radius: 20px;
    border: 1px solid black;
    box-shadow: 0 4px 0px rgba(0, 0, 0, 0.319);
    background: var(--color-secondary-btn, #ffffff);
}
.modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 40%;
}
.modal-title {
    font-family: "Cardo", serif;
    font-weight: 700;
    margin-top: 10px;
}
.modal-subtitle {
    color: #000000;
    font-size: 0.9rem;
    margin: 0 0 1.5rem;
}
.cropper-wrapper {
    margin: 0 0 1.5rem; 
}
.cropper {
    height: 320px;
    background: #ddd;
}
.modal-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}
.reset-button {
    margin-right: 78px;
    width: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}   
</style>