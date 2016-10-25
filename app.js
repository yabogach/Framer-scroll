var Device, Screen, buttons, i, image, j, layers, screenObject, scroll;

Device = new Layer({
  image: "http://resources.framerjs.com/static/DeviceResources/apple-iphone-6s-space-gray.png",
  width: 874,
  height: 1792
});
screenObject = Screen;
Screen = new Layer({
  width: 750,
  height: 1334,
  backgroundColor: "black",
  parent: Device,
  clip: true,
  x: Align.center(),
  y: Align.center()
});
(window.onresize = function() {
  Device.scale = screenObject.height / (Device.height + 50);
  return Device.center();
})();

scroll = new ScrollComponent({
  parent: Screen,
  y: 0,
  width: Screen.width,
  height: Screen.height,
  scrollHorizontal: false
});

buttons = [];

layers = [];

image = [];

for (i = j = 0; j <= 10; i = ++j) {
  buttons[i] = new Layer({
    parent: scroll.content,
    width: 200,
    height: 200,
    backgroundColor: "#C2185B",
    x: Align.right(),
    opacity: 1.00,
    y: i * 205,
    scale: .5
  });
  buttons[i].states.offButton = {
    scale: .5,
    animationOptions: {
      curve: "ease",
      time: 0.3
    }
  };
  buttons[i].states.onButton = {
    scale: 1,
    animationOptions: {
      curve: "ease",
      time: 0.3
    }
  };
  image[i] = new Layer({
    parent: buttons[i],
    image: "images/ic_delete_white_24dp_2x.png",
    width: 88,
    height: 88,
    x: Align.center,
    y: Align.center
  });
  layers[i] = new Layer({
    parent: scroll.content,
    width: Screen.width,
    y: i * 205,
    backgroundColor: Utils.randomColor(),
    image: Utils.randomImage()
  });
  layers[i].states.stateOff = {
    x: 0,
    animationOptions: {
      curve: "ease",
      time: 0.3
    }
  };
  layers[i].states.stateOn = {
    x: -200,
    animationOptions: {
      curve: "ease",
      time: 0.5
    }
  };
  layers[i].states.stateDeleted = {
    x: -750,
    animationOptions: {
      curve: "ease",
      time: 0.5
    }
  };
  layers[i].draggable.enabled = true;
  layers[i].draggable.vertical = false;
  layers[i].draggable.momentum = false;
  layers[i].onDragMove(function() {
    return scroll.scrollVertical = false;
  });
  layers[i].onDragEnd(function() {
    var crnt, k, l, layer, len, len1, len2, m;
    crnt = 0;
    for (i = k = 0, len = layers.length; k < len; i = ++k) {
      layer = layers[i];
      if (this === layer) {
        crnt = i;
      }
      if (this.x < -200) {
        this.animate("stateOn");
        buttons[crnt].animate("onButton");
        for (i = l = 0, len1 = layers.length; l < len1; i = ++l) {
          layer = layers[i];
          if (layer !== this && layer.states.current.name !== "stateDeleted") {
            layer.animate("stateOff");
            buttons[i].animate("offButton");
          }
        }
      } else {
        this.animate("stateOff");
        for (i = m = 0, len2 = layers.length; m < len2; i = ++m) {
          layer = layers[i];
          if (layer === this) {
            buttons[i].animate("offButton");
          }
        }
      }
    }
    return scroll.scrollVertical = true;
  });
  buttons[i].onClick(function() {
    var button, crnt, k, l, len, ref, results;
    crnt = 0;
    for (i = k = 0, len = buttons.length; k < len; i = ++k) {
      button = buttons[i];
      if (this === button) {
        crnt = i;
      }
    }
    layers[crnt].animate("stateDeleted");
    buttons[crnt].animate({
      x: 874
    });
    results = [];
    for (i = l = ref = crnt; ref <= 10 ? l <= 10 : l >= 10; i = ref <= 10 ? ++l : --l) {
      layers[i].animate({
        y: layers[i].y - 205,
        options: {
          delay: .6,
          time: 0.3
        }
      });
      results.push(buttons[i].animate({
        y: layers[i].y - 205,
        options: {
          delay: .6,
          time: 0.3
        }
      }));
    }
    return results;
  });
  layers[i].onAnimationEnd(function() {
    return scroll.updateContent();
  });
}

scroll.onScrollStart(function() {
  var k, layer, len, results;
  results = [];
  for (k = 0, len = layers.length; k < len; k++) {
    layer = layers[k];
    results.push(layer.draggable.horizontal = false);
  }
  return results;
});

scroll.onScrollEnd(function() {
  var k, layer, len, results;
  results = [];
  for (k = 0, len = layers.length; k < len; k++) {
    layer = layers[k];
    results.push(layer.draggable.horizontal = true);
  }
  return results;
});
