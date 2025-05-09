<script setup lang="ts">
import { useTeamsStore } from '~/stores/teams';
import type { Team } from '~/types';
import { SortField, SortDirection } from '~/types/enums';

const teamsStore = useTeamsStore();

// Define emits
const emit = defineEmits(['selectTeam']);

// Function to handle team selection
function onSelectTeam(team: Team) {
  emit('selectTeam', team);
}

// Function to handle favorite team toggle
function toggleFavoriteTeam(team: Team, event: Event) {
  // Stop event propagation to prevent navigating to team details
  if (event) {
    event.stopPropagation();
  }

  teamsStore.updateFavoriteTeam(team.id);
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.Position)"
          >
            <div class="flex items-center space-x-1">
              <span>Pos</span>
              <svg
                v-if="teamsStore.sortBy === SortField.Position"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.Name)"
          >
            <div class="flex items-center space-x-1">
              <span>Team</span>
              <svg
                v-if="teamsStore.sortBy === SortField.Name"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.Points)"
          >
            <div class="flex items-center space-x-1">
              <span>Points</span>
              <svg
                v-if="teamsStore.sortBy === SortField.Points"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            <div class="flex items-center space-x-1">
              <span>Played</span>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.Wins)"
          >
            <div class="flex items-center space-x-1">
              <span>W</span>
              <svg
                v-if="teamsStore.sortBy === SortField.Wins"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.Draws)"
          >
            <div class="flex items-center space-x-1">
              <span>D</span>
              <svg
                v-if="teamsStore.sortBy === SortField.Draws"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.Losses)"
          >
            <div class="flex items-center space-x-1">
              <span>L</span>
              <svg
                v-if="teamsStore.sortBy === SortField.Losses"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.GoalsFor)"
          >
            <div class="flex items-center space-x-1">
              <span>GF</span>
              <svg
                v-if="teamsStore.sortBy === SortField.GoalsFor"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="teamsStore.toggleSortDirection(SortField.GoalsAgainst)"
          >
            <div class="flex items-center space-x-1">
              <span>GA</span>
              <svg
                v-if="teamsStore.sortBy === SortField.GoalsAgainst"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="teamsStore.sortDirection === SortDirection.Asc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            Form
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="team in teamsStore.filteredAndSortedTeams"
          :key="team.id"
          @click="onSelectTeam(team)"
          class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': teamsStore.favoriteTeamId === team.id }"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.position }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.name }}</div>
              <!-- Favorite Star -->
              <button
                @click="toggleFavoriteTeam(team, $event)"
                class="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="{
                  'bg-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                    teamsStore.favoriteTeamId === team.id,
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600':
                    teamsStore.favoriteTeamId !== team.id,
                }"
                title="Set as favorite team"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
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
              </button>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.points }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ teamsStore.gamesPlayed(team) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.wins }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.draws }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.losses }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.goalsFor }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.goalsAgainst }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex space-x-1">
              <span
                v-for="(result, index) in team.recentForm"
                :key="index"
                class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
                :class="{
                  'bg-green-500': result === 'W',
                  'bg-red-500': result === 'L',
                  'bg-yellow-500': result === 'D',
                }"
              >
                {{ result }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
