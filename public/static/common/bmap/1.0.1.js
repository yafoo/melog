/*! vue-bmap-gl v1.0.1 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueBMap = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

  const makeInstaller = (components = []) => {
    const apps = [];
    const install = (app) => {
      if (apps.includes(app))
        return;
      apps.push(app);
      components.forEach((c) => app.use(c));
    };
    return {
      install
    };
  };

  const withInstall = (main, extra) => {
    main.install = (app) => {
      for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
        app.component(comp.name, comp);
      }
    };
    if (extra) {
      for (const [key, comp] of Object.entries(extra)) {
        main[key] = comp;
      }
    }
    return main;
  };

  const DEFAULT_AMP_CONFIG = {
    ak: null,
    v: "1.0",
    type: "webgl",
    protocol: "https",
    hostAndPath: "api.map.baidu.com/api",
    callback: "bmapInitComponent",
    plugins: ""
  };
  class AMapAPILoader {
    constructor(config) {
      this._config = {
        ...DEFAULT_AMP_CONFIG,
        ...config
      };
      this._document = document;
      this._window = window;
      this._scriptLoaded = false;
    }
    load() {
      if (this._scriptLoadingPromise)
        return this._scriptLoadingPromise;
      const script = this._document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.src = this._getScriptSrc();
      this._scriptLoadingPromise = new Promise((resolve, reject) => {
        this._window["bmapInitComponent"] = () => {
          this._loadPlugins(() => {
            resolve();
          });
        };
        script.onerror = (error) => reject(error);
      });
      this._document.head.appendChild(script);
      return this._scriptLoadingPromise;
    }
    _getScriptSrc() {
      const config = this._config;
      const paramKeys = ["v", "ak", "type", "callback"];
      const params = Object.keys(config).filter((k) => ~paramKeys.indexOf(k)).filter((k) => config[k] != null).filter((k) => {
        return !Array.isArray(config[k]) || Array.isArray(config[k]) && config[k].length > 0;
      }).map((k) => {
        let v = config[k];
        if (Array.isArray(v))
          return { key: k, value: v.join(",") };
        return { key: k, value: v };
      }).map((entry) => `${entry.key}=${entry.value}`).join("&");
      return `${this._config.protocol}://${this._config.hostAndPath}?${params}`;
    }
    _loadPlugins(callback) {
      if (!this._config.plugins || this._config.plugins.trim() === "") {
        callback();
        return;
      }
      let plugins = this._config.plugins.split(",");
      if (plugins.length > 0) {
        let pluginsLength = plugins.length;
        let loadedNumber = 0;
        plugins.forEach((name) => {
          name = name.trim();
          if (name === "") {
            pluginsLength--;
            return;
          }
          let src = this._getPluginSrc(name);
          const script = this._document.createElement("script");
          script.type = "text/javascript";
          script.src = src;
          this._document.head.appendChild(script);
          script.addEventListener("load", () => {
            loadedNumber++;
            if (pluginsLength === loadedNumber) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
    }
    _getPluginSrc(name) {
      return `//mapopen.bj.bcebos.com/github/BMapGLLib/${name}/src/${name}.min.js`;
    }
  }

  let lazyBMapApiLoaderInstance = null;
  const initBMapApiLoader = (config) => {
    if (lazyBMapApiLoaderInstance)
      return;
    if (!lazyBMapApiLoaderInstance)
      lazyBMapApiLoaderInstance = new AMapAPILoader(config);
    lazyBMapApiLoaderInstance.load();
  };

  function guid() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr(s[19] & 3 | 8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  }

  function toSize(arr) {
    if (!arr || !Array.isArray(arr))
      return null;
    return new BMapGL.Size(arr[0], arr[1]);
  }
  function pixelTo(pixel) {
    if (Array.isArray(pixel))
      return pixel;
    return [pixel.x, pixel.y];
  }
  function toLngLat(arr) {
    if (!arr || !Array.isArray(arr))
      return null;
    return new BMapGL.Point(arr[0], arr[1]);
  }
  function lngLatTo(lngLat) {
    if (!lngLat)
      return null;
    return [lngLat.lng, lngLat.lat];
  }
  const commonConvertMap = {
    position: toLngLat,
    offset: toSize
  };

  var camelcase = function () {
  	var str = [].map.call(arguments, function (str) {
  		return str.trim();
  	}).filter(function (str) {
  		return str.length;
  	}).join('-');

  	if (!str.length) {
  		return '';
  	}

  	if (str.length === 1 || !(/[_.\- ]+/).test(str) ) {
  		if (str[0] === str[0].toLowerCase() && str.slice(1) !== str.slice(1).toLowerCase()) {
  			return str;
  		}

  		return str.toLowerCase();
  	}

  	return str
  	.replace(/^[_.\- ]+/, '')
  	.toLowerCase()
  	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
  		return p1.toUpperCase();
  	});
  };

  var camelCase = camelcase;

  var uppercamelcase = function () {
  	var cased = camelCase.apply(camelCase, arguments);
  	return cased.charAt(0).toUpperCase() + cased.slice(1);
  };

  var upperCamelCase = uppercamelcase;

  let eventHelper;
  class EventHelper {
    constructor() {
      this._listener = /* @__PURE__ */ new Map();
    }
    addListener(instance, eventName, handler, context) {
      if (!BMapGL)
        throw new Error("please wait for Map API load");
      if (!instance.addEventListener) {
        return;
      }
      instance.addEventListener(eventName, handler, context);
      if (!this._listener.get(instance))
        this._listener.set(instance, {});
      const listenerMap = this._listener.get(instance);
      if (!listenerMap[eventName])
        listenerMap[eventName] = [];
      listenerMap[eventName].push(handler);
    }
    removeListener(instance, eventName, handler) {
      if (!BMapGL)
        throw new Error("please wait for Map API load");
      if (!instance.removeEventListener) {
        return;
      }
      if (!this._listener.get(instance) || !this._listener.get(instance)[eventName])
        return;
      const listenerArr = this._listener.get(instance)[eventName];
      if (handler) {
        const lIndex = listenerArr.indexOf(handler);
        instance.removeEventListener(eventName, listenerArr[lIndex]);
        listenerArr.splice(lIndex, 1);
      } else {
        listenerArr.forEach((listener) => {
          instance.removeEventListener(eventName, listener);
        });
        this._listener.get(instance)[eventName] = [];
      }
    }
    addListenerOnce(instance, eventName, handler, context) {
      return instance.on(eventName, handler, context, true);
    }
    trigger(instance, eventName, args) {
      return instance.emit(eventName, args);
    }
    clearListeners(instance) {
      const listeners = this._listener.get(instance);
      if (!listeners)
        return;
      Object.keys(listeners).map((eventName) => {
        instance.clearEvents(eventName);
      });
    }
  }
  eventHelper = eventHelper || new EventHelper();
  var eventHelper$1 = eventHelper;

  function convertEventToLowerCase(functionName) {
    if (!functionName || functionName.length < 4) {
      return functionName;
    }
    const func = functionName.substring(3, functionName.length);
    const firstLetter = functionName[2].toLowerCase();
    return firstLetter + func;
  }
  const eventReg = /^on[A-Z]+/;

  var registerMixin = vue.defineComponent({
    inheritAttrs: false,
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      zIndex: {
        type: Number
      }
    },
    emits: ["init"],
    data() {
      return {
        needInitComponents: [],
        unwatchFns: [],
        propsRedirect: {},
        converters: {}
      };
    },
    mounted() {
      this.$parentComponent = this.$parentComponent || this.$parent.$amapComponent;
      if (this.$parentComponent) {
        this.register();
      } else {
        this.lazyRegister();
      }
    },
    unmounted() {
      if (!this.$amapComponent)
        return;
      this.unregisterEvents();
      this.unwatchFns.forEach((item) => item());
      this.unwatchFns = [];
      this.destroyComponent();
    },
    methods: {
      getHandlerFun(prop) {
        if (this[`__${prop}`]) {
          return this[`__${prop}`];
        }
        if (prop.startsWith("enable")) {
          return (flag) => {
            let propName = prop;
            if (!flag) {
              propName = propName.replace("enable", "disable");
            }
            const method = this.$amapComponent[propName];
            if (method) {
              method.call(this.$amapComponent);
            }
          };
        }
        return this.$amapComponent[`set${upperCamelCase(prop)}`];
      },
      convertProps() {
        const props = {};
        const { $props, propsRedirect } = this;
        return Object.keys($props).reduce((res, _key) => {
          let key = _key;
          const propsValue = this.convertSignalProp(key, $props[key]);
          if (propsValue === void 0)
            return res;
          if (propsRedirect && propsRedirect[_key])
            key = propsRedirect[key];
          props[key] = propsValue;
          return res;
        }, props);
      },
      convertSignalProp(key, sourceData) {
        if (sourceData === void 0 || sourceData === null) {
          return sourceData;
        }
        if (this.converters && this.converters[key]) {
          return this.converters[key].call(this, sourceData);
        } else {
          const convertFn = commonConvertMap[key];
          if (convertFn)
            return convertFn(sourceData);
          return sourceData;
        }
      },
      registerEvents() {
        const $props = this.$attrs;
        Object.keys($props).forEach((key) => {
          if (eventReg.test(key)) {
            const eventKey = convertEventToLowerCase(key);
            eventHelper$1.addListener(this.$amapComponent, eventKey, $props[key]);
          }
        });
      },
      unregisterEvents() {
        const $props = this.$attrs;
        Object.keys($props).forEach((key) => {
          if (eventReg.test(key)) {
            const eventKey = convertEventToLowerCase(key);
            eventHelper$1.removeListener(this.$amapComponent, eventKey, $props[key]);
          }
        });
      },
      setPropWatchers() {
        const { propsRedirect, $props } = this;
        Object.keys($props).forEach((prop) => {
          let handleProp = prop;
          if (propsRedirect && propsRedirect[prop])
            handleProp = propsRedirect[prop];
          const handleFun = this.getHandlerFun(handleProp);
          if (!handleFun)
            return;
          const watchOptions = {
            deep: false
          };
          const propValueType = Object.prototype.toString.call($props[prop]);
          if (propValueType === "[object Object]" || propValueType === "[object Array]") {
            watchOptions.deep = true;
          }
          const unwatch = this.$watch(prop, (nv) => {
            handleFun.call(this.$amapComponent, this.convertSignalProp(prop, nv));
          }, watchOptions);
          this.unwatchFns.push(unwatch);
        });
      },
      initProps() {
        const props = ["editable", "visible"];
        props.forEach((propStr) => {
          if (this[propStr] !== void 0) {
            const handleFun = this.getHandlerFun(propStr);
            handleFun && handleFun.call(this.$amapComponent, this.convertSignalProp(propStr, this[propStr]));
          }
        });
      },
      lazyRegister() {
        const $parent = this.$parent;
        if ($parent && $parent.addChildComponent) {
          $parent.addChildComponent(this);
        }
      },
      addChildComponent(component) {
        this.needInitComponents.push(component);
      },
      createChildren() {
        while (this.needInitComponents.length > 0) {
          this.needInitComponents[0].$parentComponent = this.$amapComponent;
          this.needInitComponents[0].register();
          this.needInitComponents.splice(0, 1);
        }
      },
      register() {
        const res = this["__initComponent"] && this["__initComponent"](this.convertProps());
        if (res && res.then)
          res.then((instance) => this.registerRest(instance));
        else
          this.registerRest(res);
      },
      registerRest(instance) {
        if (!this.$amapComponent && instance)
          this.$amapComponent = instance;
        this.registerEvents();
        this.initProps();
        this.setPropWatchers();
        this.$emit("init", this.$amapComponent, this);
        this.createChildren();
      },
      $$getInstance() {
        return this.$amapComponent;
      },
      destroyComponent() {
        this.$amapComponent.setMap && this.$amapComponent.setMap(null);
        this.$amapComponent.close && this.$amapComponent.close();
        this.$amapComponent.editor && this.$amapComponent.editor.close();
      },
      __visible(flag) {
        if (!!this.$amapComponent && !!this.$amapComponent.show && !!this.$amapComponent.hide) {
          flag === false ? this.$amapComponent.hide() : this.$amapComponent.show();
        }
      },
      __zIndex(value) {
        if (this.$amapComponent && this.$amapComponent.setzIndex) {
          this.$amapComponent.setzIndex(value);
        }
      }
    }
  });

  var script$d = vue.defineComponent({
    name: "ElBmap",
    mixins: [registerMixin],
    props: {
      center: {
        type: Array,
        validator: (value) => value && value.length === 2
      },
      zoom: {
        type: Number
      },
      minZoom: {
        type: Number
      },
      maxZoom: {
        type: Number
      },
      mapType: {
        type: String,
        validator: (value) => ["B_NORMAL_MAP", "B_EARTH_MAP"].includes(value)
      },
      tilt: {
        type: Number
      },
      heading: {
        type: Number
      },
      enableAutoResize: {
        type: Boolean,
        default: true
      },
      enableDragging: {
        type: Boolean,
        default: true
      },
      enableInertialDragging: {
        type: Boolean,
        default: true
      },
      enableScrollWheelZoom: {
        type: Boolean,
        default: true
      },
      enableContinuousZoom: {
        type: Boolean,
        default: true
      },
      enableResizeOnCenter: {
        type: Boolean
      },
      enableDoubleClickZoom: {
        type: Boolean,
        default: true
      },
      enableKeyboard: {
        type: Boolean,
        default: true
      },
      enablePinchToZoom: {
        type: Boolean,
        default: true
      },
      enableRotateGestures: {
        type: Boolean,
        default: true
      },
      enableTiltGestures: {
        type: Boolean,
        default: true
      },
      bounds: {
        type: Array
      },
      draggingCursor: {
        type: String
      },
      defaultCursor: {
        type: String
      },
      mapStyleV2: {
        type: Object
      },
      trafficVisible: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Number,
        default: -1
      },
      preserveDrawingBuffer: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        lazyTimer: null,
        converters: {
          center(arr) {
            return toLngLat(arr);
          },
          bounds(arr) {
            return new BMapGL.Bounds(toLngLat(arr[0]), toLngLat(arr[1]));
          }
        }
      };
    },
    computed: {},
    mounted() {
      this.lazyLoadMap();
    },
    beforeUnmount() {
      if (this.lazyTimer) {
        clearTimeout(this.lazyTimer);
      }
      if (this.$amapComponent) {
        this.$amapComponent.clearOverlays();
        this.$amapComponent.destroy();
        this.$amapComponent = null;
      }
    },
    methods: {
      lazyLoadMap() {
        lazyBMapApiLoaderInstance.load().then(() => {
          if (this.lazy < 0) {
            this.createMap();
          } else {
            this.lazyTimer = setTimeout(() => {
              this.createMap();
            }, this.lazy);
          }
        });
      },
      createMap() {
        const mapElement = this.$el.querySelector(".el-vue-bmap");
        const elementID = guid();
        mapElement.id = elementID;
        const props = this.convertProps();
        this.$parentComponent = this.$amapComponent = new BMapGL.Map(elementID, props);
        if (this.center && this.zoom) {
          this.$amapComponent.centerAndZoom(toLngLat(this.center), this.zoom);
        }
        this.$amapComponent.enableScrollWheelZoom();
        if (props.tilt !== void 0) {
          this.$amapComponent.setTilt(props.tilt);
        }
        if (props.heading !== void 0) {
          this.$amapComponent.setHeading(props.heading);
        }
        if (props.trafficVisible) {
          this.$amapComponent.setTrafficOn();
        }
        if (props.mapStyleV2) {
          this.$amapComponent.setMapStyleV2(props.mapStyleV2);
        }
        if (props.defaultCursor) {
          this.$amapComponent.setDefaultCursor(props.defaultCursor);
        }
        if (props.bounds) {
          this.$amapComponent.setBounds(props.bounds);
        }
        const propKeys = Object.keys(props);
        propKeys.forEach((key) => {
          if (key.startsWith("enable")) {
            const func = this.getHandlerFun(key);
            if (func) {
              func(props[key]);
            }
          }
        });
        this.register();
        this.createChildren();
      },
      __center(point) {
        if (this.$amapComponent.setCenter) {
          const tilt = this.$amapComponent.getTilt();
          const heading = this.$amapComponent.getHeading();
          this.$amapComponent.setCenter(point, {
            noAnimation: false,
            tilt,
            heading
          });
        }
      },
      __trafficVisible(flag) {
        if (flag) {
          this.$amapComponent.setTrafficOn();
        } else {
          this.$amapComponent.setTrafficOff();
        }
      },
      __mapStyleV2(style) {
        this.$amapComponent.setMapStyleV2(style);
      }
    }
  });

  const _hoisted_1$3 = { class: "el-vue-bmap-container" };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "el-vue-bmap" }, null, -1);
  function render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
      _hoisted_2,
      vue.renderSlot(_ctx.$slots, "default")
    ]);
  }

  script$d.render = render$4;
  script$d.__file = "src/packages/map/bmap.vue";

  const ElBmap = withInstall(script$d);

  var script$c = vue.defineComponent({
    name: "ElBmapBezierCurve",
    mixins: [registerMixin],
    props: {
      path: {
        type: Array
      },
      controlPoints: {
        type: Array
      },
      strokeColor: {
        type: String
      },
      strokeOpacity: {
        type: Number
      },
      strokeWeight: {
        type: Number
      },
      strokeStyle: {
        type: String,
        validator: (value) => {
          return ["solid", "dashed"].indexOf(value) !== -1;
        }
      },
      enableMassClear: {
        type: Boolean,
        default: true
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        converters: {
          path(arr) {
            if (!Array.isArray(arr))
              return [];
            return arr.map(toLngLat);
          },
          controlPoints(arr) {
            if (!Array.isArray(arr))
              return [];
            return arr.map(toLngLat);
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent && this.$amapComponent.getMap()) {
        this.$amapComponent.getMap().removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.BezierCurve(options.path, options.controlPoints, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
        if (options.visible === false) {
          this.$nextTick(() => {
            this.$amapComponent.hide();
          });
        }
      },
      $$getPath() {
        return this.$amapComponent.getPath().map(lngLatTo);
      },
      $$getControlPoints() {
        return this.$amapComponent.getControlPoints().map(lngLatTo);
      }
    },
    render() {
      return null;
    }
  });

  script$c.__file = "src/packages/BezierCurve/BezierCurve.vue";

  const ElBmapBezierCurve = withInstall(script$c);

  var script$b = vue.defineComponent({
    name: "ElBmapCircle",
    mixins: [registerMixin],
    props: {
      zIndex: {
        type: Number
      },
      center: {
        type: Array
      },
      radius: {
        type: Number
      },
      strokeColor: {
        type: String
      },
      strokeOpacity: {
        type: Number
      },
      strokeWeight: {
        type: Number
      },
      fillColor: {
        type: String
      },
      fillOpacity: {
        type: Number
      },
      strokeStyle: {
        type: String,
        validator: (value) => {
          return ["solid", "dashed"].indexOf(value) !== -1;
        }
      },
      enableMassClear: {
        type: Boolean,
        default: true
      },
      enableEditing: {
        type: Boolean
      },
      enableClicking: {
        type: Boolean,
        default: true
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        converters: {
          center(arr) {
            return toLngLat(arr);
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent && this.$amapComponent.getMap()) {
        this.$amapComponent.getMap().removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.Circle(options.center, options.radius, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
        if (options.visible === false) {
          this.$nextTick(() => {
            this.$amapComponent.hide();
          });
        }
      },
      $$getCenter() {
        const center = this.$amapComponent.getCenter();
        return lngLatTo(center);
      },
      $$getRadius() {
        return this.$amapComponent.getRadius();
      }
    },
    render() {
      return null;
    }
  });

  script$b.__file = "src/packages/Circle/Circle.vue";

  const ElBmapCircle = withInstall(script$b);

  var script$a = vue.defineComponent({
    name: "ElBmapGroundOverlay",
    mixins: [registerMixin],
    props: {
      opacity: {
        type: Number
      },
      type: {
        type: String,
        validator: (value) => {
          return ["image", "video", "canvas"].indexOf(value) !== -1;
        }
      },
      url: {
        type: [String, HTMLElement],
        required: true
      },
      bounds: {
        type: Array,
        required: true
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        propsRedirect: {},
        converters: {
          bounds(arr) {
            return new BMapGL.Bounds(toLngLat(arr[0]), toLngLat(arr[1]));
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent && this.$amapComponent.getMap()) {
        this.$amapComponent.getMap().removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.GroundOverlay(options.bounds, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
        if (options.visible === false) {
          this.$nextTick(() => {
            this.$amapComponent.hide();
          });
        }
      }
    },
    render() {
      return null;
    }
  });

  script$a.__file = "src/packages/GroundOverlay/GroundOverlay.vue";

  const ElBmapGroundOverlay = withInstall(script$a);

  var script$9 = vue.defineComponent({
    name: "ElBmapInfoWindow",
    mixins: [registerMixin],
    props: {
      title: {
        type: [String, HTMLElement]
      },
      content: {
        type: [String, HTMLElement]
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      maxWidth: {
        type: Number
      },
      offset: {
        type: Array
      },
      position: {
        type: Array
      },
      visible: {
        type: Boolean,
        default: true
      },
      enableAutoPan: {
        type: Boolean,
        default: true
      },
      enableCloseOnClick: {
        type: Boolean,
        default: true
      }
    },
    emits: ["update:visible"],
    data() {
      return {
        converters: {
          offset(arr) {
            return toSize(arr);
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent.isOpen()) {
        this.$parentComponent.closeInfoWindow();
      }
      this.$amapComponent = null;
    },
    methods: {
      __initComponent(options) {
        if (!options.content) {
          options.content = this.$refs.info;
        }
        this.$amapComponent = new BMapGL.InfoWindow(options.content, options);
        this.$amapComponent.addEventListener("close", () => {
          this.$emit("update:visible", false);
        });
        this.$amapComponent.addEventListener("open", () => {
          this.$emit("update:visible", true);
        });
        if (this.visible !== false)
          this.$parentComponent.openInfoWindow(this.$amapComponent, toLngLat(this.position));
      },
      __visible(flag) {
        const position = this.position;
        if (position) {
          flag === false ? this.$parentComponent.closeInfoWindow() : this.$parentComponent.openInfoWindow(this.$amapComponent, toLngLat(position));
        }
      },
      __title(title) {
        this.$amapComponent.setTitle(title);
        this.$amapComponent._config.title = title;
        this.$amapComponent.redraw();
      },
      __position(value) {
        if (this.visible !== false) {
          this.$parentComponent.openInfoWindow(this.$amapComponent, value);
        }
      }
    }
  });

  const _hoisted_1$2 = { ref: "info" };
  function render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 512);
  }

  script$9.render = render$3;
  script$9.__file = "src/packages/InfoWindow/InfoWindow.vue";

  const ElBmapInfoWindow = withInstall(script$9);

  var script$8 = vue.defineComponent({
    name: "ElBmapInfoWindowCustom",
    mixins: [registerMixin],
    props: {
      offset: {
        type: Array,
        default: () => [0, 0]
      },
      position: {
        type: Array,
        default: () => [0, 0]
      },
      isCustom: {
        type: Boolean,
        default: false
      },
      visible: {
        type: Boolean,
        default: true
      },
      enableAutoPan: {
        type: Boolean,
        default: true
      },
      enableCloseOnClick: {
        type: Boolean,
        default: true
      },
      anchor: {
        type: String,
        default: "bottom",
        validator: (value) => ["auto", "top", "right", "bottom", "left", "top-left", "top-right", "bottom-left", "bottom-right"].includes(value)
      }
    },
    emits: ["open", "close", "update:visible"],
    data() {
      return {
        styleObj: {
          display: "block",
          left: 0,
          top: 0
        },
        anchorClass: "bottom",
        savePosition: null,
        saveVisible: false,
        savePixel: {
          x: 0,
          y: 0
        },
        mapSize: {
          width: 0,
          height: 0
        }
      };
    },
    computed: {
      computedStyle() {
        const style = {
          display: "",
          left: 0,
          top: 0
        };
        if (!this.saveVisible) {
          style.display = "none";
        } else {
          style.display = "block";
        }
        style.left = this.styleObj.left;
        style.top = this.styleObj.top;
        return style;
      }
    },
    unmounted() {
      this.unBindEvent();
      this.$amapComponent = null;
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = {};
        this.saveVisible = this.visible;
        this.mapSize = this.$parentComponent.getContainerSize();
        if (!options.position) {
          return;
        }
        this.emitEvent();
        this.savePosition = options.position;
        this.calcPosition();
        this.panMap();
        this.bindEvent();
      },
      panMap() {
        if (this.enableAutoPan) {
          this.$nextTick(() => {
            const height = this.$refs.infoWindow.offsetHeight + 11;
            const width = this.$refs.infoWindow.offsetWidth;
            const pixel = this.$parentComponent.pointToOverlayPixel(this.savePosition);
            const leftOffset = pixel.x - width / 2 + this.offset[0];
            const topOffset = pixel.y - height + this.offset[1];
            const mapWidth = this.mapSize.width;
            const mapHeight = this.mapSize.height;
            let panX = 0;
            let panY = 0;
            if (leftOffset < 0) {
              panX = Math.abs(leftOffset) + 10;
            } else if (leftOffset + width > mapWidth) {
              panX = mapWidth - leftOffset - width - 10;
            }
            if (topOffset < 0) {
              panY = Math.abs(topOffset) + 10;
            } else if (topOffset + height > mapHeight) {
              panY = mapHeight - topOffset - height - 10;
            }
            if (panX !== 0 || panY !== 0) {
              this.$parentComponent.panBy(panX, panY);
            }
          });
        }
      },
      bindEvent() {
        this.$parentComponent.on("moving", this.moveMap);
        this.$parentComponent.on("dragging", this.draggingMap);
        this.$parentComponent.on("zoomend", this.zoomendMap);
        this.$parentComponent.on("resize", this.resizeMap);
        this.$parentComponent.on("click", this.clickMap);
      },
      unBindEvent() {
        this.$parentComponent.off("moving", this.moveMap);
        this.$parentComponent.off("dragging", this.draggingMap);
        this.$parentComponent.off("zoomend", this.zoomendMap);
        this.$parentComponent.off("resize", this.resizeMap);
        this.$parentComponent.off("click", this.clickMap);
      },
      moveMap() {
        this.calcPosition();
      },
      draggingMap() {
        this.calcPosition();
      },
      zoomendMap() {
        this.calcPosition();
      },
      resizeMap() {
        this.mapSize = this.$parentComponent.getContainerSize();
        const timer = setTimeout(() => {
          this.calcPosition();
          clearTimeout(timer);
        }, 0);
      },
      clickMap() {
        if (this.enableCloseOnClick && this.saveVisible) {
          this.saveVisible = false;
          this.$emit("update:visible", false);
          this.emitEvent();
        }
      },
      calcPosition() {
        if (!this.savePosition) {
          return;
        }
        const pixel = this.$parentComponent.pointToOverlayPixel(this.savePosition);
        this.savePixel = pixel;
        this.styleObj.left = `${pixel.x + this.offset[0]}px`;
        this.styleObj.top = `${pixel.y + this.offset[1]}px`;
        this.$nextTick(() => {
          this.calcAnchor();
        });
      },
      calcAnchor() {
        if (this.anchor !== "auto" || this.enableAutoPan) {
          this.anchorClass = this.anchor !== "auto" ? this.anchor : "bottom";
          return;
        }
        const mapSize = this.mapSize;
        const mapWidth = mapSize.width;
        const mapHeight = mapSize.height;
        const arrowOffset = 11;
        const height = this.$refs.infoWindow.offsetHeight;
        const width = this.$refs.infoWindow.offsetWidth;
        const pointX = this.savePixel.x;
        const pointY = this.savePixel.y;
        let anchor = "";
        if (height + arrowOffset <= pointY && pointY <= mapHeight && width / 2 <= pointX && mapWidth - pointX >= width / 2) {
          anchor = "bottom";
        } else if (height / 2 <= pointY && mapWidth - pointX <= width / 2) {
          anchor = "right";
        } else if (height + arrowOffset + pointY <= mapHeight && width / 2 <= pointX) {
          anchor = "top";
        } else if (pointX < width / 2 && height / 2 <= pointY && pointY + height / 2 <= mapHeight) {
          anchor = "left";
        }
        if (!anchor) {
          anchor = "bottom";
        }
        this.anchorClass = anchor;
      },
      emitEvent() {
        if (!this.saveVisible) {
          this.$emit("close");
        } else if (this.saveVisible) {
          this.$emit("open");
        }
      },
      __position(value) {
        this.savePosition = value;
        this.calcPosition();
      },
      __visible(value) {
        if (this.saveVisible !== value) {
          this.saveVisible = value;
          this.emitEvent();
        }
      }
    }
  });

  const _hoisted_1$1 = {
    key: 0,
    class: "arrow"
  };
  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      ref: "infoWindow",
      class: vue.normalizeClass(["bmap-info-window-custom", [_ctx.isCustom ? "custom" : "", _ctx.anchorClass]]),
      style: vue.normalizeStyle(_ctx.computedStyle)
    }, [
      !_ctx.isCustom ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1)) : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default")
    ], 6);
  }

  script$8.render = render$2;
  script$8.__scopeId = "data-v-411218f4";
  script$8.__file = "src/packages/InfoWindowCustom/InfoWindowCustom.vue";

  const ElBmapInfoWindowCustom = withInstall(script$8);

  var script$7 = vue.defineComponent({
    name: "ElBmapLabel",
    mixins: [registerMixin],
    props: {
      content: {
        type: String
      },
      position: {
        type: Array,
        required: true
      },
      offset: {
        type: Array
      },
      title: {
        type: String
      },
      labelStyle: {
        type: Object
      },
      enableMassClear: {
        type: Boolean,
        default: true
      },
      visible: {
        type: Boolean,
        default: true
      },
      isCustom: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isVue: false,
        propsRedirect: {
          labelStyle: "style"
        },
        converters: {
          position(arr) {
            return toLngLat(arr);
          },
          offset(arr) {
            return toSize(arr);
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent && this.$amapComponent.getMap()) {
        this.$amapComponent.getMap().removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    updated() {
      if (this.isVue) {
        this.$nextTick(() => {
          this.$amapComponent.setContent(this.$refs.info.outerHTML);
        });
      }
    },
    methods: {
      __initComponent(options) {
        if (!options.content) {
          this.isVue = true;
          options.content = this.$refs.info.outerHTML;
        }
        this.$amapComponent = new BMapGL.Label(options.content, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
        if (options.style) {
          this.$amapComponent.setStyle(options.style);
        }
        if (options.isCustom) {
          this.$amapComponent.setStyle({
            border: "none",
            background: "none"
          });
        }
        if (options.visible === false) {
          this.$nextTick(() => {
            this.$amapComponent.hide();
          });
        }
      },
      __position(value) {
        this.$amapComponent.setPosition(value);
      }
    }
  });

  const _hoisted_1 = { ref: "info" };
  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 512);
  }

  script$7.render = render$1;
  script$7.__file = "src/packages/Label/Label.vue";

  const ElBmapLabel = withInstall(script$7);

  var script$6 = vue.defineComponent({
    name: "ElBmapMarker",
    mixins: [registerMixin],
    props: {
      position: {
        type: Array,
        required: true
      },
      offset: {
        type: Array
      },
      icon: {
        type: Object
      },
      enableMassClear: {
        type: Boolean,
        default: true
      },
      enableDragging: {
        type: Boolean
      },
      enableClicking: {
        type: Boolean,
        default: true
      },
      raiseOnDrag: {
        type: Boolean,
        default: false
      },
      draggingCursor: {
        type: String
      },
      rotation: {
        type: Number
      },
      visible: {
        type: Boolean,
        default: true
      },
      title: {
        type: String
      },
      label: {
        type: Object
      }
    },
    data() {
      return {
        converters: {
          position(arr) {
            return toLngLat(arr);
          },
          offset(arr) {
            return toSize(arr);
          },
          icon(options) {
            if (!options) {
              return null;
            }
            const { url, size = [16, 16], imageSize, imageOffset = [0, 0], anchor = [0, 0] } = options;
            return new BMapGL.Icon(url, toSize(size), {
              imageOffset: toSize(imageOffset),
              anchor: toSize(anchor),
              imageSize: imageSize || toSize(size)
            });
          },
          label(options) {
            if (!options) {
              return null;
            }
            const { content = "", offset = [0, 0], enableMassClear, style, title = "", zIndex } = options;
            const label = new BMapGL.Label(content, {
              title,
              offset: toSize(offset),
              enableMassClear: enableMassClear === void 0 ? true : enableMassClear
            });
            if (style) {
              label.setStyle(style);
            }
            if (zIndex !== void 0) {
              label.setZIndex(zIndex);
            }
            return label;
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent && this.$amapComponent.getMap()) {
        this.$amapComponent.getMap().removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.Marker(options.position, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
        if (options.visible === false) {
          this.$nextTick(() => {
            this.$amapComponent.hide();
          });
        }
      },
      $$getPosition() {
        return lngLatTo(this.$amapComponent.getPosition());
      },
      $$getOffset() {
        return pixelTo(this.$amapComponent.getOffset());
      },
      __label(value) {
        const preLabel = this.$amapComponent.getLabel();
        if (preLabel) {
          this.$parentComponent.removeOverlay(preLabel);
        }
        this.$amapComponent.setLabel(value);
      },
      __icon(value) {
        this.$amapComponent.setIcon(value);
      }
    },
    render() {
      return null;
    }
  });

  script$6.__file = "src/packages/Marker/Marker.vue";

  const ElBmapMarker = withInstall(script$6);

  var script$5 = vue.defineComponent({
    name: "ElBmapMarker3d",
    mixins: [registerMixin],
    props: {
      height: {
        type: Number,
        default: 0,
        required: true
      },
      position: {
        type: Array
      },
      size: {
        type: Number
      },
      icon: {
        type: Object
      },
      shape: {
        type: Number,
        validator: (value) => [1, 2].includes(value)
      },
      fillColor: {
        type: String
      },
      fillOpacity: {
        type: Number
      }
    },
    data() {
      return {
        converters: {
          position(arr) {
            return toLngLat(arr);
          },
          icon(options) {
            if (!options) {
              return null;
            }
            const { url, size = [16, 16], imageSize, imageOffset = [-8, -8], anchor = [0, 0] } = options;
            return new BMapGL.Icon(url, toSize(size), {
              imageOffset: toSize(imageOffset),
              anchor: toSize(anchor),
              imageSize: imageSize || toSize(size)
            });
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent && this.$amapComponent.getMap()) {
        this.$amapComponent.getMap().removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.Marker3D(options.position, options.height, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
      },
      $$getPosition() {
        return lngLatTo(this.$amapComponent.getPosition());
      },
      $$getSize() {
        return pixelTo(this.$amapComponent.getSize());
      }
    },
    render() {
      return null;
    }
  });

  script$5.__file = "src/packages/Marker3d/Marker3d.vue";

  const ElBmapMarker3d = withInstall(script$5);

  var script$4 = vue.defineComponent({
    name: "ElBmapMenu",
    mixins: [registerMixin],
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        converters: {},
        handlers: {}
      };
    },
    unmounted() {
      if (this.$amapComponent) {
        this.$parentComponent.removeContextMenu(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent() {
        this.$amapComponent = new BMapGL.ContextMenu();
        this.$parentComponent.addContextMenu(this.$amapComponent);
      }
    }
  });

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default");
  }

  script$4.render = render;
  script$4.__file = "src/packages/Menu/Menu.vue";

  const ElBmapMenu = withInstall(script$4);

  var script$3 = vue.defineComponent({
    name: "ElBmapMenuItem",
    mixins: [registerMixin],
    props: {
      text: {
        type: String,
        required: true
      },
      enable: {
        type: Boolean,
        default: true
      },
      width: {
        type: Number
      },
      domId: {
        type: String
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        propsRedirect: {
          domId: "id"
        },
        converters: {},
        handlers: {}
      };
    },
    unmounted() {
      if (this.$amapComponent) {
        this.$parentComponent.removeItem(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        const $contextMenu = this.$parentComponent;
        const o = {};
        if (options.width) {
          o.width = options.width;
        }
        if (options.id) {
          o.id = options.id;
        }
        this.$amapComponent = new BMapGL.MenuItem(options.text, options.callback, o);
        $contextMenu.addItem(this.$amapComponent);
        if (options.enable === false) {
          this.$amapComponent.disable();
        }
      },
      __enable(flag) {
        flag === false ? this.$amapComponent.disable() : this.$amapComponent.enable();
      }
    },
    render() {
      return null;
    }
  });

  script$3.__file = "src/packages/MenuItem/MenuItem.vue";

  const ElBmapMenuItem = withInstall(script$3);

  var script$2 = vue.defineComponent({
    name: "ElBmapPolygon",
    mixins: [registerMixin],
    props: {
      path: {
        type: Array,
        required: true
      },
      strokeColor: {
        type: String
      },
      strokeOpacity: {
        type: Number
      },
      strokeWeight: {
        type: Number
      },
      strokeStyle: {
        type: String,
        validator: (value) => ["solid", "dashed"].includes(value)
      },
      fillColor: {
        type: String
      },
      fillOpacity: {
        type: Number
      },
      enableMassClear: {
        type: Boolean,
        default: true
      },
      enableEditing: {
        type: Boolean,
        default: false
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        converters: {
          path(arr) {
            if (!Array.isArray(arr))
              return [];
            return arr.map(toLngLat);
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent && this.$amapComponent.getMap()) {
        this.$amapComponent.getMap().removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.Polygon(options.path, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
      },
      $$getPath() {
        return this.$amapComponent.getPath().map(lngLatTo);
      },
      __path(value) {
        this.$amapComponent.setPath(value);
        if (this.$amapComponent._config.enableEditing) {
          this.$amapComponent.disableEditing();
          this.$amapComponent.enableEditing();
        }
      }
    },
    render() {
      return null;
    }
  });

  script$2.__file = "src/packages/Polygon/Polygon.vue";

  const ElBmapPolygon = withInstall(script$2);

  var script$1 = vue.defineComponent({
    name: "ElBmapPolyline",
    mixins: [registerMixin],
    props: {
      geodesic: {
        type: Boolean,
        default: false
      },
      clip: {
        type: Boolean,
        default: true
      },
      path: {
        type: Array,
        required: true
      },
      strokeColor: {
        type: String
      },
      strokeOpacity: {
        type: Number
      },
      strokeWeight: {
        type: Number
      },
      strokeStyle: {
        type: String,
        validator: (value) => ["solid", "dashed"].includes(value)
      },
      enableMassClear: {
        type: Boolean,
        default: true
      },
      enableEditing: {
        type: Boolean,
        default: false
      },
      enableClicking: {
        type: Boolean,
        default: true
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        converters: {
          path(arr) {
            if (!Array.isArray(arr))
              return [];
            return arr.map(toLngLat);
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent) {
        this.$parentComponent.removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.Polyline(options.path, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
      },
      $$getPath() {
        return this.$amapComponent.getPath().map(lngLatTo);
      },
      __path(value) {
        this.$amapComponent.setPath(value);
        if (this.$amapComponent._config.enableEditing) {
          this.$amapComponent.disableEditing();
          this.$amapComponent.enableEditing();
        }
      }
    },
    render() {
      return null;
    }
  });

  script$1.__file = "src/packages/Polyline/Polyline.vue";

  const ElBmapPolyline = withInstall(script$1);

  var script = vue.defineComponent({
    name: "ElBmapPrism",
    mixins: [registerMixin],
    props: {
      path: {
        type: Array,
        required: true
      },
      altitude: {
        type: Number
      },
      topFillColor: {
        type: String
      },
      topFillOpacity: {
        type: Number
      },
      sideFillColor: {
        type: String
      },
      sideFillOpacity: {
        type: Number
      },
      enableMassClear: {
        type: Boolean,
        default: true
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        converters: {
          path(arr) {
            if (!Array.isArray(arr))
              return [];
            return arr.map(toLngLat);
          }
        }
      };
    },
    unmounted() {
      if (this.$amapComponent) {
        this.$parentComponent.removeOverlay(this.$amapComponent);
        this.$amapComponent = null;
      }
    },
    methods: {
      __initComponent(options) {
        this.$amapComponent = new BMapGL.Prism(options.path, options.altitude, options);
        this.$parentComponent.addOverlay(this.$amapComponent);
      },
      $$getPath() {
        return this.$amapComponent.getPath().map(lngLatTo);
      }
    },
    render() {
      return null;
    }
  });

  script.__file = "src/packages/Prism/Prism.vue";

  const ElBmapPrism = withInstall(script);

  var Components = [
    ElBmap,
    ElBmapBezierCurve,
    ElBmapCircle,
    ElBmapGroundOverlay,
    ElBmapInfoWindow,
    ElBmapInfoWindowCustom,
    ElBmapLabel,
    ElBmapMarker,
    ElBmapMarker3d,
    ElBmapMenu,
    ElBmapMenuItem,
    ElBmapPolygon,
    ElBmapPolyline,
    ElBmapPrism
  ];

  var installer = makeInstaller([...Components]);

  const install = installer.install;

  exports.ElBmap = ElBmap;
  exports.ElBmapBezierCurve = ElBmapBezierCurve;
  exports.ElBmapCircle = ElBmapCircle;
  exports.ElBmapGroundOverlay = ElBmapGroundOverlay;
  exports.ElBmapInfoWindow = ElBmapInfoWindow;
  exports.ElBmapInfoWindowCustom = ElBmapInfoWindowCustom;
  exports.ElBmapLabel = ElBmapLabel;
  exports.ElBmapMarker = ElBmapMarker;
  exports.ElBmapMarker3d = ElBmapMarker3d;
  exports.ElBmapMenu = ElBmapMenu;
  exports.ElBmapMenuItem = ElBmapMenuItem;
  exports.ElBmapPolygon = ElBmapPolygon;
  exports.ElBmapPolyline = ElBmapPolyline;
  exports.ElBmapPrism = ElBmapPrism;
  exports["default"] = installer;
  exports.initBMapApiLoader = initBMapApiLoader;
  exports.install = install;
  exports.makeInstaller = makeInstaller;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
