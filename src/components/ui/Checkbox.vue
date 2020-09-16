<template>
  <div class="custom-control custom-checkbox">
    <input
      class="custom-control-input"
      type="checkbox"
      v-bind:id="id"
      :disabled="disabledData"
      :value="val"
      v-model="checked"
      @change="onChange"
    />
    <label v-bind:for="id" class="custom-control-label" />
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    disabled: Boolean,
    val: String,
    value: Array,
  },
  data: function() {
    return {
      // it seems to be the bug in the design - checkbox without id and label does not work
      id: Math.random()
        .toString(36)
        .substring(7),
      disabledData: this.disabled,
      checkedProxy: false,
    };
  },
  computed: {
    checked: {
      get() {
        return this.value;
      },
      set(val) {
        this.checkedProxy = val;
      },
    },
  },
  methods: {
    onChange: function() {
      this.$emit('input', this.checkedProxy);
    },
  },
};
</script>
