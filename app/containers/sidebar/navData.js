import storage from "app/utils/localStorage";
import message from "antd/lib/message";
import {isEnv} from "app/utils/utils";

let prefix = '';
if (isEnv('dev')) {
  prefix = 'dev.'
}

const navArr = [
  {
    projectName: 'zh',
    text: '中文版',
    path: '/zh/edit/all',
    children: [
      {
        id: 1,
        path: "/zh/edit",
        text: '编辑类',
        icon: 'fa-pencil-square-o',
        children: [
          {
            path: '/zh/edit/all',
            text: '全部资源',
            icon: 'fa-caret-right'
          }, {
            path: '/zh/search',
            text: '高级搜索',
            icon: 'fa-caret-right',
            type: '_blank'
          }, {
            path: '/zh/edit/tag',
            text: '关键词管理',
            icon: 'fa-caret-right'
          }, {
            path: '/zh/edit/download',
            text: '网站下载记录',
            icon: 'fa-caret-right'
          }, {
            path: '/zh/edit/push',
            text: '组照推送记录',
            icon: 'fa-caret-right'
          }
        ]
      }, {
        id: 2,
        path: "/zh/creative",
        text: '创意类',
        icon: 'fa-creative-commons',
        children: [
          {
            path: '/zh/creative/picture',
            text: '图片审核',
            icon: 'fa-caret-right',
            children: [
              {
                path: '/zh/creative/picture/unreleased',
                text: '未发布图片',
                icon: 'fa-caret-right'
              }, {
                path: '/zh/creative/picture/released',
                text: '已发布图片',
                icon: 'fa-caret-right'
              }
            ]
          }, {
            path: '/zh/creative/pictureTag',
            text: '图片关键词审核',
            icon: 'fa-caret-right',
            children: [
              {
                path: '/zh/creative/pictureTag/unreleased',
                text: '未发布图片',
                icon: 'fa-caret-right'
              }, {
                path: '/zh/creative/pictureTag/released',
                text: '已发布图片',
                icon: 'fa-caret-right'
              }
            ]
          }, {
            path: '/zh/creative/download',
            text: '网站下载记录',
            icon: 'fa-caret-right'
          }, {
            path: '/zh/creative/tag',
            text: '关键词管理',
            icon: 'fa-caret-right'
          }
        ]
      }, {
        path: '/provider',
        text: '供应商信息查询',
        icon: 'fa-user',
        type: '_blank'
      }, {
        text: '上传 & 下载',
        icon: 'fa-cloud',
        path: `javascript:void(0)`,
        onClick: () => {
          const loginTime = window.localStorage.loginTime;
          const currentTime = new Date().getTime();
          const outTime = currentTime - loginTime;
          const currentS = outTime / 1000;//秒
          //60*60*11.5//十一个半小时
          const tt = 60 * 60 * 11.5;
          if (currentS > tt) {
            message.error('认证失效！请重新登录。');
            window.localStorage.clear();
            window.location = "/login";
          } else {
            window.open(`http://${prefix}tools.vcg.com/login?token=${storage.get('token')}`);
          }
        }
      }
    ]
  },
  {
    projectName: 'en',
    text: '英文版',
    path: '/en/edit/all',
    children: [
      {
        id: 4,
        path: "/en/edit",
        text: '编辑类',
        icon: 'fa-pencil-square-o',
        children: [
          {
            path: '/en/edit/all',
            text: '全部资源',
            icon: 'fa-caret-right'
          }
        ]
      }
    ]
  },
  {
    projectName: 'cms',
    text: 'CMS',
    path: `javascript:void(0)`,
    onClick: () => {
      const url = isEnv('dev') ? 'http://192.168.3.143:7700' : 'https://cms.vcg.com';
      // alert(`${url}?token=${storage.get('token')}`);
      window.open(`${url}?token=${storage.get('token')}`);
    }
  }
];

export default {
  navArr
}
