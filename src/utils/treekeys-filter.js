/**
 * @param {string} keys   传入element-ui中el-tree组件的方法getCheckedKeys()获取到的值
 * @returns {arr}
 * @example see @/views/dashboardAdjust/views/chartAdressManagement/index.vue
 */
export function treekeysFilter(keys) {
  var surplus = [];
  var a, b;
  for (var i = 0, len = keys.length; i < len; i++) {
    for (var j = 0, len1 = keys.length; j < len1; j++) {
      if (keys[i].slice(0, keys[i].length - 3) == keys[j]) {
        surplus.push(keys[i]);
      }
    }
  }
  // console.log(surplus);

  for (var i = keys.length - 1; i >= 0; i--) {
    a = keys[i];
    for (var j = surplus.length - 1; j >= 0; j--) {
      b = surplus[j];
      if (a == b) {
        keys.splice(i, 1);
        surplus.splice(j, 1);
        break;
      }
    }
  }
  return keys;
}
