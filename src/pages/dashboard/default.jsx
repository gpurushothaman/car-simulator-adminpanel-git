import { useState } from 'react';

// Material UI
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Project components
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// Icons
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

// Avatars
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// Light green theme colors
const COLORS = {
  primary: '#81C784',
  primaryLight: '#A5D6A7',
  primaryLighter: '#E8F5E9',
  primaryDark: '#2E7D32',
  primaryDarker: '#1B5E20',
  background: '#F5FAF5',
  white: '#FFFFFF',
  text: '#263A29',
  secondaryText: '#647568',
  border: '#DCEBDD',
  warning: '#B7791F',
  error: '#C62828',
  success: '#2E7D32'
};

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const cardSX = {
  mt: 2,
  backgroundColor: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 3,
  boxShadow: '0 3px 12px rgba(46, 125, 50, 0.06)',
  overflow: 'hidden'
};

const headingSX = {
  color: COLORS.primaryDark,
  fontWeight: 700
};

const iconButtonSX = {
  color: COLORS.primaryDark,
  '&:hover': {
    backgroundColor: COLORS.primaryLighter
  }
};

const paymentData = [
  {
    id: 'DR-1024',
    title: 'Teak Main Door',
    date: 'Today, 10:30 AM',
    amount: '₹45,000',
    status: 'Paid',
    color: COLORS.success,
    icon: 'gift'
  },
  {
    id: 'DR-1025',
    title: 'Modern Flush Door',
    date: 'Yesterday, 2:15 PM',
    amount: '₹18,500',
    status: 'Partially Paid',
    color: COLORS.warning,
    icon: 'message'
  },
  {
    id: 'DR-1026',
    title: 'Designer Panel Door',
    date: '12 Oct, 11:00 AM',
    amount: '₹32,000',
    status: 'Pending',
    color: COLORS.error,
    icon: 'setting'
  }
];

const analyticsData = [
  {
    title: 'Door Sales Growth',
    description: 'Compared with previous period',
    value: '+25.14%',
    color: COLORS.success
  },
  {
    title: 'Material Cost Ratio',
    description: 'Wood, hardware and finishing',
    value: '58%',
    color: COLORS.primaryDark
  },
  {
    title: 'Pending Custom Orders',
    description: 'Awaiting production or delivery',
    value: '42',
    color: COLORS.warning
  }
];

