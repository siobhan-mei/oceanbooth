<template>
    <div class="main-panel">
        <button class="btn blue-button">
            <PreviewButton class= "me-1" /> Preview here
        </button>
    </div>
</template>

<script>
import PreviewButton from "@components/svgs/PreviewButton.vue";

export default {
    name: "EditorPanel",
    components: {
        PreviewButton,
    }
}
</script>

<style scoped>
.main-panel{
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 390px;
    height: 450px;
    padding: 40px;
    border: 1px solid black;
    box-shadow: 0 6px 0px rgba(0, 0, 0, 0.319);
    border-radius: 20px;
    background: var(--color-main-container, #e6f6f8);
    flex-shrink: 0;
    margin-left: 25px;
}
.btn.blue-button{
    align-self: flex-end;
}

</style>