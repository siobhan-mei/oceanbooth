<template>
    <Teleport to="body">
        <div v-if="show" class="confirm-modal-overlay" @click.self="handleCancel">
            <div class="card modal-card p-4 text-center">
                <button
                    class="btn white-button modal-close"
                    aria-label="Close"
                    @click="handleCancel"
                >
                    <CloseIcon />
                </button>
                
                <h5 class="modal-title">{{ title }}</h5>
                <p class="modal-message">
                    <slot>{{ message }}</slot>
                </p>

                <div class="modal-actions">
                    <button class="btn pink-button" @click="handleCancel">
                        {{ cancelText }}
                    </button>
                    <button class="btn pink-button" @click="handleConfirm">
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script>
import CloseIcon from "@components/svgs/CloseIcon.vue";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";

export default {
    name: "ConfirmModal",
    components: {
        CloseIcon
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        return {
            playClickSound,
        }
    },
    props: {
        show: { type: Boolean, default: false },
        title: { type: String, required: true },
        message: { type: String, default: "" },
        cancelText: { type: String, default: "Cancel" },
        confirmText: { type: String, default: "Ok" },
    },
    emits: ["cancel", "confirm"],
    methods: {
        handleCancel() {
            this.playClickSound();
            this.$emit("cancel");
        },
        handleConfirm() {
            this.playClickSound();
            this.$emit("confirm");
        },
    },
};
</script>
<style scoped>
.confirm-modal-overlay {
    position: fixed;
    inset: 0;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
}
.modal-card {
    position: relative;
    width: 320px;
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
.modal-message {
    color: #000000;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}
.modal-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}
</style>