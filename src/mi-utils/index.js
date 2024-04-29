const objectType = (e) => Object.prototype.toString.call(e);

const utils = {

  isObject: (o) => objectType(o) === '[object Object]',

  isArray: (o) => objectType(o) === '[object Array]',

  isFunction: (o) => typeof o === 'function',

  isUndefined: (o) => typeof o === 'undefined',

  isString: (e) => typeof e === 'string',

  isBoolean: (e) => typeof e === 'boolean',

  isNumber: (e) => typeof e === 'number',

  isEmptyObject: (o) => {
    if (!utils.isObject(o)) return;
    return !Object.keys(o).length;
  },

  // 延迟执行 (time 延迟时间 单位ms)
  delay: async (time) => new Promise((resolve) => setTimeout(resolve, time)),

  copy(target) {
    if (utils.isObject(target)) {
      return { ...target };
    }
    if (utils.isArray(target)) {
      return [...target];
    }
    return target;
  },

  /**
   * 深拷贝
   * @param o
   */
  deepCopy(o) {
    if (!utils.isArray(o) && !utils.isObject(o)) {
      return o;
    }
    const clone = utils.isArray(o) ? [] : {};
    for (const k in o) {
      if (o.hasOwnProperty(k)) {  // eslint-disable-line
        const child = o[k];
        if (utils.isObject(child) || utils.isArray(child)) {
          clone[k] = utils.deepCopy(child);
        } else {
          clone[k] = child;
        }
      }
    }
    return clone;
  },
};

window.__miUitls = utils;
