import React                           from "react";
import {Router, Route, Redirect, useRouterHistory} from "react-router";
import createHashHistory               from 'history/lib/createHashHistory';
import createBrowserHistory            from 'history/lib/createBrowserHistory';
import useScroll                       from 'scroll-behavior/lib/useStandardScroll';

import Application                     from "app/containers/application";
//import HomeContainer                 from "app/containers";
import {isStorage}                     from "app/api/auth_token";

const queryUrl = (name) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    const r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};

function redirectToLogin(nextState, replace) {
    if (!isStorage('token') && !queryUrl('token')) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

function redirectToDashboard(nextState, replace) {
    if (isStorage('token') || queryUrl('token')) {
        replace({
            pathname: '/home',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

export default function renderRoutes(store) {

    const history = useRouterHistory(createHashHistory)({ queryKey: false });
    const appHistory = useScroll(useRouterHistory(createBrowserHistory))();

    return (
        <Router history={appHistory}>
            <Redirect from="/" to="/home" />

            <Route path="login" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/login'))
                    })
                }} onEnter={redirectToDashboard} />

            <Route path="/" component={Application} onEnter={redirectToLogin}>
                <Route getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/SecuredContainer'))
                    })
                }}>
                    <Redirect from="/home" to="/zh" />
                    <Redirect from="/zh" to="/zh/edit/all" />
                    <Redirect from="/zh/edit" to="/zh/edit/all" />
                    <Redirect from="/zh/creative" to="/zh/creative/picture/unreleased" />
                    <Redirect from="/zh/creative/picture" to="/zh/creative/picture/unreleased" />
                    <Redirect from="/zh/creative/pictureTag" to="/zh/creative/pictureTag/unreleased" />
                    <Route path="zh/">
                        <Route path="edit/">
                            <Route path="all" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/edit/zh'))
                                })
                            }} />
                            <Route path="tag" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/tag/editor'))
                                })
                            }} />
                            <Route path="push" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/edit/zh/push'))
                                })
                            }} />
                        </Route>

                        <Route path="creative/">
                            <Route path="picture/unreleased" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/creative/noEditor'))
                                })
                            }} />
                            <Route path="picture/released" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/creative/editor'))
                                })
                            }} />
                            <Route path="pictureTag/unreleased" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/creative/tagNoEditor'))
                                })
                            }} />
                            <Route path="pictureTag/released" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/creative/tagEditor'))
                                })
                            }} />
                            <Route path="tag" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/tag/creative'))
                                })
                            }} />
                        </Route>

                        <Route path=":type/download" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/edit/zh/download'))
                            })
                        }} />
                    </Route>

                    <Redirect from="/en" to="/en/edit/all" />
                    <Redirect from="/en/edit" to="/en/edit/all" />
                    <Route path="en/">
                        <Route path="edit/">
                            <Route path="all" getComponent={(nextState, cb) => {
                                require.ensure([], (require) => {
                                    cb(null, require('app/containers/edit/en'))
                                })
                            }} />
                        </Route>
                    </Route>

                    <Redirect from="/user" to="user/password" />
                    <Route path="user/">
                        <Route path="password" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/user/index'))
                            })
                        }} />
                        <Route path="favorites" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/user/favorites'))
                            })
                        }} />
                        <Route path="drafts" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/user/drafts'))
                            })
                        }} />
                        <Route path="news" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/user/news'))
                            })
                        }} />
                    </Route>
                </Route>

                <Route path="zh/doing/:type/:operate/:ids" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/edit/zh/edit'))
                    })
                }} />

                <Route path="en/doing/:type/:operate/:ids" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/edit/en/edit'))
                    })
                }} />

                <Route path="zh/group/update/:groupId" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/editor/groupEdit/Index'))
                    })
                }} />

                <Route path="zh/group/:ids" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/editor/view'))
                    })
                }} />

                <Route path="en/group/:ids" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/editor/view'))
                    })
                }} />

                <Route path="provider/:id/:pageType" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/provider/view'))
                    })
                }} />
                <Route path="license/:id/:type" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/creative/authority'))
                    })
                }} />
				<Route path="zh/search" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/search/Index'))
                    })
                }} />

				<Route path="zh/search/:id" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/search/List'))
                    })
                }} />

                <Redirect from="/provider" to="/provider/contributor" />
                <Route path="provider/" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/provider/index'))
                    })
                }}>
                    <Route path="contributor" getComponent={(nextState, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('app/containers/provider/contributorView'))
                        })
                    }} />
                    <Route path="agency" getComponent={(nextState, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('app/containers/provider/institutionView'))
                        })
                    }} />
                </Route>


                <Redirect from="/cms/channelManage" to="cms/channelManage/:pageClass" />
                <Route path="cms" getComponent={(nextState, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('app/containers/cms/quickPage'))
                        })
                    }} />
                <Route path="cms/">
                    <Route path="topicManage" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/topicManage'))
                            })
                        }} />
                    <Route path="topicManage/topicPreview" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/topicManage/topicPreview'))
                            })
                        }} />
                    <Route path="topicManage/:topicId" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/topicManage/topicConfig'))
                            })
                        }} />
                    <Route path="topicManage/:topicId/:tabIndex" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/topicManage/topicConfig'))
                            })
                        }} />
                    <Route path="topicManage/contentManage/:id" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/topicManage/contentCfg'))
                            })
                        }} />
                    <Route path="channelManage/:pageClass" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/channelManage'))
                            })
                        }} />
                    <Route path="channelManage/config/:id" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/channelManage/pageEdit'))
                            })
                        }} />
                    <Route path="channelManage/config/:id/:tabIndex" getComponent={(nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('app/containers/cms/channelManage/pageEdit'))
                            })
                        }} />
                </Route>

                <Route path="ui" getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/ui'))
                    })
                }} />

                <Route path="*" status={404} getComponent={(nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('app/containers/pageNotFound'))
                    })
                }} />

            </Route>
        </Router>
    );
}
