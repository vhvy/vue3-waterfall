<template>
  <Search @search="handleSearch" />
  <WaterFall :query="query" />
</template>

<script setup>
import WaterFall from "@/views/WaterFall.vue";
import Search from "@/components/Search.vue";
import { ref } from "vue";

const query = ref("轻音少女");

const handleSearch = (e) => {
  e = e.trim();
  if (e != "" && e != query.value) {
    query.value = e;
  }
}

</script>