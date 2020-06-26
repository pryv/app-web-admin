<template>
  <div class="config">
    <h1>{{ msg }}</h1>
    <h3>H3</h3>
    <div>
      <span v-for="n in 10" :key="n"> {{ n }} </span>
    </div>
    <ul>
      <li v-for="el in list1" :key="el.val">
        {{ el }}
      </li>
    </ul>
    <ul>
      <li v-for="todo in todos" :key="todo">
        {{ todo }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Config",
  props: {
    msg: String
  }
  ,
  data: () => ({
    todos: [1,2,3],
    list1: [
      {
        val: 'xoxo'
      },
      {
        val: 'xxop'
      }
    ]
  })
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
