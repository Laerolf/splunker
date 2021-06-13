<template>
  <q-header elevated>
    <q-toolbar>

      <q-toolbar-title>Splunker</q-toolbar-title>

      <q-btn
        flat round dense
        icon="info" color="white"
        @click="toggleInstanceInfoModal" />

      <instance-info-modal
        v-if="isInstanceInfoModalOpen"
        :open="isInstanceInfoModalOpen"
        @close="toggleInstanceInfoModal" />

    </q-toolbar>
  </q-header>
</template>

<script>
import InstanceInfoModal from '@/components/pages/info/InstanceInfoModal';

export default {
  name: 'MainHeader',

  components: { InstanceInfoModal },

  data: () => ({
    isInstanceInfoModalOpen: false
  }),

  methods: {
    toggleInstanceInfoModal () {
      this.isInstanceInfoModalOpen = !this.isInstanceInfoModalOpen;
    }
  }
};
</script>
