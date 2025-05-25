// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"6eWNN":[function(require,module,exports,__globalThis) {
var _polyfill = require("@babel/polyfill");
var _loginJs = require("./login.js");
var _signupJs = require("./signup.js");
var _leafletJs = require("./leaflet.js");
var _updateSettingsJs = require("./updateSettings.js");
var _resetPasswordJs = require("./resetPassword.js");
var _stripeJs = require("./stripe.js");
// DOM elements
document.addEventListener('DOMContentLoaded', ()=>{
    const mapContainer = document.getElementById('map');
    const loginForm = document.querySelector('.form--login');
    const signupForm = document.querySelector('.form--signup');
    const accountForm = document.querySelector('.form-user-data');
    const userPasswordForm = document.querySelector('.form-user-password');
    const logOutBtn = document.querySelector('.nav__el--logout');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const bookBtn = document.getElementById('book-tour');
    if (bookBtn) bookBtn.addEventListener('click', (e)=>{
        e.target.textContent = 'Processing...';
        const tourId = e.target.dataset.tourId;
        (0, _stripeJs.bookTour)(tourId);
    });
    if (mapContainer) {
        const locations = JSON.parse(document.getElementById('map').dataset.locations);
        (0, _leafletJs.displayMap)(locations);
    }
    if (loginForm) loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        (0, _loginJs.login)(email, password);
    });
    if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email) return;
        await (0, _resetPasswordJs.forgotPassword)(email);
        // return to /login page
        setTimeout(()=>{
            location.assign('/login');
        }, 3500);
    });
    if (resetPasswordForm) resetPasswordForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirmPassword').value;
        const resetToken = document.querySelector('input[name="token"]').value;
        try {
            await (0, _resetPasswordJs.resetPassword)(resetToken, password, passwordConfirm);
            setTimeout(()=>{
                location.assign('/login');
            }, 3500);
        } catch (err) {
            console.error(err);
        }
    });
    if (signupForm) signupForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('passwordConfirm').value;
        (0, _signupJs.signup)(name, email, password, confirmPassword);
    });
    if (logOutBtn) logOutBtn.addEventListener('click', (0, _loginJs.logout));
    if (accountForm) accountForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        //reacreate multipart form data
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        (0, _updateSettingsJs.updateSettings)(form, 'data');
    });
    if (userPasswordForm) userPasswordForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await (0, _updateSettingsJs.updateSettings)({
            passwordCurrent,
            password,
            passwordConfirm
        }, 'password');
        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
});

},{"@babel/polyfill":"@babel/polyfill","./login.js":"kupI4","./signup.js":"9FRvz","./leaflet.js":"hrjZ9","./updateSettings.js":"1mxXb","./resetPassword.js":"gLf7W","./stripe.js":"1C8pd"}],"kupI4":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "login", ()=>login);
parcelHelpers.export(exports, "logout", ()=>logout);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
var _alerts = require("./alerts");
const login = async (email, password)=>{
    try {
        const res = await (0, _axiosDefault.default)({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', 'Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 150);
        }
    } catch (err) {
        (0, _alerts.showAlert)('error', err.response.data.message);
    }
};
const logout = async ()=>{
    try {
        const res = await (0, _axiosDefault.default)({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if (res.data.status === 'success') location.reload(true);
    } catch (err) {
        (0, _alerts.showAlert)('error', 'Error logging out! Try again');
    }
};

},{"axios":"axios","./alerts":"7Yk1x","@parcel/transformer-js/src/esmodule-helpers.js":"fbsKL"}],"7Yk1x":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "hideAlert", ()=>hideAlert);
parcelHelpers.export(exports, "showAlert", ()=>showAlert);
const hideAlert = ()=>{
    const el = document.querySelector('.alert');
    if (el) el.remove();
};
const showAlert = (type, msg, time = 8)=>{
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.body.insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fbsKL"}],"fbsKL":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"9FRvz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "signup", ()=>signup);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
var _alerts = require("./alerts");
const signup = async (name, email, password, passwordConfirm)=>{
    try {
        const res = await (0, _axiosDefault.default)({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });
        if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', 'Account created verification email sent!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 3000);
        }
    } catch (err) {
        (0, _alerts.showAlert)('error', err.response.data.message);
    }
};

},{"axios":"axios","./alerts":"7Yk1x","@parcel/transformer-js/src/esmodule-helpers.js":"fbsKL"}],"hrjZ9":[function(require,module,exports,__globalThis) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "displayMap", ()=>displayMap);
const displayMap = (locations)=>{
    const map = L.map('map', {
        center: [
            20,
            0
        ],
        zoom: 2,
        zoomControl: false,
        zoomScroll: false,
        zoomAnimation: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const points = [];
    locations.forEach((loc)=>{
        points.push([
            loc.coordinates[1],
            loc.coordinates[0]
        ]);
        L.marker([
            loc.coordinates[1],
            loc.coordinates[0]
        ]).addTo(map).bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
            autoClose: false
        }).openPopup();
    });
    const bounds = L.latLngBounds(points).pad(0.5);
    const polyline = L.polyline(points, {
        color: 'green',
        weight: 2,
        renderer: L.canvas()
    }).addTo(map);
    map.on('zoomed', ()=>{
        const zoom = map.getZoom();
        polyline.setStyle({
            weight: Math.max(1, 6 - zoom)
        });
    });
    map.flyToBounds(bounds, {
        duration: 1.5
    });
    map.scrollWheelZoom.disable();
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fbsKL"}],"1mxXb":[function(require,module,exports,__globalThis) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "updateSettings", ()=>updateSettings);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
var _alerts = require("./alerts");
const updateSettings = async (data, type)=>{
    try {
        const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';
        const res = await (0, _axiosDefault.default)({
            method: 'PATCH',
            url,
            data
        });
        if (res.data.status === 'success') (0, _alerts.showAlert)('success', `${type.toUpperCase()} updated successfully!`);
    } catch (err) {
        (0, _alerts.showAlert)('error', err.response.data.message);
    }
};

},{"axios":"axios","./alerts":"7Yk1x","@parcel/transformer-js/src/esmodule-helpers.js":"fbsKL"}],"gLf7W":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "resetPassword", ()=>resetPassword);
parcelHelpers.export(exports, "forgotPassword", ()=>forgotPassword);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
var _alerts = require("./alerts");
const resetPassword = async (resetToken, password, passwordConfirm)=>{
    try {
        const res = await (0, _axiosDefault.default)({
            method: 'PATCH',
            url: `/api/v1/users/resetPassword/${resetToken}`,
            data: {
                password,
                passwordConfirm
            }
        });
        if (password !== passwordConfirm) {
            (0, _alerts.showAlert)('error', 'Passwords do not match!');
            return;
        }
        if (res.data.status === 'success') (0, _alerts.showAlert)('success', 'Password reset successfully!');
    } catch (err) {
        (0, _alerts.showAlert)('error', err.response?.data?.message || 'Something went wrong!');
    }
};
const forgotPassword = async (email)=>{
    try {
        const res = await (0, _axiosDefault.default)({
            method: 'POST',
            url: '/api/v1/users/forgotPassword',
            data: {
                email
            }
        });
        if (res.data.status === 'success') (0, _alerts.showAlert)('success', 'Check your email for the reset link');
    } catch (err) {
        (0, _alerts.showAlert)('error', err.response?.data?.message || 'Something went wrong!');
    }
};

},{"axios":"axios","./alerts":"7Yk1x","@parcel/transformer-js/src/esmodule-helpers.js":"fbsKL"}],"1C8pd":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "bookTour", ()=>bookTour);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
var _alerts = require("./alerts");
const bookTour = async (tourId)=>{
    const stripe = Stripe('pk_test_51RSOhfHBugTWRfi4JVfGXs6eC9uaxLmiNHUjoK75ITkFfGTQgLvv7E56nbWwbCKOtMqoKmiatzzrotcNTmRbO8r500789f9pSB');
    // 1) Get checkout session from API
    try {
        const session = await (0, _axiosDefault.default)(`/api/v1/bookings/checkout-session/${tourId}`, {
            method: 'GET',
            params: {
                tourId
            }
        });
        // 2) Create checkout form  + charge the credit card  
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
        // 3) If successful, show success message
        (0, _alerts.showAlert)('success', 'Your payment was successful! Thank you for booking with us.');
    } catch (err) {
        (0, _alerts.showAlert)('error', 'There was an error processing your payment. Please try again later.');
        console.error('Error during booking:', err);
    }
};

},{"axios":"axios","./alerts":"7Yk1x","@parcel/transformer-js/src/esmodule-helpers.js":"fbsKL"}]},["6eWNN"], "6eWNN", "parcelRequire11c7", {})

//# sourceMappingURL=index.js.map
