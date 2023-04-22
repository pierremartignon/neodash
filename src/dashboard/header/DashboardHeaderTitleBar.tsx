import { Toolbar, Badge, InputBase, Tooltip } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { Menu } from '@mui/icons-material';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { IconButton } from '@neo4j-ndl/react';
import { CameraIconSolid } from '@neo4j-ndl/react/icons';
import {
  DASHBOARD_BUTTON_IMAGE,
  DASHBOARD_BUTTON_IMAGE_SIZE,
  DASHBOARD_HEADER_COLOR,
} from '../../config/ApplicationConfig';

export const NeoDashboardHeaderTitleBar = ({
  dashboardTitle,
  downloadImageEnabled,
  onDownloadImage,
  open,
  setDashboardTitle,
  connection,
  editable,
  standalone,
  handleDrawerOpen,
  onConnectionModalOpen,
}) => {
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
  const debouncedDashboardTitleUpdate = useCallback(debounce(setDashboardTitle, 250), []);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);

  const content = (
    <Toolbar
      key={1}
      className='n-bg-primary-70'
      style={{ paddingLeft: 88, paddingRight: 24, minHeight: '64px', zIndex: 1000 }}
    >
      {!standalone ? (
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          style={
            open
              ? {
                  display: 'none',
                }
              : {
                  marginRight: 36,
                  marginLeft: -19,
                }
          }
        >
          <Menu />
        </IconButton>
      ) : (
        <></>
      )}
      <InputBase
        id='center-aligned'
        style={{ textAlign: 'center', fontSize: '22px', flexGrow: 1, color: 'white' }}
        placeholder='Dashboard Name...'
        fullWidth
        maxRows={4}
        value={dashboardTitleText}
        onChange={(event) => {
          if (editable) {
            setDashboardTitleText(event.target.value);
            debouncedDashboardTitleUpdate(event.target.value);
          }
        }}
      />
      {downloadImageEnabled ? (
        <Tooltip title={'Download Dashboard as Image'}>
          <IconButton
            aria-label={'camera'}
            style={{ marginRight: '3px', background: '#ffffff22' }}
            onClick={() => onDownloadImage()}
            size='large'
            clean
          >
            <CameraIconSolid className='n-text-light-neutral-bg-weak' aria-label={'camera icon'} />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      <Tooltip
        title={`${connection.protocol}://${connection.url}:${connection.port}`}
        placement='left'
        aria-label='host'
      >
        <IconButton
          className='logo-btn'
          aria-label={'connection '}
          style={{ background: '#ffffff22', padding: '3px' }}
          onClick={() => {
            if (!standalone) {
              onConnectionModalOpen();
            }
          }}
          size='large'
          clean
        >
          <Badge overlap='rectangular' badgeContent={''}>
            <img
              style={{ width: DASHBOARD_BUTTON_IMAGE_SIZE, height: DASHBOARD_BUTTON_IMAGE_SIZE }}
              src={DASHBOARD_BUTTON_IMAGE}
            />
          </Badge>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
  return content;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeaderTitleBar);
