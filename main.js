(function factory(global) {
  var window = global;
  var location = window.location;
  var document = global.document;
  var preventMouseover = false;
  var isTouchDevice = typeof window.ontouchstart !== 'undefined';
  var skipUpdate = false;

  function calculateRGB(clientX, clientY) {
    var r = Math.max(0, Math.min(Math.round(clientX / window.innerWidth * 255), 255));
    var g = Math.max(0, Math.min(Math.round(clientY / window.innerHeight * 255), 255));
    var b = Math.round((r + g) / 2);
    return [r, g, b];
  }

  function updateColor(rgb) {
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    document.body.style.color = 'rgb(' + [r, g, b].join(',') + ')';
    document.body.style.backgroundColor = 'rgb(' + [255 - r, 255 - g, 255 - b].join(',') + ')';
  }

  function onHashChange() {
    var rgb = location.hash.replace(/^#/, '').split(',').map(function (str) {
      return parseInt(str, 10);
    });

    var isValid = rgb && rgb.length === 3;

    if (isValid) {
      rgb.forEach(function (val) {
        if (val < 0 || val > 255) {
          isValid = false;
        }
      });
    }

    if (isValid) {
      preventMouseover = true;
      updateColor(rgb);
    } else {
      preventMouseover = false;

      if (skipUpdate) {
        skipUpdate = false
      } else {
        updateColor([0, 0, 0]);
      }
    }
  }

  function onClick(e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
      var rgb = calculateRGB(e.clientX, e.clientY);

      if (preventMouseover) {
        skipUpdate = true;
        location.hash = '';
        updateColor(rgb);
      } else {
        location.hash = rgb.join(',');
      }
    }
  }

  function onMouseOver(e) {
    if (!preventMouseover) {
      updateColor(calculateRGB(e.clientX, e.clientY));
    }
  }

  function onTouchEnd(e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
      var rgb = calculateRGB(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      location.hash = rgb.join(',');
    }
  }

  if (isTouchDevice) {
    window.addEventListener('touchend', onTouchEnd);
  } else {
    window.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMouseOver);
  }

  window.addEventListener('hashchange', onHashChange);
  onHashChange();
}(window));
