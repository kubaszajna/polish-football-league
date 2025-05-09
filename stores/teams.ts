// stores/teams.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Team, Match, FormattedMatch } from '~/types';
import { SortField, SortDirection, MatchResult } from '~/types/enums';

interface TeamsResponse {
  teams: Team[];
  matches: Match[];
}

export const useTeamsStore = defineStore('teams', () => {
  // State
  const teams = ref<Team[]>([]);
  const allMatches = ref<Match[]>([]);
  const isLoading = ref<boolean>(false);
  const sortBy = ref<SortField>(SortField.Position);
  const sortDirection = ref<SortDirection>(SortDirection.Asc);
  const favoriteTeamId = ref<number | null>(null);

  // Computed properties
  const favoriteTeam = computed<Team | null>(() => {
    if (!favoriteTeamId.value || !teams.value.length) return null;
    return teams.value.find((team) => team.id === favoriteTeamId.value) || null;
  });

  const gamesPlayed = computed(() => {
    return (team: Team): number => {
      return team.wins + team.draws + team.losses;
    };
  });

  const filteredAndSortedTeams = computed<Team[]>(() => {
    // First filter the teams
    let filtered = teams.value;

    // Then sort the filtered results
    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy.value === SortField.Name) {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy.value === SortField.Points) {
        comparison = a.points - b.points;
      } else if (sortBy.value === SortField.Wins) {
        comparison = a.wins - b.wins;
      } else if (sortBy.value === SortField.Draws) {
        comparison = a.draws - b.draws;
      } else if (sortBy.value === SortField.Losses) {
        comparison = a.losses - b.losses;
      } else if (sortBy.value === SortField.GoalsFor) {
        comparison = a.goalsFor - b.goalsFor;
      } else if (sortBy.value === SortField.GoalsAgainst) {
        comparison = a.goalsAgainst - b.goalsAgainst;
      } else {
        // Default sort by position
        comparison = a.position - b.position;
      }

      // Reverse for descending order
      return sortDirection.value === SortDirection.Asc ? comparison : -comparison;
    });
  });

  // Methods
  async function fetchTeams() {
    isLoading.value = true;

    try {
      // Add artificial delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { data } = await useFetch<TeamsResponse>('/data/teams.json');

      // Store all matches
      allMatches.value = data.value?.matches || [];

      // Get teams data
      const teamsData = data.value?.teams || [];

      // Calculate points and positions based on matches
      const teamsWithStats = calculateTeamStats(teamsData, allMatches.value);

      // Sort teams by points (descending) to determine positions
      const sortedTeams = [...teamsWithStats].sort((a, b) => b.points - a.points);

      // Assign positions
      sortedTeams.forEach((team, index) => {
        team.position = index + 1;
      });

      teams.value = sortedTeams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      teams.value = [];
      allMatches.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  function getTeamMatches(teamId: number, limit: number | null = null): FormattedMatch[] {
    if (!teamId || !allMatches.value.length) return [];

    // Filter matches for the team
    const matches = allMatches.value.filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId);

    // Sort matches by date (most recent first)
    const sortedMatches = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply limit if provided
    const limitedMatches = limit ? sortedMatches.slice(0, limit) : sortedMatches;

    // Format matches for display
    return limitedMatches.map((match) => {
      const isHome = match.homeTeamId === teamId;
      const homeTeamObj = teams.value.find((t) => t.id === match.homeTeamId);
      const awayTeamObj = teams.value.find((t) => t.id === match.awayTeamId);

      // Determine result for the team
      let result: MatchResult;
      if (isHome) {
        result =
          match.homeScore > match.awayScore
            ? MatchResult.Win
            : match.homeScore < match.awayScore
            ? MatchResult.Loss
            : MatchResult.Draw;
      } else {
        result =
          match.awayScore > match.homeScore
            ? MatchResult.Win
            : match.awayScore < match.homeScore
            ? MatchResult.Loss
            : MatchResult.Draw;
      }

      return {
        id: match.id,
        date: match.date,
        homeTeam: homeTeamObj?.name || 'Unknown Team',
        awayTeam: awayTeamObj?.name || 'Unknown Team',
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        result,
        isHome,
      };
    });
  }

  function toggleSortDirection(field: SortField) {
    if (sortBy.value === field) {
      // Toggle direction if clicking the same field
      sortDirection.value = sortDirection.value === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
    } else {
      // Set new field and reset direction to ascending
      sortBy.value = field;
      sortDirection.value = SortDirection.Asc;
    }
  }

  function calculateTeamStats(teamsData: Team[], matches: Match[]): Team[] {
    // Create a map to store team stats
    const teamStats: Record<number, Team> = {};

    // Initialize stats for each team - ensure points start at exactly 0
    teamsData.forEach((team) => {
      teamStats[team.id] = {
        ...team,
        points: 0, // Explicitly set to 0 to override any existing value
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        recentForm: [],
      };
    });

    // Process each match to update team stats
    matches.forEach((match) => {
      const homeTeam = teamStats[match.homeTeamId];
      const awayTeam = teamStats[match.awayTeamId];

      if (!homeTeam || !awayTeam) return; // Skip if team not found

      // Update goals
      homeTeam.goalsFor += match.homeScore;
      homeTeam.goalsAgainst += match.awayScore;
      awayTeam.goalsFor += match.awayScore;
      awayTeam.goalsAgainst += match.homeScore;

      // Determine result and update points
      if (match.homeScore > match.awayScore) {
        // Home team wins
        homeTeam.wins += 1;
        homeTeam.points += 3; // 3 points for a win
        homeTeam.recentForm.unshift(MatchResult.Win);
        awayTeam.losses += 1;
        // No points for a loss (0)
        awayTeam.recentForm.unshift(MatchResult.Loss);
      } else if (match.homeScore < match.awayScore) {
        // Away team wins
        awayTeam.wins += 1;
        awayTeam.points += 3; // 3 points for a win
        awayTeam.recentForm.unshift(MatchResult.Win);
        homeTeam.losses += 1;
        // No points for a loss (0)
        homeTeam.recentForm.unshift(MatchResult.Loss);
      } else {
        // Draw
        homeTeam.draws += 1;
        homeTeam.points += 1; // 1 point for a draw
        homeTeam.recentForm.unshift(MatchResult.Draw);
        awayTeam.draws += 1;
        awayTeam.points += 1; // 1 point for a draw
        awayTeam.recentForm.unshift(MatchResult.Draw);
      }
    });

    // Limit recent form to last 5 matches and reverse for display (most recent on right)
    Object.values(teamStats).forEach((team) => {
      team.recentForm = team.recentForm.slice(0, 5).reverse();

      // Final points calculation to ensure accuracy
      team.points = team.wins * 3 + team.draws;
    });

    return Object.values(teamStats);
  }

  function updateFavoriteTeam(teamId: number | null) {
    if (favoriteTeamId.value === teamId) {
      // If clicking the current favorite, remove it
      favoriteTeamId.value = null;
      localStorage.removeItem('favoriteTeamId');
    } else {
      // Set as new favorite
      favoriteTeamId.value = teamId;
      if (teamId !== null) {
        localStorage.setItem('favoriteTeamId', teamId.toString());
      }
    }
  }

  function updateTeamDetails(teamId: number, updatedCoach: string, updatedStadium: string) {
    // Find the team in the teams array
    const teamIndex = teams.value.findIndex((t) => t.id === teamId);
    if (teamIndex === -1) return false;

    // Update the team's coach and stadium
    teams.value[teamIndex].coach = updatedCoach;
    teams.value[teamIndex].stadium = updatedStadium;

    return true;
  }

  function updateMatchResult(matchId: number, newHomeScore: number, newAwayScore: number) {
    // Validate scores
    if (newHomeScore < 0 || newHomeScore > 7 || newAwayScore < 0 || newAwayScore > 7) {
      return false;
    }

    // Find the match in allMatches
    const matchIndex = allMatches.value.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) return false;

    // Store original scores for comparison
    const originalHomeScore = allMatches.value[matchIndex].homeScore;
    const originalAwayScore = allMatches.value[matchIndex].awayScore;

    // Update the match scores
    allMatches.value[matchIndex].homeScore = newHomeScore;
    allMatches.value[matchIndex].awayScore = newAwayScore;

    // Recalculate team stats
    const teamsData = teams.value.map((team) => ({
      ...team,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      recentForm: [],
    }));

    const teamsWithStats = calculateTeamStats(teamsData, allMatches.value);

    // Sort teams by points (descending) to determine positions
    const sortedTeams = [...teamsWithStats].sort((a, b) => {
      // First sort by points
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // If points are equal, sort by goal difference
      const aGoalDiff = a.goalsFor - a.goalsAgainst;
      const bGoalDiff = b.goalsFor - b.goalsAgainst;
      if (bGoalDiff !== aGoalDiff) {
        return bGoalDiff - aGoalDiff;
      }
      // If goal difference is equal, sort by goals scored
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
      // If everything is equal, sort alphabetically
      return a.name.localeCompare(b.name);
    });

    // Assign positions
    sortedTeams.forEach((team, index) => {
      team.position = index + 1;
    });

    teams.value = sortedTeams;
    return true;
  }

  // New method to add a match
  function addMatch(match: Omit<Match, 'id'>) {
    // Generate a new unique ID
    const newId = Math.max(0, ...allMatches.value.map((m) => m.id)) + 1;

    // Create the new match object
    const newMatch: Match = {
      id: newId,
      ...match,
    };

    // Add to matches array
    allMatches.value.push(newMatch);

    // Recalculate team stats
    const teamsData = teams.value.map((team) => ({
      ...team,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      recentForm: [],
    }));

    const teamsWithStats = calculateTeamStats(teamsData, allMatches.value);

    // Sort teams by points
    const sortedTeams = [...teamsWithStats].sort((a, b) => {
      // First sort by points
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // If points are equal, sort by goal difference
      const aGoalDiff = a.goalsFor - a.goalsAgainst;
      const bGoalDiff = b.goalsFor - b.goalsAgainst;
      if (bGoalDiff !== aGoalDiff) {
        return bGoalDiff - aGoalDiff;
      }
      // If goal difference is equal, sort by goals scored
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
      // If everything is equal, sort alphabetically
      return a.name.localeCompare(b.name);
    });

    // Assign positions
    sortedTeams.forEach((team, index) => {
      team.position = index + 1;
    });

    teams.value = sortedTeams;
    return newId;
  }

  // Initialize
  function init() {
    // Load favorite team from local storage
    const savedFavoriteTeamId = localStorage.getItem('favoriteTeamId');
    if (savedFavoriteTeamId) {
      favoriteTeamId.value = parseInt(savedFavoriteTeamId);
    }

    // Fetch teams data
    fetchTeams();
  }

  return {
    // State
    teams,
    allMatches,
    isLoading,
    sortBy,
    sortDirection,
    favoriteTeamId,

    // Computed
    favoriteTeam,
    gamesPlayed,
    filteredAndSortedTeams,

    // Methods
    fetchTeams,
    getTeamMatches,
    toggleSortDirection,
    updateFavoriteTeam,
    updateTeamDetails,
    updateMatchResult,
    addMatch,
    init,
  };
});
