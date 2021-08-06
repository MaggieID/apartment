  //  Contains = 0,
  //       StartsWith = 1,
  //       EndsWith = 2,
  //       NotContains = 3,
  //       NotStartsWith = 4,
  //       NotEndsWith = 5,
  //       //
  //       // 摘要:
  //       //     =
  //       //     Equal/Equals/Eq 效果相同
  //       Equal = 6,

  //       //
  //       // 摘要:
  //       //     <>
  //       NotEqual = 7,
  //       //
  //       // 摘要:
  //       //     >
  //       GreaterThan = 8,
  //       //
  //       // 摘要:
  //       //     >=
  //       GreaterThanOrEqual = 9,
  //       //
  //       // 摘要:
  //       //     <
  //       LessThan = 10,
  //       //
  //       // 摘要:
  //       //     <=
  //       LessThanOrEqual = 11,

  //       /// <summary>
  //       /// 集合属性任何等于
  //       /// </summary>
  //       AnyEqual = 12,
  //       /// <summary>
  //       /// 集合属性任何包含
  //       /// </summary>
  //       AnyContains = 13,
  //       /// <summary>
  //       /// 集合属性任何前包含
  //       /// </summary>
  //       AnyStartsWith =14

  export function getConditions(showList, formInline) {
      var Filters = []
      for (const key in formInline) {
          for (let i = 0; i < showList.length; i++) {
              if (key == showList[i].ColumnName) {
                  // console.log(formInline[key])
                  if (formInline[key] !== '' && formInline[key] !== undefined) {
                      Filters.push({
                          Logic: 1,
                          Field: key,
                          Operator: showList[i].Tag,
                          value: formInline[key],
                          Filters: []
                      });
                  }
              }
          }
      }
      // console.log(Filters)
      var condition = {
          Logic: 1,
          Field: '',
          Operator: 0,
          Filters: Filters
      }
      return Filters.length > 0 ? condition : null;
  }