<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTeamsStore } from '~/stores/teams';
import type { Team } from '~/types';

// Props
const props = defineProps<{
  show: boolean;
  team: Team | null;
}>();

// Emits
const emit = defineEmits(['close', 'save']);

// Store
const teamsStore = useTeamsStore();

// Local state
const editCoach = ref<string>('');
const editStadium = ref<string>('');

// Watch for team changes to update form
watch(
  () => props.team,
  (newTeam) => {
    if (newTeam) {
      editCoach.value = newTeam.coach;
      editStadium.value = newTeam.stadium;
    }
  },
  { immediate: true }
);

// Close the modal
function closeModal() {
  emit('close');
}

// Save the team details
function saveDetails() {
  if (!props.team) return;

  // Save the updated team details
  const saved = teamsStore.updateTeamDetails(props.team.id, editCoach.value, editStadium.value);

  if (saved) {
    emit('save');
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
      <h3 class="text-xl font-bold mb-4 dark:text-white">Edit Team Details</h3>

      <div class="space-y-4 mb-6" v-if="team !== null && team !== undefined">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coach</label>
          <input
            v-model="editCoach"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Coach name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stadium</label>
          <input
            v-model="editStadium"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Stadium name"
          />
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
          @click="saveDetails"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Save Details
        </button>
      </div>
    </div>
  </div>
</template>
