const request = require('request');

import { PlatformConfig, Logger } from 'homebridge';

export class HttpRequest {

  readonly urlLogin = 'https://cloud.linked-go.com:449/crmservice/api/app/user/login';
  readonly urlDevicesList = 'https://cloud.linked-go.com:449/crmservice/api/app/device/deviceList';
  readonly urlDevicesData = 'https://cloud.linked-go.com:449/crmservice/api/app/device/getDataByCode';
  readonly urlUpdateDevice = 'https://cloud.linked-go.com:449/crmservice/api/app/device/control';
  
  constructor(
    public readonly config: PlatformConfig,
    public readonly log: Logger,
  ) {}

  createInstance() {
    return {};
  }

  Login() {

    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlLogin,
          method: 'POST',
          headers: {
            'x-token': '',
          },
          body: {
            password: this.config['Password'],
            login_source: 'IOS',
            type: '2',
            user_name: this.config['UserName'],
          },
          json: true,
        }, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  GetDeviceList(token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlDevicesList,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  GetDeviceStatus(deviceCode: string, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlDevicesData,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            device_code: deviceCode,
            protocal_codes: ['T02', 'T05', 'T12', 'R02', 'power', 'Manual-mute'],
          },
          json: true,
        }, (error, response, body) => {

          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            //this.log.error('error');
            reject(error);
          } else {
            //this.log.error(response);
            resolve(body);
          }
        });
    });
  }

  ChangePowerOfDevice(deviceCode: string, turnOn: boolean, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlUpdateDevice,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            param: [{
              device_code: deviceCode,
              value: turnOn? '1':'0',
              protocol_code: 'Power',
            }],
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  ChangeTargetTemperatureOfDevice(deviceCode: string, value: string, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlUpdateDevice,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            param: [{
              device_code: deviceCode,
              value: value,
              protocol_code: 'R02',
            }],
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  ChangeSilenceModeOfDevice(deviceCode: string, value: string, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlUpdateDevice,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            param: [{
              device_code: deviceCode,
              value: value,
              protocol_code: 'Manual-mute',
            }],
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

}