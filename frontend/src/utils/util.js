import store from '../store/store';

const utils = {
  $isEmpty(value) {
    return value === '' || (!value && value !== 0);
  },
  $isNotEmpty(value) {
    return !this.$isEmpty(value);
  },
  $getDictionaryData(name) {
    let result = [];
    let requestList = store.state.dictionaryDataSequence;
    let targetDictionary = store.state.dictionaryData[name];
    if (
      typeof targetDictionary !== 'undefined' &&
      targetDictionary.data.length !== 0
    ) {
      result = store.state.dictionaryData[name].data;
    } else {
      let getData = new Promise((resolve, reject) => {
        if (requestList.filter((item) => item === name).length === 0) {
          store.commit('pushDictionaryDataSequence', name);
          resolve();
        } else {
          reject('nonono');
        }
      });
      getData
        .then(() => {
          Vue.prototype.$http
            .get(Vue.prototype.$baseUrl + 'dictionary/dictionList', {
              params: {
                type: name
              }
            })
            .then((response) => {
              response = response.data.data;
              targetDictionary.pending = false;
              if (response.length > 0) {
                store.commit('updateDictionaryData', {
                  name: name,
                  data: response
                });
              } else {
                this.$message.error(`${name}类字典数据为空`);
              }
            })
            .catch((error) => {
              this.$message.error(`无${name}类字典数据`);
              store.commit('splitDictionaryDataSequence', name);
            });
        })
        .catch((err) => {
          // console.log(err)
        });
      result = store.state.dictionaryData[name].data;
    }
    return result;
  },
  $generateUrlParams(data) {
    let result = '?';
    Object.keys(data).forEach((item, index) => {
      if (index < Object.keys(data).length - 1) {
        result += item + '=' + data[item] + '&';
      } else {
        result += item + '=' + data[item];
      }
    });
    return result;
  },
  $fireKeyEvent(el, evtType, keyCode) {
    let doc = el.ownerDocument,
      win = doc.defaultView || doc.parentWindow,
      evtObj;
    if (doc.createEvent) {
      if (win.KeyEvent) {
        evtObj = doc.createEvent('KeyEvents');
        evtObj.initKeyEvent(
          evtType,
          true,
          true,
          win,
          false,
          false,
          false,
          false,
          keyCode,
          0
        );
      } else {
        evtObj = doc.createEvent('UIEvents');
        Object.defineProperty(evtObj, 'keyCode', {
          get: function () {
            return this.keyCodeVal;
          }
        });
        Object.defineProperty(evtObj, 'which', {
          get: function () {
            return this.keyCodeVal;
          }
        });
        evtObj.initUIEvent(evtType, true, true, win, 1);
        evtObj.keyCodeVal = keyCode;
        if (evtObj.keyCode !== keyCode) {
          console.log(
            'keyCode ' + evtObj.keyCode + ' 和 (' + evtObj.which + ') 不匹配'
          );
        }
      }
      el.dispatchEvent(evtObj);
    } else if (doc.createEventObject) {
      evtObj = doc.createEventObject();
      evtObj.keyCode = keyCode;
      el.fireEvent('on' + evtType, evtObj);
    }
  },
  $fullScreen() {
    if (!sessionStorage.getItem('isFullScreen')) {
      let element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
      }
      // sessionStorage.setItem('isFullScreen', 'true');
    }
  },
  $generateRandomList(count) {
    let orderedArr = [];
    let upsetArr = [];
    let loopTimes = count;
    let rand = 0;

    for (let i = 0; i < count; i++) {
      orderedArr.push(i);
    }
    console.log(orderedArr);
    //真随机算法
    for (let i = 0; i < loopTimes; i++) {
      rand = parseInt(Math.floor(Math.random() * count));
      for (let j = 0; j < i; j++) {
        if (upsetArr[j] === rand) {
          upsetArr.splice(j, 1);
          loopTimes++;
        }
      }
      upsetArr.push(rand);
    }
    return upsetArr;
  },
  $setMenuData(options) {
    let menuData = Object.assign(
      {
        showMenu: true
      },
      options
    );

    if (typeof localStorage.getItem('menuData') === 'undefined') {
      localStorage.setItem('menuData', menuData);
    }
  },
  $makeYearMonthDate(timeStamp = Date.parse(new Date())) {
    let result =
      Vue.prototype.$formatDate({
        date: new Date(timeStamp)
      }) +
      '年' +
      Vue.prototype.$formatDate({
        date: new Date(timeStamp),
        format: 'MM'
      }) +
      '月';
    return result;
  },
  $getDomain(options) {
    let domain = window.location.toString();
    let protocol;
    if (options === 'noProtocal') {
      domain = domain.replace(domain.substr(domain.indexOf('/#')), '');
      domain = domain.substr(domain.indexOf('://') + 3);
      return domain;
    } else {
      return domain.replace(domain.substr(domain.indexOf('/#')), '');
    }
  },
  $formatDate2(fmt) {
    let o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
      'H+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    };
    let week = {
      0: '/u65e5',
      1: '/u4e00',
      2: '/u4e8c',
      3: '/u4e09',
      4: '/u56db',
      5: '/u4e94',
      6: '/u516d'
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (RegExp.$1.length > 1
          ? RegExp.$1.length > 2
            ? '/u661f/u671f'
            : '/u5468'
          : '') + week[this.getDay() + '']
      );
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return fmt;
  },
  $formatDate(options) {
    options = Object.assign(
      {
        date: 0,
        format: 'yyyy'
      },
      options
    );
    let o = {
      'M+': options.date.getMonth() + 1, //月份
      'd+': options.date.getDate(), //日
      'h+':
        options.date.getHours() % 12 === 0 ? 12 : options.date.getHours() % 12, //小时
      'H+': options.date.getHours(), //小时
      'm+': options.date.getMinutes(), //分
      's+': options.date.getSeconds(), //秒
      'q+': Math.floor((options.date.getMonth() + 3) / 3), //季度
      S: options.date.getMilliseconds() //毫秒
    };
    let week = {
      0: '/u65e5',
      1: '/u4e00',
      2: '/u4e8c',
      3: '/u4e09',
      4: '/u56db',
      5: '/u4e94',
      6: '/u516d'
    };
    if (/(y+)/.test(options.format)) {
      options.format = options.format.replace(
        RegExp.$1,
        (options.date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    }
    if (/(E+)/.test(options.format)) {
      options.format = options.format.replace(
        RegExp.$1,
        (RegExp.$1.length > 1
          ? RegExp.$1.length > 2
            ? '/u661f/u671f'
            : '/u5468'
          : '') + week[options.date.getDay() + '']
      );
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(options.format)) {
        options.format = options.format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return options.format;
  },
  $findByKey(options) {
    options = Object.assign(
      {
        array: [],
        key: '',
        value: ''
      },
      options
    );
    let result;
    options.array.forEach((item) => {
      if (item[options.key] === options.value) {
        result = item.value;
      }
    });
    return result;
  },
  $translateXAxisName(options) {
    options = Object.assign(
      {
        list: [],
        keyName: 'key',
        dictionary: [
          {
            name: '',
            value: ''
          }
        ]
      },
      options
    );
    let result = [];
    options.list.forEach((item) => {
      let value = Vue.prototype.$findByKey({
        array: options.dictionary,
        key: options.keyName,
        value: item
      });
      if (typeof value !== 'undefined') {
        result.push(value);
      }
    });
    return result;
  },
  $quickSort(arr) {
    let that = this;
    //如果数组<=1,则直接返回
    if (arr.length <= 1) {
      return arr;
    }
    let pivotIndex = Math.floor(arr.length / 2);
    //找基准，并把基准从原数组删除
    let pivot = arr.splice(pivotIndex, 1)[0];
    //定义左右数组
    let left = [];
    let right = [];

    //比基准小的放在left，比基准大的放在right
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] <= pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    //递归
    return Vue.prototype
      .$quickSort(left)
      .concat([pivot], Vue.prototype.$quickSort(right));
  },
  $colorRgb(hex) {
    let sColor = hex.toLowerCase();
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#';
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
      }
      return 'RGB(' + sColorChange.join(',') + ')';
    }
    return sColor;
  },
  $rawArray2ChartArray(data, firstProp = 'value', secondProp = 'name') {
    let datalist = [];
    for (let i in data) {
      if (data[i] !== 0) {
        datalist.push({ [firstProp]: data[i], [secondProp]: i });
      }
    }
    datalist = datalist.reverse();
    return datalist;
  },
  $parseStringToArray(string) {
    let isArray = true;
    if (string instanceof Array) {
      return string;
    }
    try {
      JSON.parse(string);
    } catch (error) {
      isArray = false;
    }
    let result = isArray ? JSON.parse(string) : [string];
    if (isArray) {
      result = JSON.parse(string);
    } else {
      result = [string];
    }
    if (result === '') {
      result = [];
    }
    return result;
  }
};

utils.install = function (Vue) {
  Object.keys(utils).forEach((item, index) => {
    if (item !== 'install') {
      Vue.prototype[item] = utils[item];
    }
  });
};

export default utils;
