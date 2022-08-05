<template>
  <v-container fluid>
    <!-- search field -->
    <!-- search field -->
    <v-text-field
      v-model="filterText"
      label="Search your favorite pokemon"
      outlined
      append-icon="mdi-magnify"
    ></v-text-field>
    <!-- Pokemon list team -->
    <!-- Pokemon list team -->
    <div v-if="pokemonTeamList.length > 0">
      <div class="d-flex justify-center mb-6">
        <h1>My team</h1>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mt-2" icon v-bind="attrs" v-on="on" @click="clearAll"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </template>
          <span>Delete all</span>
        </v-tooltip>
      </div>
      <v-divider></v-divider>
      <div class="container-pokemon-card-list mb-6">
        <template v-for="(poke, index) in pokemonTeamList">
          <v-hover v-slot="{ hover }" :key="`poke-${index}`">
            <v-card
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              class="pokemon-card-list mb-3"
              max-width="240"
            >
              <v-img
                class="pokemon-image-details"
                :src="pokemonImageURL + poke.id + '.png'"
                :alt="poke.name"
                width="120"
                height="120"
              ></v-img>
              <h4 class="pt-4">
                {{ capitalizeFirstLetter(poke.name) }}
              </h4>
              <v-card-actions class="justify-center">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      color="red"
                      v-bind="attrs"
                      v-on="on"
                      @click="deletePokemonFromTeam(poke)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </template>
                  <span>Delete from team</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-hover>
        </template>
      </div>
    </div>
    <!-- Pokemon list -->
    <!-- Pokemon list -->
    <div v-if="filteredPokemonList.length > 0">
      <div class="mb-6 d-flex justify-center">
        <h1>Pokemon List</h1>
      </div>
      <v-divider></v-divider>
      <div class="container-pokemon-card-list">
        <template v-for="(pokemon, index) in filteredPokemonList">
          <v-hover v-slot="{ hover }" :key="`poke-${index}`">
            <v-card
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              class="pokemon-card-list mb-3"
              min-width="240"
            >
              <div>
                <v-img
                  :src="pokemonImageURL + pokemon.entry_number + '.png'"
                  width="120"
                  height="120"
                  class="pokemon-image-list"
                ></v-img>
                <h3>
                  #{{ pokemon.entry_number }} -
                  {{ capitalizeFirstLetter(pokemon.pokemon_species.name) }}
                </h3>
              </div>
              <v-card-actions class="justify-space-around">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="showPokemonDetails(pokemon.entry_number)"
                      ><v-icon>mdi-eye</v-icon></v-btn
                    >
                  </template>
                  <span>Show more details</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      color="teal"
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        addPokemonToTeam(
                          pokemon.entry_number,
                          pokemon.pokemon_species.name
                        )
                      "
                      ><v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Add to my team</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-hover>
        </template>
      </div>
    </div>
    <!-- Dialog for more details  -->
    <!-- Dialog for more details  -->
    <v-dialog
      v-model="dialog"
      width="500"
      persistent
      class="pokemon-details-dialog"
    >
      <v-card v-if="selectedPokemon" :loading="loadingPokemonDetails">
        <v-toolbar class="fixed-bar" color="#ffffff" height="80px" flat>
          <div class="pokemon-number-chip">#{{ pokemonDetailId }}</div>
          <v-spacer></v-spacer>
          <h3 class="text-capitalize">{{ selectedPokemon.name }}</h3>
          <v-spacer></v-spacer>
          <v-btn
            fab
            text
            @click="
              dialog = false
              selectedPokemon = []
            "
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
        <div class="d-flex flex-column align-center justify-center pa-4">
          <img
            class="pokemon-image-details"
            :src="pokemonImageURL + pokemonDetailId + '.png'"
            :alt="selectedPokemon.name"
          />
          <div class="d-flex flex-row align-start pa-5">
            <v-chip
              v-for="(info, index) in selectedPokemon.types"
              :key="index"
              dark
              class="ma-1 text-capitalize"
              text-color="black"
              :color="colors[info.type.name]"
            >
              {{ info.type.name }}
            </v-chip>
          </div>
          <div
            v-for="(pokemonStat, index) in selectedPokemon.stats"
            :key="index"
            class="pa-1 col-12"
          >
            <div class="d-flex justify-space-between pokemon-states">
              <span class="text-capitalize">{{ pokemonStat.stat.name }}</span>
              <span>{{ pokemonStat.base_stat }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <v-btn
      icon
      color="white"
      x-large
      style="position: fixed; bottom: 20px; right: 20px"
      @click="scrollToTop"
      ><v-icon>mdi-arrow-up-bold-circle</v-icon></v-btn
    >
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
    pokemonTeamList: [],
    selectedPokemon: [],
    filterText: '',
    errorMessage: '',
    pokemonDetailId: '',
    dialog: false,
    colors: {
      fire: '#FDDFDF',
      grass: '#DEFDE0',
      electric: '#FCF7DE',
      water: '#DEF3FD',
      ground: '#f4e7da',
      rock: '#d5d5d4',
      fairy: '#fceaff',
      poison: '#98d7a5',
      bug: '#f8d5a3',
      dragon: '#97b3e6',
      psychic: '#eaeda1',
      flying: '#F5F5F5',
      fighting: '#E6E0D4',
      normal: '#F5F5F5',
    },
  }),
  async fetch() {
    const pokeData = await fetch(this.pokemonsURL)
      .then((response) => response.json())
      .catch((error) => {
        this.errorMessagePokemon = error
      })
    this.pokemonList = pokeData.pokemon_entries
  },

  computed: {
    filteredPokemonList() {
      return this.pokemonList.filter((pokemon) =>
        pokemon.pokemon_species.name.includes(this.filterText.toLowerCase())
      )
    },
  },

  watch: {
    pokemonTeamList: {
      handler(updatedList) {
        localStorage.setItem('pokemon_team_list', JSON.stringify(updatedList))
      },
      deep: true,
    },
  },
  mounted() {
    this.getPokemonTeam()
  },

  methods: {
    getPokemonTeam() {
      if (localStorage.getItem('pokemon_team_list')) {
        this.pokemonTeamList = JSON.parse(
          localStorage.getItem('pokemon_team_list')
        )
      }
    },
    addPokemonToTeam(pokemonId, pokemonName) {
      this.pokemonTeamList.unshift({
        id: pokemonId,
        name: pokemonName,
      })
    },
    deletePokemonFromTeam(item) {
      this.pokemonTeamList.splice(this.pokemonTeamList.indexOf(item), 1)
    },
    clearAll() {
      this.pokemonTeamList = []
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    async showPokemonDetails(pokemonId) {
      this.dialog = true
      this.pokemonDetailId = pokemonId
      this.selectedPokemon = await fetch(this.pokemonURL + this.pokemonDetailId)
        .then((response) => response.json())
        .catch((error) => {
          this.errorMessagePokemonDetails = error
        })
    },
  },
}
</script>

<style>
:root {
  --image-bg-color: rgba(200, 200, 200, 0.3);
}
h3,
h4 {
  text-align: center;
}
.container-pokemon-card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.pokemon-image-details {
  margin: 0 auto;
  max-width: 200px;
  background-color: var(--image-bg-color);
  border-radius: 100% !important;
}
.pokemon-card-list {
  padding: 20px !important;
  margin: 20px !important;
  border-radius: 25px !important;
}
.pokemon-image-list {
  margin: 0 auto;
  background-color: var(--image-bg-color);
  border-radius: 100%;
}
.v-dialog {
  border-radius: 25px !important;
}
.pokemon-number-chip {
  background-color: #ffc600;
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
.pokemon-states {
  background-color: var(--image-bg-color);
  padding: 10px;
  border-radius: 10px;
}

.v-card {
  transition: 0.2s ease-in-out;
}
</style>
