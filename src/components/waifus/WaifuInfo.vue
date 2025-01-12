<template>
  <v-card class="d-flex flex-row">
    <div>
      <ImageRender
        :height="400"
        :image="waifu.waifuImages.find(x => x.imageTypeId == 1)?.publicUrl"
        :width="250"
      />
    </div>
    <div class="mx-3" style="width: 100%">
      <div class="d-flex flex-column" style="height: 100%;">
        <h1>Name: {{ waifu.name }}</h1>
        <h2>
          Nickname: {{ waifu.nickname }}
        </h2>
        <h2>Age: {{ waifu.age }}</h2>
        <h2>Type: {{ waifu.waifuType.name }}</h2>
        <v-spacer />
        <v-divider class="mt-2" />
        <h1>Franchise</h1>
        <div class="d-flex flex-row">
          <ImageRender
            :height="150"
            :image="waifu.franchise.publicUrl ?? undefined"
            :width="250"
          />
          <div class="ml-2">
            <h2>Name:
              <router-link class="link" :to="'/franchises/' + waifu.franchise.id">
                {{ waifu.franchise.name }}
              </router-link>
            </h2>
            <h2>Nickname: {{ waifu.franchise.nickname }}</h2>
            <h2>
              <a class="link" :href="waifu.franchise.webPage ?? '#'">
                Web Page
                <v-icon icon="mdi-web" size="small" />
              </a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  </v-card>
  <br>
  <h2>Alternative Images</h2>
  <div class="images-container justify-center">
    <span
      v-for="waifuImage in waifu.waifuImages.filter(x => x.imageTypeId != 1)"
      :key="waifuImage.id"
      class="my-2 mx-2"
    >
      <v-card width="250">
        <ImageRender
          :height="400"
          :image="waifuImage.publicUrl"
          :width="250"
        />
        <h3 class="pa-2">{{ waifuImage.imageType?.icon + ' - ' + waifuImage.imageType?.name }}</h3>
      </v-card>
    </span>
    <span v-if="waifu.waifuImages.length == 1" class="mt-5">
      <h1>No alternative images</h1>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { Waifu } from '@/interfaces/waifu'

  defineProps({
    waifu: { type: Object as () => Waifu, required: true },
  })
</script>
