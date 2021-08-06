import router from './router';
import store from './store';
import {
    Message
} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {
    getToken
} from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({
    showSpinner: false
}); // NProgress Configuration

const whiteList = ['/auth-redirect']; // no redirect whitelist
router.beforeEach(async(to, from, next) => {
    // console.log(to, from)
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    // determine whether the user has logged in
    const hasToken = getToken();
    if (hasToken) {
        // determine whether the user has obtained his permission roles through getInfo
        const hasRoles = store.getters.roles && store.getters.roles.length > 0;
        if (hasRoles) {
            next();
        } else {
            try {
                // get user info
                // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                const roles = await store.dispatch('user/getInfo');
                console.log(roles)
                if (roles.ViewGroup.Menus.length > 0) {
                    // generate accessible routes map based on roles
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles);
                    // console.log(accessRoutes)
                    router.addRoutes(accessRoutes);
                    // console.log(router)
                    next({
                        ...to,
                        replace: true
                    });
                }
                NProgress.done();
            } catch (error) {
                // remove token and go to login page to re-login
                await store.dispatch('user/resetToken');
                Message.error(error || 'Has Error');
                location.href = `/login/?redirect=${window.location.pathname +
        window.location.hash}`
                NProgress.done();
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            location.href = `/login/?redirect=${window.location.pathname +
        window.location.hash}`
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});