
export const _allMicroApplications = {};

const timeoutPromise = () => new Promise((_, reject) => setTimeout(reject, 10000)); // 10s后抛出一个错误

const getErrorComponent = (name, type) => {
  const error = {
    no_resource: `加载失败！原因：未找到子应用 ${name} 的资源配置。`,
    load_fail: `加载失败！原因：子应用 ${name} 资源获取（执行）失败。`,
    load_timeout: `加载失败！原因：子应用 ${name} 资源获取超时。`,
  }[type];

  return () => (
    <div className="micro-error-container">
      {error}
    </div>
  );
};

/**
 * 动态加载JS或CSS文件
 * @param {string} url - 要加载的文件URL
 * @param {string} type - 文件类型 ('js' 或 'css')
 * @param {function} [callback] - 文件加载完成后的回调函数
 */
const loadResource = (resources, onError) => {
  const loadOneResource = (url) => new Promise((resolve, reject) => {
    let element;
    if (url.endsWith('.js')) {
      element = document.createElement('script');
      element.src = url;
    } else if (url.endsWith('.css')) {
      element = document.createElement('link');
      element.href = url;
      element.rel = 'stylesheet';
    }
    element.onload = () => {
      resolve();
    };
    element.onerror = () => {
      onError && onError();
      reject();
    };
    document.head.appendChild(element);
  });
  return Promise.all(resources.map(url => loadOneResource(url)));
};


const loadMicroResource = async (name) => {
  const microConfig = window.MICRO_APP_CONFIG?.[name]; // 获取到当前微应用的相关配置

  if (!microConfig || _allMicroApplications[name]) { // 没有配置相关资源
    _allMicroApplications[name] = getErrorComponent(name, 'no_resource');
    return;
  }

  // 加载失败的回调
  const onError = () => {
    _allMicroApplications[name] = getErrorComponent(name, 'load_fail');
  };

  const { dependencies = [], resources = [] } = microConfig;
  await loadResource(dependencies, onError); // 先加载依赖资源，后加载微应用自身资源
  await loadResource(resources, onError);
};

export const renderComponent = (name, update) => {
  Promise.race([
    loadMicroResource(name),
    timeoutPromise(),
  ])
    .then(() => {
      _allMicroApplications[name] && update(); // 获取到对应组件，则更新基座组件重新渲染
    })
    .catch((e) => {
      _allMicroApplications[name] = getErrorComponent(name, 'load_timeout');
      update();
    });
};
