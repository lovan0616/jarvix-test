<template>
  <div class="bread-crumb">
    <router-link 
      :to="{ name: 'FlowList' }" 
      class="link">{{ $t('sideNav.flowList') }}</router-link>
    <span class="divider">/</span>{{ name }}
  </div>
</template>
<script>
export default {
	props: {
		name: {
			type: String,
			default: ''
		}
	}
}
</script>
<style lang="scss" scoped>
.bread-crumb {
	margin-bottom: 8px;
	.divider {
		padding: 0 4px;
	}
}
</style>