export default function DashboardDefault() {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
  const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('Monthly');

  const closeOrderMenu = () => {
    setOrderMenuAnchor(null);
  };

  const closeAnalyticsMenu = () => {
    setAnalyticsMenuAnchor(null);
  };

  const handleExport = (format) => {
    const headers = [
      'Order ID',
      'Door Type',
      'Customer',
      'Amount',
      'Status'
    ];

    // Demo records: replace these with your actual order data.
    const orders = [
      ['DR-1024', 'Teak Main Door', 'Arun Kumar', '45000', 'In Production'],
      ['DR-1025', 'Modern Flush Door', 'Priya S', '18500', 'Completed'],
      ['DR-1026', 'Designer Panel Door', 'Karthik R', '32000', 'Pending']
    ];

    if (format === 'Print') {
      window.print();
      closeOrderMenu();
      return;
    }

    // CSV can be opened directly in Excel.
    const csv = [headers, ...orders]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'door-customization-orders.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    closeOrderMenu();
  };

  return (
    <Grid
      container
      rowSpacing={4}
      columnSpacing={2.75}
      sx={{
        minHeight: '100vh',
        p: { xs: 1, sm: 2 },
        backgroundColor: COLORS.background,

        '& .MuiTypography-root': {
          letterSpacing: '0.01em'
        },

        '& .MuiCard-root': {
          borderColor: COLORS.border
        },

        '& .MuiListItemButton-root:hover': {
          backgroundColor: COLORS.primaryLighter
        },

        '& .MuiMenu-paper': {
          border: `1px solid ${COLORS.border}`,
          borderRadius: 2,
          boxShadow: '0 4px 16px rgba(46, 125, 50, 0.12)'
        },

        '& .MuiMenuItem-root.Mui-selected': {
          backgroundColor: COLORS.primaryLighter
        }
      }}
    >
      {/* =========================================
          ROW 1: DASHBOARD HEADER
      ========================================= */}
      <Grid size={12}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            border: `1px solid ${COLORS.border}`,
            background: `linear-gradient(120deg, ${COLORS.primaryLighter} 0%, ${COLORS.white} 100%)`,
            boxShadow: '0 3px 12px rgba(46, 125, 50, 0.05)'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: COLORS.primaryDarker,
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.4rem', sm: '2rem' }
            }}
          >
            Custom Car - Dashboard
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: COLORS.secondaryText }}
          >
            Manage car design, customer orders, manufacturing,
            revenue and installation.
          </Typography>
        </Box>
      </Grid>

      {/* =========================================
          ROW 1: STATISTICS
      ========================================= */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Box
          sx={{
            p: 0.5,
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            boxShadow: '0 3px 12px rgba(46, 125, 50, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: COLORS.primary,
              boxShadow: '0 5px 16px rgba(46, 125, 50, 0.12)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <AnalyticEcommerce
            title="Total Car Designs"
            count="1,245"
            percentage={18.6}
            extra="156 new designs"
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Box
          sx={{
            p: 0.5,
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            boxShadow: '0 3px 12px rgba(46, 125, 50, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: COLORS.primary,
              boxShadow: '0 5px 16px rgba(46, 125, 50, 0.12)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <AnalyticEcommerce
            title="Total Car Orders"
            count="856"
            percentage={24.8}
            extra="124 this month"
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Box
          sx={{
            p: 0.5,
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            boxShadow: '0 3px 12px rgba(46, 125, 50, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: COLORS.primary,
              boxShadow: '0 5px 16px rgba(46, 125, 50, 0.12)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <AnalyticEcommerce
            title="In Production"
            count="128"
            percentage={12.5}
            extra="42 awaiting installation"
            color="success"
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Box
          sx={{
            p: 0.5,
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            boxShadow: '0 3px 12px rgba(46, 125, 50, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: COLORS.primary,
              boxShadow: '0 5px 16px rgba(46, 125, 50, 0.12)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <AnalyticEcommerce
            title="Total Revenue"
            count="₹24.8L"
            percentage={15.2}
            extra="₹4.2L this month"
            color="success"
          />
        </Box>
      </Grid>

      {/* =========================================
          ROW 2: CUSTOMER VISITS
      ========================================= */}
      {/* <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Box
          sx={{
            '& .MuiCard-root': {
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 3,
              boxShadow: '0 3px 12px rgba(46, 125, 50, 0.05)'
            }
          }}
        >
          <UniqueVisitorCard />
        </Box>
      </Grid> */}

      {/* Production Overview */}
      {/* <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Typography variant="h5" sx={headingSX}>
          Production Overview
        </Typography>

        <MainCard sx={cardSX} content={false}>
          <Box
            sx={{
              p: 3,
              pb: 0,
              background: `linear-gradient(180deg, ${COLORS.primaryLighter} 0%, ${COLORS.white} 100%)`
            }}
          >
            <Typography variant="h6" sx={{ color: COLORS.secondaryText }}>
              This Week's Production Value
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: COLORS.primaryDarker,
                fontWeight: 700,
                mt: 1
              }}
            >
              ₹7,65,000
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: COLORS.success, mt: 1 }}
            >
              86 doors scheduled for production
            </Typography>
          </Box>

          <MonthlyBarChart />
        </MainCard>
      </Grid> */}

      {/* =========================================
          ROW 3: RECENT ORDERS
      ========================================= */}
      {/* <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={headingSX}>
            Recent Car Orders
          </Typography>

          <IconButton
            aria-label="Car order actions"
            onClick={(event) => setOrderMenuAnchor(event.currentTarget)}
            sx={iconButtonSX}
          >
            <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
          </IconButton>

          <Menu
            anchorEl={orderMenuAnchor}
            open={Boolean(orderMenuAnchor)}
            onClose={closeOrderMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem onClick={() => handleExport('CSV')}>
              Export as CSV
            </MenuItem>

            <MenuItem onClick={() => handleExport('Excel')}>
              Export for Excel
            </MenuItem>

            <MenuItem onClick={() => handleExport('Print')}>
              Print Orders
            </MenuItem>
          </Menu>
        </Stack>

        <MainCard sx={cardSX} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid> */}

      {/* Business Analytics */}
      {/* <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={headingSX}>
            Business Analytics
          </Typography>

          <IconButton
            aria-label="Analytics period"
            onClick={(event) =>
              setAnalyticsMenuAnchor(event.currentTarget)
            }
            sx={iconButtonSX}
          >
            <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
          </IconButton>

          <Menu
            anchorEl={analyticsMenuAnchor}
            open={Boolean(analyticsMenuAnchor)}
            onClose={closeAnalyticsMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            {['Weekly', 'Monthly', 'Yearly'].map((period) => (
              <MenuItem
                key={period}
                selected={analyticsPeriod === period}
                onClick={() => {
                  setAnalyticsPeriod(period);
                  closeAnalyticsMenu();
                }}
              >
                {period}
              </MenuItem>
            ))}
          </Menu>
        </Stack>

        <MainCard sx={cardSX} content={false}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              backgroundColor: COLORS.primaryLighter,
              borderBottom: `1px solid ${COLORS.border}`
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: COLORS.primaryDark }}
            >
              {analyticsPeriod} Performance
            </Typography>
          </Box>

          <List sx={{ p: 1 }}>
            {analyticsData.map((item, index) => (
              <ListItemButton
                key={item.title}
                divider={index !== analyticsData.length - 1}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: COLORS.primaryLighter
                  }
                }}
              >
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: COLORS.text
                  }}
                  secondaryTypographyProps={{
                    fontSize: 11,
                    color: COLORS.secondaryText
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    color: item.color,
                    ml: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.value}
                </Typography>
              </ListItemButton>
            ))}
          </List>

          <ReportAreaChart />
        </MainCard>
      </Grid> */}

      {/* =========================================
          ROW 4: SALES REPORT
      ========================================= */}
      {/* <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Typography variant="h5" sx={{ ...headingSX, mb: 2 }}>
          Car Sales Report
        </Typography>

        <Box
          sx={{
            '& .MuiCard-root': {
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 3,
              boxShadow: '0 3px 12px rgba(46, 125, 50, 0.05)'
            }
          }}
        >
          <SaleReportCard />
        </Box>
      </Grid> */}

      {/* =========================================
          ROW 4: PAYMENT HISTORY
      ========================================= */}
      {/* <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Typography variant="h5" sx={headingSX}>
          Car Order Payments
        </Typography>

        <MainCard sx={cardSX} content={false}>
          <List
            sx={{
              p: 1,
              '& .MuiListItem-root': {
                px: 1,
                py: 1.5
              }
            }}
          >
            {paymentData.map((payment, index) => (
              <ListItem
                key={payment.id}
                divider={index !== paymentData.length - 1}
                sx={{
                  borderColor: COLORS.border,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: COLORS.primaryLighter
                  }
                }}
                secondaryAction={null}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      ...avatarSX,
                      color: COLORS.primaryDark,
                      backgroundColor: COLORS.primaryLighter
                    }}
                  >
                    {payment.icon === 'gift' ? (
                      <GiftOutlined />
                    ) : payment.icon === 'message' ? (
                      <MessageOutlined />
                    ) : (
                      <SettingOutlined />
                    )}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={payment.id}
                  secondary={
                    <>
                      {payment.title}
                      {'\n'}
                      {payment.date}
                    </>
                  }
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: COLORS.text
                  }}
                  secondaryTypographyProps={{
                    fontSize: 11,
                    sx: {
                      color: COLORS.secondaryText,
                      whiteSpace: 'pre-line'
                    }
                  }}
                />

                <Stack
                  sx={{
                    alignItems: 'flex-end',
                    ml: 1,
                    minWidth: 90
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: COLORS.text,
                      fontWeight: 600
                    }}
                  >
                    {payment.amount}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: payment.color,
                      fontWeight: 600,
                      textAlign: 'right'
                    }}
                  >
                    {payment.status}
                  </Typography>
                </Stack>
              </ListItem>
            ))}
          </List>
        </MainCard>

        <MainCard sx={cardSX}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={headingSX}>
                Customization Support
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: COLORS.secondaryText }}
              >
                Design, material and installation assistance
              </Typography>
            </Box>

            <AvatarGroup
              sx={{
                justifyContent: 'flex-start',
                '& .MuiAvatar-root': {
                  width: 36,
                  height: 36,
                  borderColor: COLORS.white
                }
              }}
            >
              <Avatar alt="Design Consultant" src={avatar1} />
              <Avatar alt="Production Manager" src={avatar2} />
              <Avatar alt="Installation Expert" src={avatar3} />
              <Avatar alt="Customer Support" src={avatar4} />
            </AvatarGroup>

            <Typography
              variant="body2"
              sx={{ color: COLORS.secondaryText }}
            >
              Get assistance with custom sizes, wood types, Car finishes
              and installation schedules.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              href="mailto:support@example.com"
              sx={{
                py: 1.1,
                backgroundColor: COLORS.primaryLight,
                color: COLORS.primaryDarker,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: COLORS.primary,
                  boxShadow: '0 3px 8px rgba(46, 125, 50, 0.15)'
                }
              }}
            >
              Contact Support
            </Button>
          </Stack>
        </MainCard>
      </Grid> */}
    </Grid>
  );
}


