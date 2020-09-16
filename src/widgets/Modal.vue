<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">{{ header }}</slot>
          <div class="close-button" @click="$emit('close')">x</div>
        </div>
        <div class="modal-body">
          <slot name="body">{{ body }}</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <b-button
              variant="danger"
              class="btn-outline-primary"
              v-if="showCancelButton"
              @click="$emit('close')"
              >Cancel</b-button
            >
            <b-button variant="primary" @click="$emit('close')">OK</b-button>
            <br />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    header: String,
    body: String,
    showCancelButton: Boolean,
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9995;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  max-width: 650px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  text-align: left;
  box-sizing: unset;
}
.modal-header {
  margin-top: 0;
  color: #42b983;
  border-bottom: 2px solid #e5e5e5;
  padding-bottom: 5px;
  margin-bottom: 15px;
}
.modal-body {
  margin: 0;
  padding: 0;
}
.modal-footer {
  padding: 0;
  border: 0;
}
button {
  margin-top: 10px;
  margin-right: 8px;
}
button:hover {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
}
.close-button {
  content: 'x';
  color: rgb(110, 110, 110);
  font-weight: 500;
  font-size: 25px;
  font-family: Arial, sans-serif;
  margin: 0;
  border: none;
  background: inherit;
  padding: 5px 15px;
  cursor: pointer;
  transform: translate(50%, -50%);
}
.close-button:hover {
  color: rgb(53, 52, 52);
}
</style>
