<template>
  <v-table>
    <thead>
      <tr>
        <th v-for="item in header" :key="item.id">
          {{ item.title }}
        </th>
        <th v-if="actions.length > 0 && roleLevel() <= 2">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in body" :key="item.id">
        <td v-for="value in header" :key="value.id">
          {{ item[value.id] }}
        </td>
        <td v-if="actions.length > 0 && roleLevel() <= 2">
          <span
            v-for="action in actions"
            :key="item.id + '-action-' + action.title"
          >
            <v-btn
              v-if="action.hide ? !action.hide(item) : true"
              :color="action.color"
              icon
              size="small"
              variant="outlined"
              @click="action.onClick(item)"
            >
              <v-icon>{{ action.icon }}</v-icon>
            </v-btn>
          </span>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
  import { GridBoxActions, GridBoxHeader } from '@/interfaces/grid_box'
  import roleLevel from '@/plugins/role_level'

  defineProps({
    header: { type: Array as () => GridBoxHeader[], required: true },
    body: { type: Array as () => any[], required: true },
    actions: { type: Array as () => GridBoxActions[], default: () => [] },
  })
</script>
