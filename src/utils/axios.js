import axios from 'axios';
// import "babel-polyfill";
import { HOSTtest, HOST, STAGE, STAGEHOST, } from './setting.json';
 
const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

// 添加请求拦截器
axios.interceptors.request.use(
    conf => {
        // 配置axios请求的url  ${config.ajaxUrl} 是配置的请求url统一前缀，配置好就不用重复写一样的url前缀了，只写后面不同的就可以了
        conf.url = `${HOST}${conf.url}`;
        conf.mode = 'cors';
        // console.log(conf);
        return conf;
    },
    error => {
        // 抛出请求错误信息
        Promise.reject(error.response);
    }
);
 
// 添加响应拦截器
axios.interceptors.response.use(
    response => {
        return checkStatus(response);
    },
    error => {
        // 请求失败处理
        return Promise.reject(error)
    }
);


function checkStatus (response) {
    // console.log(response);
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 201 || response.status === 202 || response.status === 304 || response.status === 400)) {
        let page = {};
        response.headers['x-pagination-current-page'] && (page.pagination_current_page = response.headers['x-pagination-current-page']);
        response.headers['x-pagination-page-count'] && (page.pagination_page_count = response.headers['x-pagination-page-count']);
        response.headers['x-pagination-per-page'] && (page.pagination_per_page = response.headers['x-pagination-per-page']);
        response.headers['x-pagination-total-count'] && (page.pagination_total_count = response.headers['x-pagination-total-count']);
        // headers.get('X-Pagination-Current-Page')>=0 && (page.pagination_current_page = headers.get('X-Pagination-Current-Page'))
        // headers.get('X-Pagination-Page-Count')>=0 && (page.pagination_page_count = headers.get('X-Pagination-Page-Count'))
        // headers.get('X-Pagination-Per-Page')>=0 && (page.pagination_per_page = headers.get('X-Pagination-Per-Page'))
        // headers.get('X-Pagination-Total-Count')>=0 && (page.pagination_total_count = headers.get('X-Pagination-Total-Count'))
        return {
            status: response.status,
            data: response.data,
            statusText: response.statusText,
            ...page,
            // ...response,
        }
      // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: response.status,
        data: response.data,
        statusText: response.statusText,
        message: codeMessage[response.status],
    }
}

export default axios;