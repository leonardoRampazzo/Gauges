(function () {
  var attachEvent = document.attachEvent;
  var isIE = navigator.userAgent.match(/Trident/);
  var requestFrame = (function () {
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
      function (fn) {
        return window.setTimeout(fn, 20);
      };
    return function (fn) {
      return raf(fn);
    };
  })();

  var cancelFrame = (function () {
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
      window.clearTimeout;
    return function (id) {
      return cancel(id);
    };
  })();

  function resizeListener(e) {
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function () {
      var trigger = win.__resizeTrigger__;
      trigger.__resizeListeners__.forEach(function (fn) {
        fn.call(trigger, e);
      });
    });
  }

  function objectLoad(e) {
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }

  window.addResizeListener = function (element, fn) {
    if (!element.__resizeListeners__) {
      element.__resizeListeners__ = [];
      if (attachEvent) {
        element.__resizeTrigger__ = element;
        element.attachEvent('onresize', resizeListener);
      } else {
        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
        var obj = element.__resizeTrigger__ = document.createElement('object');
        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        obj.__resizeElement__ = element;
        obj.onload = objectLoad;
        obj.type = 'text/html';
        if (isIE) element.appendChild(obj);
        obj.data = 'about:blank';
        if (!isIE) element.appendChild(obj);
      }
    }
    element.__resizeListeners__.push(fn);
  };

  window.removeResizeListener = function (element, fn) {
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      if (attachEvent) element.detachEvent('onresize', resizeListener);
      else {
        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      }
    }
  }
})();

class Gauge {
  constructor(div, config) {
    this._defaultConfig = {
      size: "auto",
      colors: ["#FF382D", "#E86A1F", "#FFB82F", "#E8D01F", "#B1FF27", "#0D964D"],
      animation: true,
      animation_time: '3s',
      background_stroke: "#f0f0f0",
      foreground_stroke: "#f0f0f0",
      backgroundstroke_width: 10,
      foregroundstroke_width: 10,
      forestroke_dasharray: "0,2000"
    };

    try {
      var div_parent = document.getElementById(div);
      if (!div_parent)
        throw ("Div " + div + " nÃ£o encontrada");
      this._div = div_parent;
      this._size = config.size ? (config.size) : (this._defaultConfig.size);
      this._colors = config.colors ? (config.colors) : (this._defaultConfig.colors);
      this._animation = config.animation ? (config.animation) : (this._defaultConfig.animation);
      this._animation_time = config.animation_time ? (config.animation_time) : (this._defaultConfig.animation_time);

      this.background_stroke = config.background_stroke ? (config.background_stroke) : (this._defaultConfig.background_stroke);
      this.foreground_stroke = config.foreground_stroke ? (config.foreground_stroke) : (this._defaultConfig.foreground_stroke);
      this.backgroundstroke_width = config.backgroundstroke_width ? (config.backgroundstroke_width) : (this._defaultConfig.backgroundstroke_width);
      this.foregroundstroke_width = config.foregroundstroke_width ? (config.foregroundstroke_width) : (this._defaultConfig.foregroundstroke_width);
      this.forestroke_dasharray = config.forestroke_dasharray ? (config.forestroke_dasharray) : (this._defaultConfig.forestroke_dasharray);

    } catch (err) {
      console.log(err);
    }
  }

  render() { 
    if (this._size == 'auto') {
      var cx = this._div.offsetWidth / 2;
      var cy = this._div.offsetHeight / 2;
      var r =  Math.sqrt(Math.pow(this._div.offsetWidth, 2) + Math.pow(this._div.offsetHeight, 2)) / 3.3;
    } else {
      try {
        var cx = this._size.cx;
        var cy = this._size.cy;
        var r = this._size.r;
        if (cx == undefined || cy == undefined || r == undefined) {
          throw "Erro na definiÃ§Ã£o das dimensÃµes";
          cx = cy = r = 0;
        }
      } catch (err) {
        console.log(err);
      }
    }
    
    
    this._set_perc = 0;
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    this._circle_background = document.createElementNS('http://www.w3.org/2000/svg', "circle");
    this._circle_foreground = document.createElementNS('http://www.w3.org/2000/svg', "circle");
    this._circle_text = document.createElementNS('http://www.w3.org/2000/svg', "text");

    this._circle_background.setAttributeNS(null, "stroke", "#f0f0f0");
    this._circle_background.setAttributeNS(null, "stroke-width", "5");
    this._circle_background.setAttributeNS(null, "cx", cx);
    this._circle_background.setAttributeNS(null, "cy", cy);
    this._circle_background.setAttributeNS(null, "r", r);
    this._circle_background.setAttributeNS(null, "fill", "none");
    this._circle_foreground.setAttributeNS(null, "stroke", "#f0f0f0");
    this._circle_foreground.setAttributeNS(null, "stroke-width", "5");
    this._circle_foreground.setAttributeNS(null, "cx", cx);
    this._circle_foreground.setAttributeNS(null, "cy", cy);
    this._circle_foreground.setAttributeNS(null, "r", r);
    this._circle_foreground.setAttributeNS(null, "fill", "none");
    this._circle_foreground.setAttributeNS(null, "stroke-dasharray", "0,2000");
    this._circle_foreground.setAttributeNS(null, "transform", "rotate(-90," + cx + "," + cy + ")");

    this._svg.appendChild(this._circle_background);
    this._svg.appendChild(this._circle_foreground);
    this._svg.appendChild(this._circle_text);
    this._div.appendChild(this._svg);

    
    var self = this;
    if (this._size == "auto") {
      addResizeListener(this._div, function () {
        self.resize();
      });
    };
  }

