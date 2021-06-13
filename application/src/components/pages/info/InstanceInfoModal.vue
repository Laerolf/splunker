<template>
  <q-dialog persistent :value="open">
    <q-card class="modal-card">
      <q-card-section>
        <div class="row justify-between">
          <div class="col">
            <h4 class="text-h4">Info</h4>
          </div>

          <div class="col text-right">
            <q-btn
              flat round dense
              icon="close"
              @click="closeModal" />
          </div>
        </div>

        <div class="row">
          <div class="col">
            Server
            <q-badge
            rounded
            :color="instanceInfo.health_info" />
            || {{ instanceInfo.serverName }} - {{ instanceInfo.os_name }} {{ instanceInfo.os_build }}
          </div>
        </div>
        <div class="row">
          <div class="col">
            Splunk {{ instanceInfo.version }} - {{ instanceInfo.product_type }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable camelcase */
import { mapState } from 'vuex';

export default {
  name: 'InstanceInfoModal',

  props: {
    open: { type: Boolean, default: false }
  },

  computed: {
    ...mapState(['splunkInstanceInfo']),
    instanceInfo () {
      const {
        serverName,
        version,
        product_type,
        health_info,
        os_build,
        os_name
      } = this.splunkInstanceInfo;

      return {
        serverName,
        version,
        product_type,
        health_info,
        os_build,
        os_name
      };
    }
  },

  methods: {
    closeModal () {
      this.$emit('close');
    }
  }
};
</script>
