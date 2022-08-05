<template>
  <v-app>
    <h1 class="textAppBar" v-text="title"></h1>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      fixed: false,
      title: 'PokeDex',
    }
  },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');
@import url('https://fonts.googleapis.com/css?family=Lato:300,400&display=swap');
h1 {
  letter-spacing: 3px;
  text-align: center;
  margin: 25px;
}
.v-application {
  background: linear-gradient(to right, #d4d3dd, #ffc600);
  font-family: 'Lato';
}
</style>
