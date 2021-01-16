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
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  DialogActions,
  DialogContent,
  DialogContentText,
  Avatar,
  TextField,
} from '@material-ui/core';
import {
  PriorityHigh,
  Check,
  Refresh,
  LockOpen,
  Lock,
  Create,
  Cancel,
} from '@material-ui/icons';

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
  const [open, setOpen] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);
  const [open3, setOpen3] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [device, setDevice] = useState<Device>({
    id: '',
    name: '',
    isOnline: false,
    isOpen: false,
  });

  useEffect(() => {
    if (user && isFirstRun && devices.length != 0) {
      refreshDevices();
      setFirstRun(false);
    } else if (!isFirstRun) {
      updateDevice();
    }
  }, [user, devices]);

  const handleClose = (): void => {
    setOpen(false);
  };

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
    setDevice(device);
    setOpen(true);
  };

  const handleListItemClick = (value: number): void => {
    if (value == 1 && device.isOnline) {
      setOpen2(true);
    } else if (value == 2) {
      setOpen3(true);
    }
    handleClose();
  };

  const handleClose2 = (value: number): void => {
    if (user && value == 0) {
      database.ref('/' + user.uid + '/' + device.id).update({
        isOpen: !device.isOpen,
      });
    }
    setOpen2(false);
  };

  const handleClose3 = (value?: string): void => {
    if (user && value) {
      database.ref('/' + user.uid + '/' + device.id).update({
        name: value,
      });
    }
    setOpen3(false);
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">
          {device.name} に対する操作を選択
        </DialogTitle>
        <List>
          <ListItem
            button
            onClick={() => handleListItemClick(1)}
            disabled={!device.isOnline}
          >
            <ListItemAvatar>
              <Avatar className="dialog__avatar">
                {device.isOpen ? <Lock /> : <LockOpen />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={'鍵を' + (device.isOpen ? '閉める' : '開ける')}
              secondary={
                device.isOnline ? undefined : 'オフラインのため操作できません。'
              }
            />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(2)}>
            <ListItemAvatar>
              <Avatar className="dialog__avatar">
                <Create />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="名前の変更" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(-1)}>
            <ListItemAvatar>
              <Avatar className="dialog__avatar">
                <Cancel />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="キャンセル" />
          </ListItem>
        </List>
      </Dialog>

      <Dialog
        open={open2}
        onClose={() => handleClose2(-1)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">確認</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {device.name} の鍵を{device.isOpen ? '閉め' : '開け'}ますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose2(1)} color="primary">
            いいえ
          </Button>
          <Button onClick={() => handleClose2(0)} color="primary" autoFocus>
            はい
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open3}
        onClose={() => handleClose3(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">名前の変更</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              label="デバイス名"
              defaultValue={device.name}
              onChange={(e) => setNewName(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose3(undefined)} color="primary">
            キャンセル
          </Button>
          <Button
            onClick={() => handleClose3(newName)}
            color="primary"
            autoFocus
          >
            決定
          </Button>
        </DialogActions>
      </Dialog>

      <div className="listtitle">
        <span className="listtitle__span">デバイスリスト</span>
      </div>
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
                        <span>荷物なし (未施錠)</span>
                      </>
                    ) : (
                      <>
                        <PriorityHigh className="devicelist__device__pos__content__attention" />
                        <span>荷物あり (施錠)</span>
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
