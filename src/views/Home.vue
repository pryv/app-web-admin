<template>
  <div class="home"></div>
</template>

<script>
import { PermissionsService } from '@/services/permissions.service.js';

export default {
  name: 'Home',
  beforeMount() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/login');
    } else if (PermissionsService.canReadSettings()) {
      this.$router.push('/platform-config');
    } else if (PermissionsService.canReadUsers()) {
      this.$router.push('/platform-config');
    }
  },
};
</script>
