I would love to add support for all the devices you have. If your device type isn't supported yet, follow the [instructions here](#adding-supported-for-new-devices).

The `type` of devices available are:

|Device  |Type|Notes  |
|:---|:---:|:---|
|Smart Plug|`Outlet`|Smart plugs that just turn on and off| 
|Smart Light Bulb Socket|`SimpleLight`|Light sockets that just turn on and off|
|Simple Light Bulb|`SimpleLight`|Light bulbs that just turn on and off|
|White and Color Light Bulb|`RGBTWLight`|Colored bulbs with tunable white and dimming functionality|
|Smart Power Strip|`MultiOutlet`<sup>[1](#smart-power-strips)</sup>|Smart power strips that allow each outlet to be turned on and off individually <small>([instructions](#smart-power-strips))</small>|
|Slightly Smart Power Strip|`Outlet`|Smart power strips that don't allow individual control of the outlets|
|Air Conditioner|`AirConditioner`<sup>[2](#air-conditioners)</sup>|Cooling and heating devices <small>([instructions](#air-conditioners))</small>|
|Heat Convector|`Convector`<sup>[3](#heat-convectors)</sup>|Heating panels <small>([instructions](#air-conditioners))</small>|


## Additional Parameters
### Smart Power Strips
These device can have any number of controllable outlets. To let the plugin know how many your device supports, add an additional parameter named `outletCount`.

```json5
{
    "name": "My Power Strip",
    "type": "MultiOutlet",
    "manufacturer": "GeekBee",
    "model": "Smart Wifi Power Strip",
    "id": "032000123456789abcde",
    "key": "0123456789abcdef",
    /* This device has 3 outlets and 2 USB ports, all individually controllable */
    "outletCount": 5
}
```

### Air Conditioners
These devices have cooling and/or heating capabilities; they could also have _dry_, _fan_, or others modes but HomeKit's definition doesn't facilitate modes other than _heat_, _cool_, and _auto_. By default, _heat_ and _cool_ modes are enabled; to let the plugin know that a device doesn't have heating or cooling capabilities, add an additional parameter named `noHeat` or `noCool` and set it to `true`. Tuya devices don't follow a unified pattern for naming the modes, for example cooling mode is called _COOL_ on Kogan's KAPRA14WFGA and _cold_ on Igenix's IG9901WIFI; by default, the plugin uses the phrases _COOL_ and _HEAT_ while communicating with your device but to let the plugin know that a device has different phrases, add additional parameters using `cmdHeat` and `cmdCool`. Additional parameters can be found in the sample below.

```json5
{
    "name": "My Air Conditioner",
    "type": "AirConditioner",
    "manufacturer": "Kogan",
    "model": "KAPRA14WFGA",
    "id": "032000123456789abcde",
    "key": "0123456789abcdef",

    /* Additional parameters to override defaults only if needed */

    /* This device has no cooling function */
    "noCool": true,

    /* This device has no heating function */
    "noHeat": true ,

    /* Override cooling phrase */
    "cmdCool": "COOL",

    /* Override heating phrase */
    "cmdHeat": "HEAT",

    /* This device has no oscillation (swinging) function */
    "noSwing": true,

    /* Minimum temperature supported, in Celsius (°C) */
    "minTemperature": 15,

    /* Maximum temperature supported, in Celsius (°C) */
    "maxTemperature": 40,

    /* Temperature change steps, in Celsius (°C) */
    "minTemperatureSteps": 1,
}
```

### Heat Convectors
The heating panels have a _low_ or _high_ setting but since HomeKit's definition doesn't accommodate that, I have mapped it to `Fan Speed`; be aware that when the fan speed slider is at the lowest value, it turns the device off. By default, the plugin uses _LOW_ and _HIGH_ to request these settings and these commands can be configured using `cmdLow` and `cmdHigh`; if your device uses _Low_ and _High_, add these two additional parameters to your config. Additional parameters can be found in the sample below.

```json5
{
    "name": "My Heat Convector",
    "type": "Convector",
    "manufacturer": "Gorenje",
    "model": "OptiHeat 2000 EWP",
    "id": "032000123456789abcde",
    "key": "0123456789abcdef",

    /* Additional parameters to override defaults only if needed */

    /* Override phrase for low setting */
    "cmdLow": "Low",

    /* Override phrase for high setting */
    "cmdHigh": "High",

    /* This device does not provide locking the physical controls */
    "noChildLock": true,

    /* This device has no function to change the temperature units */
    "noTemperatureUnit": true,

    /* Minimum temperature supported, in Celsius (°C) */
    "minTemperature": 15,

    /* Maximum temperature supported, in Celsius (°C) */
    "maxTemperature": 35
}
```

## Adding Supported for New Devices
My hope is to be able to grow the list of device types that this plugin can support. It would be hard to get my hands on every possible type of device but you can help by sending me the "signature" your device uses and I could add support for it. If you are comfortable coding, you could even raise a pull request.

To get the signature of your device, after getting its `id` and `key`, configure it as a `SimpleLight`. After restarting Homebridge, check the logs and look for `Ready to handle <your device name> with signature <a JSON string>`. Then raise an [issue](https://github.com/AMoo-Miki/homebridge-tuya-lan/issues) and put in (a) the name and type of your device, (b) the signature, and (c) if you find one, a link to its description or where it is sold online.