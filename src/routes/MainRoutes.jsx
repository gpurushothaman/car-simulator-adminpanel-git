import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from "./AuthGuard";
import Tyres from '../pages/tyres/Tyres';
import Steering from '../pages/steering/Steering';
import Spoilers from '../pages/spoiler/Spoiler';
import RearBumpers from '../pages/rearbumper/RearBumper';
import FrontBumpers from '../pages/frontbumper/FrontBumper';


// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (<AuthGuard><DashboardLayout /></AuthGuard>),
  children: [
  {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'tyres',
      element: <Tyres />
    },
    {
      path: 'steerings',
      element: <Steering />
    },
    {
      path: 'spoilers',
      element: <Spoilers/>
    },
    {
      path: 'rearbumpers',
      element: <RearBumpers/>
    },
    {
      path: 'frontbumpers',
      element: <FrontBumpers/>
    },
  ]
};

export default MainRoutes;
