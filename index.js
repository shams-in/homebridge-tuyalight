const TuyAPI = require('tuyapi');
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-tuyalight", "tuyalight", controller);
}

function controller(log, config) {
    this.log = log;
    this.config = config;

    this.name = config["name"];
    this.ip = config["ip"];
    this.id = config["id"];
    this.key = config["key"];

    this.service = new Service.Lightbulb(this.name);
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

// get the status
controller.prototype.getOn = function(callback) {
    const option = {
        ip: this.ip,
        id: this.id,
        key: this.key
    }
    const device = new TuyAPI(option);
    device.find().then(() => {
        device.connect();
    });
    device.on('data', data => {
        callback(null, data.dps['1'])
        console.log(`[tuyalight] ${this.name} is ${data.dps['1'] ? 'on.' : 'off.'}`);
        setTimeout(() => { device.disconnect(); }, 0);
    });
}

// set the status
controller.prototype.setOn = function(on, callback) {
    const option = {
        ip: this.ip,
        id: this.id,
        key: this.key
    }
    const device = new TuyAPI(option);
    device.find().then(() => {
        device.connect();
    });
    device.on('connected', () => {
        device.set({set: on});
        callback(null, on);
        console.log(`[tuyalight] ${this.name} is turned ${on ? 'on.' : 'off.'}`);
        setTimeout(() => { device.disconnect(); }, 0);
    });
}

controller.prototype.getServices = function() {
    return [this.service];
}
