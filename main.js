(function factory(global) {
  var window = global;
  var location = window.location;
  var document = global.document;
  var preventMouseover = false;
  var isTouchDevice = typeof window.ontouchstart !== 'undefined';

  function calculateRGB(clientX, clientY) {
    var r = Math.min(Math.round(clientX / window.innerWidth * 255), 255);
    var g = Math.min(Math.round(clientY / window.innerHeight * 255), 255);
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

  function onClick(e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
      location.hash = preventMouseover ? '' : calculateRGB(e.clientX, e.clientY).join(',');
    }
  }

  function onHashChange(e) {
    var hash = location.hash.replace(/^#/, '');

    if (!hash) {
      preventMouseover = false;
      updateColor([0, 0, 0]);
      return;
    }

    var hashParts = hash.replace(/^#/, '').split(',');

    if (hashParts.length === 3) {
      var rgb = hashParts.map(function (str) {
        return parseInt(str, 10);
      });

      var isValidRGB = true;

      rgb.forEach(function (val) {
        if (val < 0 || val > 255) {
          isValidRGB = false;
        }
      });

      if (isValidRGB) {
        preventMouseover = true;
        updateColor(rgb);
        return;
      }
    }

    preventMouseover = false;
    location.hash = '';
  }

  function onMouseOver(e) {
    if (!preventMouseover) {
      updateColor(calculateRGB(e.clientX, e.clientY));
    }
  }

  function onTouchEnd(e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
      location.hash = calculateRGB(e.changedTouches[0].clientX, e.changedTouches[0].clientY).join(',');
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
