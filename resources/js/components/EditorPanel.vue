<template>
    <div class="main-panel">
        <button class="btn blue-button">
            <PreviewButton class= "me-1" /> Preview here
        </button>

        <OptionGrid 
        class="option-grid"
        title="Frames"
        :items="EDITOR_FRAMES"
        />

        <OptionGrid 
        title="Filters"
        :items="EDITOR_FRAMES"
        />

        <OptionGrid 
        title="Stickers"
        :items="EDITOR_STICKERS"
        scrollable
        />

        <p class="datestamp-text">Add datestamp to images</p>
    </div>
</template>

<script>
import { EDITOR_FRAMES, EDITOR_STICKERS } from "@/config/editorFrames.js";
import OptionGrid from "@components/editor/OptionGrid.vue";
import PreviewButton from "@components/svgs/PreviewButton.vue";

export default {
    name: "EditorPanel",
    components: {
        OptionGrid,
        PreviewButton,
    },
    data() {
        return{
            EDITOR_FRAMES, EDITOR_STICKERS
        };
    }
}
</script>

<style scoped>
.main-panel{
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 350px;
    height: 570px;
    padding: 40px;
    border: 1px solid black;
    box-shadow: 0 6px 0px rgba(0, 0, 0, 0.319);
    border-radius: 20px;
    background: var(--color-main-container, #e6f6f8);
    flex-shrink: 0;
    margin-left: 25px;
}
.btn.blue-button {
    align-self: flex-end;
}
.datestamp-text {
    margin-top: 10px;
    font-size: 0.90rem;
}
</style>