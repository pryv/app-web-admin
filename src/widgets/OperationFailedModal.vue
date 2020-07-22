<template>
  <div class="operation-failed-modal-mask">
    <div class="operation-failed-modal-wrapper" @click="$emit('close')">
      <div class="operation-failed-modal-container">
        <div class="operation-failed-modal-body">
          <b-iconstack font-scale="10">
            <b-icon stacked icon="circle" variant="danger"></b-icon>
            <b-icon stacked icon="x" variant="danger"></b-icon>
          </b-iconstack>
          <div class="operation-failed-modal-message">
            Failed to process the request. Verify your input or try again later
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OperationFailedModal",
};
</script>

<style scoped>
.operation-failed-modal-mask {
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
.operation-failed-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.operation-failed-modal-container {
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
.operation-failed-modal-body {
  margin: 0;
  padding: 0;
}
.operation-failed-modal-message {
  margin-top: 10px;
}
</style>
