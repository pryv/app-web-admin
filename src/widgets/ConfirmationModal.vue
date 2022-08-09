<template>
  <div class="confirmation-modal-mask">
    <div class="confirmation-modal-wrapper">
      <div class="confirmation-modal-container">
        <div class="confirmation-modal-body">
          <div class="confirmation-close-button" @click="$emit('close')">x</div>
          <div class="confirmation-text">{{ text }}</div>
        </div>
        <div class="confirmation-modal-footer">
          <b-button variant="outline-primary" @click="$emit('close')">
            Cancel
          </b-button>
          <b-button variant="primary" @click="$emit('confirm')">Yes</b-button>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    text: String
  }
};
</script>

<style scoped>
.confirmation-modal-mask {
  position: fixed;
  z-index: 9996;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.confirmation-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.confirmation-modal-container {
  width: 200px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  text-align: left;
  box-sizing: unset;
}
.confirmation-modal-body {
  margin: 0;
  padding: 0;
}
.confirmation-modal-footer {
  padding: 0;
  border: 0;
  text-align: right;
}
button {
  margin-top: 10px;
  margin-left: 8px;
}
button:hover {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
}
.confirmation-close-button {
  content: 'x';
  color: rgb(110, 110, 110);
  font-weight: 500;
  font-size: 20px;
  font-family: Arial, sans-serif;
  margin: 0;
  border: none;
  background: inherit;
  cursor: pointer;
  transform: translate(100%, -50%);
}
.confirmation-close-button:hover {
  color: rgb(53, 52, 52);
}
.confirmation-text {
  margin-bottom: 15px;
}
</style>
