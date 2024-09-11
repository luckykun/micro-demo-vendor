const objectType = (e) => Object.prototype.toString.call(e);

const com = {

  isObject: (o) => objectType(o) === '[object Object]',

  isArray: (o) => objectType(o) === '[object Array]',

  isFunction: (o) => typeof o === 'function',

  isUndefined: (o) => typeof o === 'undefined',

  isString: (e) => typeof e === 'string',

  isBoolean: (e) => typeof e === 'boolean',

  isNumber: (e) => typeof e === 'number',

  isEmptyObject: (o) => {
    if (!com.isObject(o)) return;
    return !Object.keys(o).length;
  },

  // 延迟执行 (time 延迟时间 单位ms)
  delay: async (time) => new Promise((resolve) => setTimeout(resolve, time)),

  copy(target) {
    if (com.isObject(target)) {
      return { ...target };
    }
    if (com.isArray(target)) {
      return [...target];
    }
    return target;
  },

  /**
   * 深拷贝
   * @param o
   */
  deepCopy(o) {
    if (!com.isArray(o) && !com.isObject(o)) {
      return o;
    }
    const clone = com.isArray(o) ? [] : {};
    for (const k in o) {
      if (o.hasOwnProperty(k)) {  // eslint-disable-line
        const child = o[k];
        if (com.isObject(child) || com.isArray(child)) {
          clone[k] = com.deepCopy(child);
        } else {
          clone[k] = child;
        }
      }
    }
    return clone;
  },
};

export default com;
