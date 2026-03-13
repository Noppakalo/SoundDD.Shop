<template>
  <USelect
    v-model="selectedValue"
    :items="items"
    icon="i-iconamoon:sorting-left-light"
    color="neutral"
    variant="subtle"
  />
</template>

<script setup lang="ts">
const emit = defineEmits(['update:sort'])

const items = [
  { label: 'ใหม่ที่สุด', value: 'date-desc' },
  { label: 'เก่าที่สุด', value: 'date-asc' },
  { label: 'ราคา: ต่ำ - สูง', value: 'price-asc' },
  { label: 'ราคา: สูง - ต่ำ', value: 'price-desc' },
]

const selectedValue = ref('date-desc')

watch(selectedValue, (newVal) => {
  if (newVal) {
    const [orderby, order] = newVal.split('-')
    emit('update:sort', { orderby, order })
  }
}, { immediate: true })
</script>
