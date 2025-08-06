import com from './_com';
import fetcher from './_fetch';
import micro from './_micro';

// 项目中可以使用 mi.isObject(data)
const miUtils = {
  ...com,
  ...micro,
  fetcher,
};

window.__miUitls = miUtils;


export default miUtils;
