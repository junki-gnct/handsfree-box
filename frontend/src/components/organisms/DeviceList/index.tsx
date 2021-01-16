import './devicelist.scss';
import React, { useEffect, useState } from 'react';
import { DeviceListProps, Device } from './interface';

import {
  Button,
  Card,
  CardActionArea,
  Typography,
  Divider,
  Badge,
} from '@material-ui/core';
import { PriorityHigh, Check, Refresh } from '@material-ui/icons';

import { database } from '../../../utils/Firebase';

const DeviceList: React.FunctionComponent<DeviceListProps> = ({
  user,
  devices,
}) => {
  type DeviceConnectingStatus = {
    [key: string]: boolean;
  };

  const [connectingList, setConnectingList] = useState<DeviceConnectingStatus>(
    {},
  );
  const [isFirstRun, setFirstRun] = useState<boolean>(true);
  const [currentTask] = useState<(NodeJS.Timeout | null)[]>([]);

  useEffect(() => {
    if (user && isFirstRun && devices.length != 0) {
      console.log('created');
      refreshDevices();
      setFirstRun(false);
    } else if (!isFirstRun) {
      console.log('updated');
      updateDevice();
    }
  }, [user, devices]);

  const updateDevice = (): void => {
    const list: DeviceConnectingStatus = { ...connectingList };
    devices.forEach((device) => {
      if (device.isOnline) list[device.id] = false;
    });
    setConnectingList(list);
  };

  const refreshDevices = (): void => {
    if (user) {
      if (currentTask[0] != null) {
        clearTimeout(currentTask[0]);
      }

      const list: DeviceConnectingStatus = {};
      devices.forEach((device) => {
        const ref = database.ref('/' + user.uid + '/' + device.id);
        ref.update({
          isOnline: false,
        });
        list[device.id] = true;
      });

      setConnectingList(list);
      currentTask[0] = setTimeout(() => {
        const list: DeviceConnectingStatus = {};
        devices.forEach((device) => (list[device.id] = false));
        currentTask[0] = null;
        setConnectingList(list);
      }, 5000);
    }
  };

  const handleClicked = (device: Device): void => {
    alert(device.id);
  };

  return (
    <>
      <div className="listrefresh">
        <Button onClick={refreshDevices}>
          <Refresh className="listrefresh__icon" />
          <span className="listrefresh__label">更新する</span>
        </Button>
      </div>
      <div className="devicelist">
        {devices.map((device, index) => (
          <Card className="devicelist__device" key={index} variant="elevation">
            <CardActionArea onClick={() => handleClicked(device)}>
              <span className="devicelist__device__area">
                <Typography
                  className="devicelist__device__title"
                  color="textSecondary"
                  gutterBottom
                >
                  {device.id}
                </Typography>
                <Typography variant="h5" component="h2">
                  {device.name}
                </Typography>
                <Typography className="devicelist__device__pos">
                  <span className="devicelist__device__pos__content">
                    {!device.isOnline ? (
                      <span>&nbsp;</span>
                    ) : device.isOpen ? (
                      <>
                        <Check className="devicelist__device__pos__content__check" />
                        <span>荷物なし</span>
                      </>
                    ) : (
                      <>
                        <PriorityHigh className="devicelist__device__pos__content__attention" />
                        <span>荷物あり</span>
                      </>
                    )}
                  </span>
                </Typography>
                <Divider />
                <Typography variant="h5" component="h2">
                  <Badge
                    color={
                      connectingList[device.id]
                        ? 'secondary'
                        : device.isOnline
                        ? 'primary'
                        : 'error'
                    }
                    variant="dot"
                    className="devicelist__device__statusbadge"
                  />
                  <span className="devicelist__device__status">
                    {connectingList[device.id]
                      ? '接続中...'
                      : device.isOnline
                      ? ' オンライン'
                      : ' オフライン'}
                  </span>
                </Typography>
              </span>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DeviceList;
