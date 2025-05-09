<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTeamsStore } from '~/stores/teams';
import type { Team, FormattedMatch } from '~/types';

const route = useRoute();
const router = useRouter();
const teamsStore = useTeamsStore();

// Get team ID from route params
const teamId = computed(() => {
  const id = parseInt(route.params.id as string);
  return isNaN(id) ? null : id;
});

// Get team data
const team = computed<Team | null>(() => {
  if (!teamId.value) return null;
  return teamsStore.teams.find((t) => t.id === teamId.value) || null;
});

// UI state
const isEditingResult = ref<boolean>(false);
const isEditingTeamDetails = ref<boolean>(false);
const isAddingMatch = ref<boolean>(false);
const editingMatch = ref<FormattedMatch | null>(null);
const showSuccessMessage = ref<boolean>(false);
const successMessage = ref<string>('');

// Load data if needed
onMounted(() => {
  if (teamsStore.teams.length === 0) {
    teamsStore.init();
  }
});

// Go back to teams list
function goBack() {
  router.push('/');
}

// Handle favorite team toggle
function toggleFavoriteTeam(team: Team, event: Event | null) {
  // Stop event propagation if event provided
  if (event) {
    event.stopPropagation();
  }

  teamsStore.updateFavoriteTeam(team.id);
}

// Start editing match result
function startEditingMatch(match: FormattedMatch) {
  editingMatch.value = { ...match };
  isEditingResult.value = true;
}

// Start editing team details
function startEditingTeamDetails() {
  if (!team.value) return;
  isEditingTeamDetails.value = true;
}

// Start adding new match
function startAddingMatch() {
  isAddingMatch.value = true;
}

// Handle successful match update
function onMatchUpdated() {
  isEditingResult.value = false;
  editingMatch.value = null;

  showSuccessMessage.value = true;
  successMessage.value = 'Match result updated successfully! Standings have been recalculated.';

  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
}

// Handle successful team details update
function onTeamDetailsUpdated() {
  isEditingTeamDetails.value = false;

  showSuccessMessage.value = true;
  successMessage.value = 'Team details updated successfully!';

  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
}

// Handle successful match addition
function onMatchAdded() {
  isAddingMatch.value = false;

  showSuccessMessage.value = true;
  successMessage.value = 'New match added successfully! Standings have been recalculated.';

  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
}
</script>

<template>
  <div>
    <div v-if="!team" class="text-center py-20">
      <div
        v-if="teamsStore.isLoading"
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
      ></div>
      <p v-else class="text-gray-500 dark:text-gray-400">Team not found.</p>
      <button @click="goBack" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Back to Teams
      </button>
    </div>

    <div v-else class="team-details py-6">
      <div class="flex justify-between items-center mb-6">
        <button
          @click="goBack"
          class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Teams
        </button>

        <!-- Favorite Button in Team Details -->
        <button
          @click="toggleFavoriteTeam(team, $event)"
          class="flex items-center px-3 py-2 rounded-md transition-colors"
          :class="{
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
              teamsStore.favoriteTeamId === team.id,
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600':
              teamsStore.favoriteTeamId !== team.id,
          }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
          {{ teamsStore.favoriteTeamId === team.id ? 'Favorite Team' : 'Set as Favorite' }}
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
          <h2 class="text-3xl font-bold">{{ team.name }}</h2>
          <p class="text-blue-100">Position: #{{ team.position }} • Points: {{ team.points }}</p>
        </div>

        <div class="p-6">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              <div class="flex items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h2>
                <span
                  class="ml-3 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  #{{ team.position }}
                </span>
              </div>

              <div class="space-y-3">
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p class="dark:text-gray-300"><strong>Founded:</strong> {{ team.founded }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p class="dark:text-gray-300">
                    <strong>Stadium:</strong> {{ team.stadium }}
                    <button
                      @click="startEditingTeamDetails"
                      class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p class="dark:text-gray-300"><strong>Coach:</strong> {{ team.coach }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold mb-4 dark:text-white">Team Stats</h3>
              <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Points</h4>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.points }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Goals Scored</h4>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.goalsFor }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Goals Conceded</h4>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.goalsAgainst }}</p>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  @click="startAddingMatch"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Add New Match
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div
          v-if="showSuccessMessage"
          class="m-6 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ successMessage }}
        </div>

        <!-- Match List Component -->
        <MatchList v-if="teamId" :teamId="teamId" @editMatch="startEditingMatch" />
      </div>
    </div>

    <!-- Edit Match Modal -->
    <EditMatchModal
      :show="isEditingResult"
      :match="editingMatch"
      @close="isEditingResult = false"
      @save="onMatchUpdated"
    />

    <!-- Edit Team Modal -->
    <EditTeamModal
      :show="isEditingTeamDetails"
      :team="team || null"
      @close="isEditingTeamDetails = false"
      @save="onTeamDetailsUpdated"
    />

    <!-- Add Match Modal -->
    <AddMatchModal :show="isAddingMatch" :currentTeamId="teamId" @close="isAddingMatch = false" @save="onMatchAdded" />
  </div>
</template>
