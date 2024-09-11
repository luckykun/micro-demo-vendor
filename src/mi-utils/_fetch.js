const content_type_url_encode = 'application/x-www-form-urlencoded;charset=UTF-8';

function paramsSerializer(params) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key])}`)
    .join('&');
}

/**
 * 追加 URL 参数
 *
 * @param url 请求地址
 * @param params 追加在 URL 上的参数
 */
function buildURL(url, params) {
  if (!params) {
    return url;
  }
  const serializedParams = paramsSerializer(params);
  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
}

/**
 * 确定指定的 URL 是否是绝对的
 *
 * @param url 指定 URL
 */
function isAbsoluteURL(url) {
  // 如果 URL 以“<scheme>://”或“//”（协议相对 URL）开头，则该 URL 被认为是绝对的。
  // RFC 3986 将方案名称定义为以字母开头并后跟的字符序列
  // 通过字母、数字、加号、句点或连字符的任意组合。
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/**
 * 超时处理
 *
 * @param time 超时时间
 */
async function timeoutHandle(timeout) {
  return new Promise((_, reject) => setTimeout(reject, timeout));
}


async function fetcher(config) {
  const {
    url,
    params,
    withCredentials = true,
    data = {},
    timeout = 15000,
    method = 'get',
    dataType = 'json',
    headers = {},
    contentType,
  } = config;
  let { mode } = config;
  const requestURL = buildURL(url, params);

  if (!mode) {
    mode = 'cors';
    // 同域 设置请求模式为 no-cros
    if (!isAbsoluteURL(requestURL) || requestURL.includes(location.origin)) {
      mode = 'no-cors';
    }
  }

  const options = {
    method,
    headers,
    mode,
  };

  options.headers = options.headers || {};

  // 是否携带凭证
  if (withCredentials) {
    options.credentials = 'include';
  }
  // POST 请求设置 body
  if (method === 'post') {
    if (contentType) {
      options.headers['Content-Type'] = contentType;
    }
    !options.headers['Content-Type'] && (options.headers['Content-Type'] = content_type_url_encode);
    if (options.headers['Content-Type'] === content_type_url_encode) {
      options.body = paramsSerializer(data);
    } else {
      options.body = JSON.stringify(data);
    }
  }

  return Promise.race([
    timeoutHandle(timeout),
    window.fetch(requestURL, options),
  ]).then(r => {
    if (r.ok) {
      return r[dataType]();
    } else {
      throw new Error(r.statusText);
    }
  });
}

export default fetcher;
