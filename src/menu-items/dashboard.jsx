// assets
import { DashboardOutlined, CompassOutlined } from '@ant-design/icons';


// icons
const icons = {
  DashboardOutlined,
  CompassOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'tyres',
      title: 'Tyres',
      type: 'item',
      url: '/tyres',
      icon: icons.CompassOutlined,
      breadcrumbs: false
    },
    {
      id: 'steering',
      title: 'Steerings',
      type: 'item',
      url: '/steerings',
      icon: icons.CompassOutlined,
      breadcrumbs: false
    },
    {
      id: 'spoiler',
      title: 'Spoilers',
      type: 'item',
      url: '/spoilers',
      icon: icons.CompassOutlined,
      breadcrumbs: false
    },
    {
      id: 'rearbumper',
      title: 'RearBumper',
      type: 'item',
      url: '/rearbumpers',
      icon: icons.CompassOutlined,
      breadcrumbs: false
    },
    {
      id: 'frontbumper',
      title: 'FrontBumper',
      type: 'item',
      url: '/frontbumpers',
      icon: icons.CompassOutlined,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
