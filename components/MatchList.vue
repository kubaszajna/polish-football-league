<script setup lang="ts">
import { useTeamsStore } from '~/stores/teams';
import { ref, computed } from 'vue';
import type { Team, FormattedMatch } from '~/types';
import { MatchResult } from '~/types/enums';

// Props
const props = defineProps<{
  teamId: number;
}>();

// Emits
const emit = defineEmits(['editMatch']);

const teamsStore = useTeamsStore();
const isLoadingMatches = ref(false);

// Computed property to get all matches for the team
const teamMatches = computed<FormattedMatch[]>(() => {
  return teamsStore.getTeamMatches(props.teamId);
});

// Current team data
const team = computed<Team | undefined>(() => {
  return teamsStore.teams.find((t) => t.id === props.teamId);
});

function editMatch(match: FormattedMatch) {
  emit('editMatch', match);
}
</script>

<template>
  <div class="p-6 border-t border-gray-200 dark:border-gray-700">
    <h3 class="text-xl font-semibold mb-4 dark:text-white">All Matches</h3>

    <!-- Loading State -->
    <div v-if="isLoadingMatches" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- No Matches -->
    <div v-else-if="teamMatches.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      No match history available
    </div>

    <!-- Matches List -->
    <div v-else>
      <!-- Recent Form Display -->
      <div class="mb-6" v-if="team">
        <h4 class="text-lg font-medium mb-2 dark:text-white">Recent Form</h4>
        <div class="flex space-x-3">
          <span
            v-for="(result, index) in team.recentForm"
            :key="index"
            class="w-10 h-10 flex items-center justify-center text-white text-sm font-bold rounded-full"
            :class="{
              'bg-green-500': result === 'W',
              'bg-red-500': result === 'L',
              'bg-yellow-500': result === 'D',
            }"
          >
            {{ result }}
          </span>
        </div>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Most recent match on the right</p>
      </div>

      <!-- Match Statistics Summary -->
      <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg" v-if="team">
        <h4 class="text-lg font-medium mb-3 dark:text-white">Season Summary</h4>
        <div class="grid grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Played</p>
            <p class="text-2xl font-bold dark:text-white">{{ teamsStore.gamesPlayed(team) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Won</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ team.wins }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Drawn</p>
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ team.draws }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Lost</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ team.losses }}</p>
          </div>
        </div>
      </div>

      <!-- All Matches Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Match
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Result
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="match in teamMatches" :key="match.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ match.date }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <span :class="{ 'font-bold': match.isHome }" class="text-gray-900 dark:text-white">
                    {{ match.homeTeam }}
                  </span>
                  <span class="mx-2 text-gray-500 dark:text-gray-400">vs</span>
                  <span :class="{ 'font-bold': !match.isHome }" class="text-gray-900 dark:text-white">
                    {{ match.awayTeam }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-900 dark:text-white font-medium">
                    {{ match.homeScore }} - {{ match.awayScore }}
                  </span>
                  <span
                    class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
                    :class="{
                      'bg-green-500': match.result === 'W',
                      'bg-red-500': match.result === 'L',
                      'bg-yellow-500': match.result === 'D',
                    }"
                  >
                    {{ match.result }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <button
                  @click="editMatch(match)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Edit Result
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
