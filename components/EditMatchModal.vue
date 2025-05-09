<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTeamsStore } from '~/stores/teams';
import type { FormattedMatch } from '~/types';

// Props
const props = defineProps<{
  show: boolean;
  match: FormattedMatch | null;
}>();

// Emits
const emit = defineEmits(['close', 'save']);

// Store
const teamsStore = useTeamsStore();

// Local state
const editHomeScore = ref<number>(0);
const editAwayScore = ref<number>(0);

// Watch for match changes to update form
watch(
  () => props.match,
  (newMatch) => {
    if (newMatch) {
      editHomeScore.value = newMatch.homeScore;
      editAwayScore.value = newMatch.awayScore;
    }
  },
  { immediate: true }
);

// Close the modal
function closeModal() {
  emit('close');
}

// Save the match result
function saveResult() {
  if (!props.match) return;

  // Validate scores
  if (editHomeScore.value < 0 || editHomeScore.value > 7 || editAwayScore.value < 0 || editAwayScore.value > 7) {
    alert('Scores must be between 0 and 7');
    return;
  }

  // Save the updated match
  const saved = teamsStore.updateMatchResult(props.match.id, editHomeScore.value, editAwayScore.value);

  if (saved) {
    emit('save');
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
      <h3 class="text-xl font-bold mb-4 dark:text-white">Edit Match Result</h3>

      <div class="mb-6" v-if="match">
        <div class="flex items-center justify-between mb-4">
          <div class="text-center">
            <p class="font-semibold dark:text-white">{{ match.homeTeam }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">(Home)</p>
          </div>

          <div class="text-center">
            <p class="font-semibold dark:text-white">vs</p>
          </div>

          <div class="text-center">
            <p class="font-semibold dark:text-white">{{ match.awayTeam }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">(Away)</p>
          </div>
        </div>

        <div class="flex items-center justify-center space-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Score</label>
            <input
              v-model.number="editHomeScore"
              type="number"
              min="0"
              max="7"
              class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div class="text-xl font-bold dark:text-white">-</div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Away Score</label>
            <input
              v-model.number="editAwayScore"
              type="number"
              min="0"
              max="7"
              class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
        >
          Cancel
        </button>
        <button
          @click="saveResult"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Save Result
        </button>
      </div>
    </div>
  </div>
</template>
