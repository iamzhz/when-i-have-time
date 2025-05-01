<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  data: Array // 格式: [{ date: "2023-01-01", status: 0|1 }, ...]
});

// 计算周分组（假设数据连续）
const weeks = computed(() => {
  const weeks = [];
  for (let i = 0; i < props.data.length; i += 7) {
    weeks.push(props.data.slice(i, i + 7));
  }
  return weeks;
});

// 获取当前日期
const currentDate = computed(() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
});

// Tooltip 控制
const tooltip = ref({ visible: false, x: 0, y: 0, text: '' });

function showTooltip(event, item) {
  tooltip.value = {
    visible: true,
    x: event.clientX + 10,
    y: event.clientY + 10,
    text: `Date: ${item.date} | ${item.status ? 'Free' : 'Busy'}`
  };
}

function hideTooltip() {
  tooltip.value.visible = false;
}
</script>

<template>
  <div class="heatmap">
    <!-- 按周分组渲染 -->
    <div v-for="(week, i) in weeks" :key="i" class="week">
      <div 
        v-for="day in week" 
        :key="day.date"
        class="day" 
        :class="{ free: day.status === 1, current: day.date === currentDate }"
        @mouseenter="showTooltip($event, day)"
        @mouseleave="hideTooltip"
      />
    </div>
  </div>

  <!-- Tooltip -->
  <div 
    v-if="tooltip.visible"
    class="tooltip"
    :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
  >
    {{ tooltip.text }}
  </div>
</template>

<style scoped>
.heatmap {
  display: flex;
  gap: 3px;
}

.week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.day {
  width: 10px;
  height: 10px;
  background: #ebedf0; /* 默认繁忙（无色） */
  border: 1px solid transparent; /* 默认边框为透明 */
  border-radius: 2px;
  transition: border-color 0.3s; /* 添加过渡效果 */
}

.day.free {
  background: #00ff00; /* 空闲状态为绿色 */
}

.day.current {
  border-color: #ff69b4; /* 当前日期的边框为粉色 */
}

.tooltip {
  position: fixed;
  z-index: 9999;
  background: white;
  color: black;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8em;
  pointer-events: none;
}
</style>