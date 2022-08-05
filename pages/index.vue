<template>
  <v-container fluid>
    <input v-model="filterText" type="text" />
    <div style="display: flex; flex-wrap: wrap; justify-content: center">
      <v-card
        v-for="(pokemon, index) in filteredPokemonList"
        :key="`poke-${index}`"
        elevation="2"
        class="mb-3"
        min-width="240"
        style="padding: 20px; margin: 20px; border-radius: 25px"
        @click="showPokemonDetails(pokemon.entry_number)"
      >
        <div>
          <v-img
            :src="pokemonImageURL + pokemon.entry_number + '.png'"
            width="120"
            height="120"
            style="margin: 0 auto; background-color: grey; border-radius: 100%"
          ></v-img>
          <h3 style="text-align: center">
            #{{ pokemon.entry_number }} -
            {{
              pokemon.pokemon_species.name[0].toUpperCase() +
              pokemon.pokemon_species.name.slice(1)
            }}
          </h3>
        </div>
      </v-card>
    </div>
    <v-dialog v-model="dialog" width="500">
      <v-card v-if="selectedPokemon">
        <v-toolbar class="fixed-bar" color="#ffffff" height="80px" flat>
          <div class="toolbar-chip">#{{ pokemonDetailId }}</div>
          <v-spacer></v-spacer>
          <v-toolbar-title class="text-capitalize">{{
            selectedPokemon.name
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn fab text @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
        <div class="d-flex flex-column align-center justify-center">
          <img
            class="pokemon-image-details"
            :src="pokemonImageURL + pokemonDetailId + '.png'"
            :alt="selectedPokemon.name"
          />
          <div class="d-flex flex-row align-start pa-2">
            <v-chip
              v-for="(info, index) in selectedPokemon.types"
              :key="index"
              dark
              class="ma-1 text-uppercase"
            >
              {{ info.type.name }}
            </v-chip>
          </div>
          <div
            v-for="(pokemonStat, index) in selectedPokemon.stats"
            :key="index"
          >
            <span>{{ pokemonStat.stat.name }}</span>
            <span>{{ pokemonStat.base_stat }}</span>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    pokemonImageURL:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/',
    pokemonURL: 'https://pokeapi.co/api/v2/pokemon/',
    pokemonsURL: 'https://pokeapi.co/api/v2/pokedex/2',
    pokemonList: [],
    selectedPokemon: [],
    filterText: '',
    errorMessage: '',
    pokemonDetailId: '',
    dialog: false,
  }),
  async fetch() {
    const pokeData = await fetch(this.pokemonsURL)
      .then((response) => response.json())
      .catch((err) => {
        this.errorMessage = err
      })
    this.pokemonList = pokeData.pokemon_entries
  },
  computed: {
    filteredPokemonList() {
      return this.pokemonList.filter((pokemon) =>
        pokemon.pokemon_species.name.includes(this.filterText)
      )
    },
  },

  methods: {
    async showPokemonDetails(pokemonId) {
      this.dialog = true
      this.pokemonDetailId = pokemonId
      const selectedPokemon = await fetch(
        this.pokemonURL + this.pokemonDetailId
      )
        .then((response) => response.json())
        .catch((err) => {
          this.errorMessage = err
        })
      console.log('pokemon : ' + pokemonId, selectedPokemon)
    },
  },
}
</script>

<style>
.pokemon-image-details {
  width: 250px;
  height: auto;
}
.toolbar-chip {
  background-color: #b43c46;
  color: #ffffff;
  width: 56px;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 1.2em;
}
</style>
