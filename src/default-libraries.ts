import { Library } from "./types";

export const DefaultLibraries: Record<string, Library[]> = {
  Audio: [
    {
      simplelibraries: true,
      name: "sound",
      include: "Audio/libsound",
      linker: "Audio/libsound/cmm",
      depends: ["simpletools", "m"],
    },
    {
      simplelibraries: true,
      name: "text2speech",
      include: "Audio/libtext2speech",
      linker: "Audio/libtext2speech/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "wavplayer",
      include: "Audio/libwavplayer",
      linker: "Audio/libwavplayer/cmm",
      depends: ["m"],
    },
  ],
  Convert: [
    {
      simplelibraries: true,
      name: "abvolts",
      include: "Convert/libabvolts",
      linker: "Convert/libabvolts/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "adcACpropab",
      include: "Convert/libadcACpropab",
      linker: "Convert/libadcACpropab/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "adcDCpropab",
      include: "Convert/libadcDCpropab",
      linker: "Convert/libadcDCpropab/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "dac2ch",
      include: "Convert/libdac2ch",
      linker: "Convert/libdac2ch/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "dacctr",
      include: "Convert/libdacctr",
      linker: "Convert/libdacctr/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "pwm2ch",
      include: "Convert/libpwm2ch",
      linker: "Convert/libpwm2ch/cmm",
      depends: ["m"],
    },
  ],
  Display: [
    {
      simplelibraries: true,
      name: "il3820",
      include: "Display/libil3820",
      linker: "Display/libil3820/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "lcdParallel",
      include: "Display/liblcdParallel",
      linker: "Display/liblcdParallel/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "oledc",
      include: "Display/liboledc",
      linker: "Display/liboledc/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "oledc_fontLoader",
      include: "Display/liboledc_fontLoader",
      linker: "Display/liboledc_fontLoader/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "simplegfx",
      include: "Display/libsimplegfx",
      linker: "Display/libsimplegfx/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "ssd1331",
      include: "Display/libssd1331",
      linker: "Display/libssd1331/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "vgatext",
      include: "Display/libvgatext",
      linker: "Display/libvgatext/cmm",
      depends: [],
    },
  ],
  Interface: [
    {
      simplelibraries: true,
      name: "keypad",
      include: "Interface/libkeypad",
      linker: "Interface/libkeypad/cmm",
      depends: ["m"],
    },
  ],
  Light: [
    {
      simplelibraries: true,
      name: "ws2812",
      include: "Light/libws2812",
      linker: "Light/libws2812/cmm",
      depends: [],
    },
  ],
  Misc: [
    {
      simplelibraries: true,
      name: "mstimer",
      include: "Misc/libmstimer",
      linker: "Misc/libmstimer/cmm",
      depends: ["m"],
    },
  ],
  Motor: [
    {
      simplelibraries: true,
      name: "servo",
      include: "Motor/libservo",
      linker: "Motor/libservo/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "servo360",
      include: "Motor/libservo360",
      linker: "Motor/libservo360/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "servoAux",
      include: "Motor/libservoAux",
      linker: "Motor/libservoAux/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "servodiffdrive",
      include: "Motor/libservodiffdrive",
      linker: "Motor/libservodiffdrive/cmm",
      depends: [],
    },
  ],
  Network: [
    {
      simplelibraries: true,
      name: "wifi",
      include: "Network/libwifi",
      linker: "Network/libwifi/cmm",
      depends: ["m"],
    },
  ],
  Protocol: [
    {
      simplelibraries: true,
      name: "i2cslave",
      include: "Protocol/libi2cslave",
      linker: "Protocol/libi2cslave/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "simplei2c",
      include: "Protocol/libsimplei2c",
      linker: "Protocol/libsimplei2c/cmm",
      depends: ["m"],
    },
  ],
  Remote: [
    {
      simplelibraries: true,
      name: "sirc",
      include: "Remote/libsirc",
      linker: "Remote/libsirc/cmm",
      depends: ["m"],
    },
  ],
  Robotics: [
    {
      simplelibraries: true,
      name: "abcalibrate",
      include: "Robotics/ActivityBot/libabcalibrate",
      linker: "Robotics/ActivityBot/libabcalibrate/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "abdrive",
      include: "Robotics/ActivityBot/libabdrive",
      linker: "Robotics/ActivityBot/libabdrive/cmm",
      depends: [],
    },
  ],
  Sensor: [
    {
      simplelibraries: true,
      name: "bme680",
      include: "Sensor/libbme680",
      linker: "Sensor/libbme680/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "colorpal",
      include: "Sensor/libcolorpal",
      linker: "Sensor/libcolorpal/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "compass3d",
      include: "Sensor/libcompass3d",
      linker: "Sensor/libcompass3d/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "dht22",
      include: "Sensor/libdht22",
      linker: "Sensor/libdht22/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "fingerprint",
      include: "Sensor/libfingerprint",
      linker: "Sensor/libfingerprint/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "gps",
      include: "Sensor/libgps",
      linker: "Sensor/libgps/cmm",
      depends: [],
    },
    {
      simplelibraries: true,
      name: "lis3dh",
      include: "Sensor/liblis3dh",
      linker: "Sensor/liblis3dh/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "lsm9ds1",
      include: "Sensor/liblsm9ds1",
      linker: "Sensor/liblsm9ds1/cmm",
      depends: [],
    },
    {
      simplelibraries: true,
      name: "mma7455",
      include: "Sensor/libmma7455",
      linker: "Sensor/libmma7455/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "mx2125",
      include: "Sensor/libmx2125",
      linker: "Sensor/libmx2125/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "ping",
      include: "Sensor/libping",
      linker: "Sensor/libping/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "rfidser",
      include: "Sensor/librfidser",
      linker: "Sensor/librfidser/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "soundimpact",
      include: "Sensor/libsoundimpact",
      linker: "Sensor/libsoundimpact/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "badgetools",
      include: "Social/libbadgetools",
      linker: "Social/libbadgetools/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "badgewxtools",
      include: "Social/libbadgewxtools",
      linker: "Social/libbadgewxtools/cmm",
      depends: ["m"],
    },
  ],
  TextDevices: [
    {
      simplelibraries: true,
      name: "fdserial",
      include: "TextDevices/libfdserial",
      linker: "TextDevices/libfdserial/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "simpletext",
      include: "TextDevices/libsimpletext",
      linker: "TextDevices/libsimpletext/cmm",
      depends: ["m"],
    },
  ],
  Time: [
    {
      simplelibraries: true,
      name: "datetime",
      include: "Time/libdatetime",
      linker: "Time/libdatetime/cmm",
      depends: ["m"],
    },
  ],
  Utility: [
    {
      simplelibraries: true,
      name: "colormath",
      include: "Utility/libcolormath",
      linker: "Utility/libcolormath/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "simpletools",
      include: "Utility/libsimpletools",
      linker: "Utility/libsimpletools/cmm",
      depends: ["m"],
    },
    {
      simplelibraries: true,
      name: "stacktest",
      include: "Utility/libstacktest",
      linker: "Utility/libstacktest/cmm",
      depends: ["m"],
    },
  ],
};
