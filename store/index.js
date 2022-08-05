export const state = () => ({
	team: []
})

export const mutations = {
	ADD_POKEMON(state, team) {
		state.team = [{ content: team }, ...state.team];
	},
	REMOVE_POKEMON(state, team) {
		state.team.splice(state.team.indexOf(team), 1);
	},
	
}