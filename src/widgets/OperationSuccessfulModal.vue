<template>
  <div class="operation-successful-modal-mask">
    <div class="operation-successful-modal-wrapper">
      <div class="operation-successful-modal-container">
        <div class="operation-successful-modal-body">
          <b-iconstack font-scale="10">
            <b-icon stacked icon="circle" variant="secondary"></b-icon>
            <b-icon stacked icon="check" variant="secondary"></b-icon>
          </b-iconstack>
          <div class="operation-successful-modal-message">{{ text }}</div>
          <b-button variant="outline-secondary" @click="$emit('close')">
            Close
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationSuccessfulModal',
  props: {
    text: String
  }
};
</script>

<style scoped>
.operation-successful-modal-mask {
  position: fixed;
  z-index: 9997;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(107, 105, 105, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.operation-successful-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.operation-successful-modal-container {
  width: 160px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  text-align: center;
  box-sizing: unset;
}
.operation-successful-modal-body {
  margin: 0;
  padding: 0;
}
.operation-successful-modal-message {
  margin-top: 10px;
}
button {
  border-radius: 4px;
  position: relative;
  margin-top: 15px;
  left: 30%;
}
button:hover {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
  outline: none !important;
}
</style>
