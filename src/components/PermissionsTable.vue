<template>
  <div class="permissions-table">
    <table>
      <tr class="perms-table-row">
        <th colspan="5">USERS</th>
        <th colspan="2">SETTINGS</th>
      </tr>
      <tr>
        <td v-for="el in usersPermissions" :key="`users-perm-${el}`">
          {{ el }}
        </td>
        <td v-for="el in settingsPermissions" :key="`settings-perm-${el}`">
          {{ el }}
        </td>
      </tr>
      <tr>
        <td v-for="el in usersPermissions" :key="`users-perm-${el}`">
          <input
            type="checkbox"
            :disabled="disableCheckBoxes"
            :value="el"
            v-model="permissions.users"
          />
        </td>
        <td v-for="el in settingsPermissions" :key="`setttings-perm-${el}`">
          <input
            type="checkbox"
            :disabled="disableCheckBoxes"
            :value="el"
            v-model="permissions.settings"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "PermissionsTable",
  props: {
    permissions: {},
    disableCheckBoxes: Boolean,
  },
  data: () => ({
    settingsPermissions: ["read", "update"],
    usersPermissions: [
      "read",
      "create",
      "delete",
      "resetPassword",
      "changePermissions",
    ],
  }),
};
</script>

<style scoped>
table {
  width: 90%;
}
tr {
  background-color: inherit !important;
  text-align: justify;
}
th {
  padding-left: 2rem;
  padding-bottom: 0rem;
  vertical-align: middle;
  border: 0px;
}
th:first-child,
td:nth-last-child(3) {
  border-right: 1px solid #c8c8c8;
}
td {
  text-align: center;
  width: 80px;
  padding: 5px !important;
  text-align: center !important;
  border-top: 1px solid #e7e4e4;
}
</style>