  resize() {
    var cx = this._div.offsetWidth / 2;
    var cy = this._div.offsetHeight / 2;
    var r = Math.sqrt(Math.pow(this._div.offsetWidth, 2) + Math.pow(this._div.offsetHeight, 2)) / 3.3;
    if((r >= this._div.offsetWidth / 2)||(r >= this._div.offsetHeight / 2)){
      return;
    }
    this._circle_background.setAttributeNS(null, "cx", cx);
    this._circle_background.setAttributeNS(null, "cy", cy);
    this._circle_background.setAttributeNS(null, "r", r);
    this._circle_foreground.setAttributeNS(null, "cx", cx);
    this._circle_foreground.setAttributeNS(null, "cy", cy);
    this._circle_foreground.setAttributeNS(null, "r", r);
    this._circle_foreground.setAttributeNS(null, "transform", "rotate(-90," + cx + "," + cy + ")");
    this.complete(this._set_perc);
  }

  clear() {
    var circle = this._circle_foreground;
    circle.removeAttribute("stroke-dasharray");
    circle.style.transition = "none";
    circle.setAttribute("stroke-dasharray", "0, 20000");
    this.set_perc = 0;
  }

  complete(percent) {
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    var circle = this._circle_foreground;
    var raio = parseFloat(circle.getAttributeNS(null, 'r'));
    var svg = this._svg;
    var angle = 1;
    var max = 2 * Math.PI * raio;
    var cores = this._colors;
    var ind = [];
    for (var c in cores) {
      ind.push((max / cores.length) * c);
    }
    if (!circle)
      return;
    if (percent < 0)
      return;
    this._set_perc = percent;

    var h = svg.style.height; //Corrigir glith que soh ocorre no Firefox
    svg.style.height = h; //Corrigir glith que soh ocorre no Firefox

    angle = max * (percent / 100);
    circle.angle = 0;
    if (this._animation) {
      circle.style.transition = "stroke-dasharray " + this._animation_time + ", stroke " + this._animation_time;
    } else {
      circle.style.transition = "none";
    }
    if (isIE) {
      /*Workaround to animate on ie*/
      var requestAnimationFrameID = requestAnimationFrame(doAnim);

      function doAnim() {
        if (circle.angle > (angle)) {
          circle.setAttribute("stroke-dasharray", angle + ",20000");
          cancelAnimationFrame(requestAnimationFrameID);
          return;
        }
        circle.setAttribute("stroke-dasharray", circle.angle + ",20000");
        for (var i in ind) {
          if (ind[i] >= angle)
            break;
          circle.removeAttribute("stroke");
          circle.setAttribute("stroke", cores[i]);
        }
        circle.angle += 5;
        requestAnimationFrameID = requestAnimationFrame(doAnim);
      }
    } else {
      /*every other browser including EDGE */
      circle.removeAttribute("stroke-dasharray");
      circle.setAttribute("stroke-dasharray", angle + ", 20000");
      for (var i in ind) {
        if (ind[i] >= angle)
          break;
        circle.removeAttribute("stroke");
        circle.setAttribute("stroke", cores[i]);
      }
    }
  }
}

function change(input,id){
  var input_number = document.getElementById(id);
  input_number.value = input.value;
}

var text = document.getElementById("text")
var g = new Gauge("receiver",{
      //size: {cx:100,cy:100,r:50},
      size: "auto",
      colors: ["#FF382D", "#E86A1F", "#FFB82F", "#E8D01F", "#B1FF27", "#0D964D"],
      animation: true,
      animation_time: '3s',
      background_stroke: "#f0f0f0",
      foreground_stroke: "#f0f0f0",
      backgroundstroke_width: 10,
      foregroundstroke_width: 10,
      forestroke_dasharray: "0,2000"
})

text.innerHTML = "var defaul_config = " + JSON.stringify(g._defaultConfig,null,1);

g.render();



