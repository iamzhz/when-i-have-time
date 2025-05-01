<script setup>
import { ref, onMounted, computed } from 'vue';
import Heatmap from './components/Heatmap.vue';

const heatmapData = ref([]);
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const dataUrl = params.get('data');
  
  if (dataUrl) {
    fetch(dataUrl)
      .then(res => res.json())
      .then(data => {
        const { common_days, special_days } = data;
        const weekDaysFree = common_days.week_days_free;
        const weekDaysBusy = common_days.week_days_busy;
        const specialDaysFree = special_days.free;
        const specialDaysBusy = special_days.busy;
        const today = new Date();
        const startDate = new Date();

        const back_days = 7 + today.getDay();
        startDate.setDate(startDate.getDate() - back_days);

        const generateDate = (date, offset) => {
          const newDate = new Date(date);
          newDate.setDate(newDate.getDate() + offset);
          return newDate;
        };

        const formatDate = (date) => {
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };

        const isFreeDay = (date) => {
          const formattedDate = formatDate(date);
          return weekDaysFree.includes(date.toLocaleString('default', { weekday: 'long' })) ||
                 specialDaysFree.includes(formattedDate);
        };
        const isBusyDay = (date) => {
          const formattedDate = formatDate(date);
          return weekDaysBusy.includes(date.toLocaleString('default', { weekday: 'long' })) ||
                 specialDaysBusy.includes(formattedDate);
        };
        const days = [];
        for (let i = 0; i < 105; i++) { // 7 weeks * 15 days
          const date = generateDate(startDate, i);
          let status;
          status = isFreeDay(date) ? 1 : 0;
          status = isBusyDay(date) ? 0 : status;
          days.push({ date: formattedDate(date), status });
        }

        // Ensure today is in the second week and mark it as free
        const currentFormattedDate = formattedDate(today);
        const currentDayIndex = days.findIndex(day => day.date === currentFormattedDate);
        if (currentDayIndex !== -1 && currentDayIndex >= 14 && currentDayIndex < 28) {
          days[currentDayIndex].status = 1; // Mark as free
        }

        heatmapData.value = days;
      })
      .catch(console.error);
  }
});

const formattedDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<template>
  <div class="container">
    <Heatmap v-if="heatmapData.length" :data="heatmapData" />
    <div v-else>Loading...</div>
  </div>
</template>

<style>
.container {
  padding: 1rem;
  min-height: 100vh;
}
</style>
