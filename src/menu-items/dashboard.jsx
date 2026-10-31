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
  ]
};

export default dashboard;
