<template>
  <div>
    <div :class="{'fixed-header':fixedHeader}">
      <headbar />
    </div>
    <div :class="classObj" class="app-wrapper">
      <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div :class="{ hasTagsView: needTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <navbar />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
      </div>
    </div>
  </div>

</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView, Headbar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
    Headbar
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss">
</style>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  min-width: 500px;

  &.mobile.openSidebar {
    position: fixed;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 1000;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1002;
  // width: calc(100% - #{$sideBarWidth});
  width: 100%;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.main-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f0f2f5;
}
.fixed-header + .main-wrapper {
  padding: 70px 20px 20px;
}
.hasTagsView {
  .main-wrapper {
    min-height: calc(100vh - 145px);
  }

  .fixed-header + .main-wrapper {
    padding: 100px 16px 16px;
  }
}
.sidebar-container {
  z-index: 1000;
  top: 60px !important;
  transition: transform 0.28s;
  width: 210px !important;
}
</style>
