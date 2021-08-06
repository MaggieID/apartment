import store from '@/store'
const componentPower = JSON.parse(JSON.stringify(store.getters.componentPower))

let PagePower = null;
function getPagePower(pageName, arr) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.RouterName === pageName) {
      PagePower = item;
      break;
    } else {
      if (item.Children.length > 0) {
        getPagePower(pageName, item.Children)
      }
    }
  }
  return PagePower;
}

/**
 * @param {string} pageName 页面的name
 * @returns {arr}
 * @example see @/views/dashboardAdjust/views/chartAdressManagement/index.vue
 */
export function getBottonPower(pageName) {
  console.log(componentPower);

  const pagePower = getPagePower(pageName, componentPower)
  // console.log('pagePower.Children', pagePower.Children);
  const buttonPower = [];
  pagePower.Children.forEach(item => {
    buttonPower.push(item.ComponentName)
  });
  // console.log('buttonPower', buttonPower);
  return buttonPower
}
