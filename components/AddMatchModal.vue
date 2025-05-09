<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTeamsStore } from '~/stores/teams';
import type { Team } from '~/types';

// Props
const props = defineProps<{
  show: boolean;
  currentTeamId?: number;
}>();

// Emits
const emit = defineEmits(['close', 'save']);

// Store
const teamsStore = useTeamsStore();

// Local state
const selectedHomeTeamId = ref<number | null>(props.currentTeamId || null);
const selectedAwayTeamId = ref<number | null>(null);
const homeScore = ref<number>(0);
const awayScore = ref<number>(0);
const matchDate = ref<string>(new Date().toISOString().split('T')[0]);

// Calculate available teams for dropdown
const availableHomeTeams = computed(() => teamsStore.teams);
const availableAwayTeams = computed(() => {
  return teamsStore.teams.filter((team) => team.id !== selectedHomeTeamId.value);
});

// Watch for prop changes
watch(
  () => props.currentTeamId,
  (newTeamId) => {
    if (newTeamId) {
      selectedHomeTeamId.value = newTeamId;
    }
  },
  { immediate: true }
);

// Close the modal
function closeModal() {
  // Reset form
  if (!props.currentTeamId) {
    selectedHomeTeamId.value = null;
  }
  selectedAwayTeamId.value = null;
  homeScore.value = 0;
  awayScore.value = 0;
  matchDate.value = new Date().toISOString().split('T')[0];

  emit('close');
}

// Save the new match
function saveMatch() {
  if (!selectedHomeTeamId.value || !selectedAwayTeamId.value) {
    alert('Please select both teams');
    return;
  }

  // Validate scores
  if (homeScore.value < 0 || homeScore.value > 7 || awayScore.value < 0 || awayScore.value > 7) {
    alert('Scores must be between 0 and 7');
    return;
  }

  // Create the new match object
  const newMatch = {
    date: matchDate.value,
    homeTeamId: selectedHomeTeamId.value,
    awayTeamId: selectedAwayTeamId.value,
    homeScore: homeScore.value,
    awayScore: awayScore.value,
  };

  // Add the match
  const newMatchId = teamsStore.addMatch(newMatch);

  if (newMatchId) {
    emit('save');
    closeModal();
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
      <h3 class="text-xl font-bold mb-4 dark:text-white">Add New Match</h3>

      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Match Date</label>
          <input
            v-model="matchDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Team</label>
          <div
            v-if="props.currentTeamId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {{ teamsStore.teams.find((team) => team.id === props.currentTeamId)?.name || 'Selected Team' }}
          </div>
          <select
            v-else
            v-model="selectedHomeTeamId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="null" disabled>Select Home Team</option>
            <option v-for="team in availableHomeTeams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Away Team</label>
          <select
            v-model="selectedAwayTeamId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :disabled="!selectedHomeTeamId"
          >
            <option :value="null" disabled>Select Away Team</option>
            <option v-for="team in availableAwayTeams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Score</label>
            <input
              v-model.number="homeScore"
              type="number"
              min="0"
              max="7"
              class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div class="text-xl font-bold dark:text-white self-end pb-2">-</div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Away Score</label>
            <input
              v-model.number="awayScore"
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
          @click="saveMatch"
          :disabled="!selectedHomeTeamId || !selectedAwayTeamId"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Match
        </button>
      </div>
    </div>
  </div>
</template>
