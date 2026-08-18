<template>
    <div class="option-grid">
        <p class="option-grid-title">{{ title }}</p>
        <div class="option-grid-boxes">
            <button
                v-for="item in items"
                :key="item.id"
                class="option-box"
            >
                <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.name" />
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OptionGrid",
        props: {
            title: { type: String, required: true },
            items: { type: Array, required: true },
            selectedId: { type: [String, Number], default: null},
        },
        emits: ["select"],
    }
</script>

<style scoped>
.option-grid-boxes {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}
.option-box {
    flex: 1;
    aspect-ratio: 1/1;
    background: var(--color-secondary-container, #c8e6ea);
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    
}
.option-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.option-box:hover {
    border-color: black;
}
.option-box--selected {
    outline: 2px solid var(--color-primary-btn, #ffe5eb);
    outline-offset: 2px;
}
</style>