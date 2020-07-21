<template>
  <div class="operation-successful-modal-mask">
    <div class="operation-successful-modal-wrapper" @click="$emit('close')">
      <div class="operation-successful-modal-container">
        <div class="operation-successful-modal-body">
          <b-iconstack font-scale="10">
            <b-icon stacked icon="circle" variant="success"></b-icon>
            <b-icon stacked icon="check" variant="success"></b-icon>
          </b-iconstack>
          <div class="operation-successful-modal-message">{{ text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OperationSuccessfulModal",
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
</style>
