<script setup lang="ts">
import { onMounted } from 'vue';
import { useTeamsStore } from '~/stores/teams';
import type { Team } from '~/types';

const teamsStore = useTeamsStore();
const router = useRouter();

// Initialize store
onMounted(() => {
  teamsStore.init();
});

// Handle team selection
function selectTeam(team: Team) {
  router.push(`/teams/${team.id}`);
}

// Handle favorite team view
function viewFavoriteTeamDetails(team: Team) {
  router.push(`/teams/${team.id}`);
}
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="teamsStore.isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Teams Table -->
    <TeamTable v-if="!teamsStore.isLoading" @selectTeam="selectTeam" />

    <!-- Favorite Team Section -->
    <FavoriteTeamSection
      v-if="teamsStore.favoriteTeam && !teamsStore.isLoading"
      @viewTeamDetails="viewFavoriteTeamDetails"
    />
  </div>
</template>
