// Pages
import Home from '../pages/home';
import SignIn from '../pages/signIn';
import SignUp from '../pages/signUp';
import Post from '../pages/post';
import Search from '../pages/search';
import ForgotPassword from '../pages/forgotPassword';
import InfoItem from '../pages/infoItem';
import UserPost from '../pages/userPost';
import UserInformation from '../pages/userInformation';
import PrivacyPolicy from '../pages/privacyPolicy';
import CovenantTerms from '../pages/covenantTerms';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn, layout: null },
    { path: '/sign-up', component: SignUp, layout: null },
    { path: '/search', component: Search },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
    { path: '/info-item', component: InfoItem},
    { path: '/privacy-policy', component: PrivacyPolicy },
    { path: '/covenant-terms', component: CovenantTerms }
];

// Private routes
const privateRoutes = [
    { path: '/post', component: Post },
    { path: '/user-info', component: UserInformation },
    { path: '/user-post', component: UserPost }
];

export { publicRoutes, privateRoutes };