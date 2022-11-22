// Pages
import Home from '../pages/home';
import SignIn from '../pages/signIn';
import SignUp from '../pages/signUp';
import Post from '../pages/post';
import Search from '../pages/search';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn, layout: null },
    { path: '/sign-up', component: SignUp, layout: null },
    { path: '/post', component: Post },
    { path: '/search', component: Search }
];

// Private routes
const privateRoutes = [

];

export { publicRoutes, privateRoutes };