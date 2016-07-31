(function factory(global) {
  var window = global;
  var location = window.location;
  var document = global.document;
  var hasValidHash = false;
  var isTouchDevice = typeof window.ontouchstart !== 'undefined';

  function updateColor(clientX, clientY) {
    var r = Math.min(Math.round(clientX / window.innerWidth * 255), 255);
    var g = Math.min(Math.round(clientY / window.innerHeight * 255), 255);
    var b = Math.round((r + g) / 2);
    document.body.style.color = 'rgb(' + [r, g, b].join(',') + ')';
    document.body.style.backgroundColor = 'rgb(' + [255 - r, 255 - g, 255 - b].join(',') + ')';
  }

  function onClick(e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
      var clientX = e.clientX;
      var clientY = e.clientY;
      location.hash = hasValidHash ? '' : [clientX, clientY].join(',');
      updateColor(clientX, clientY);
    }
  }

  function onHashChange(e) {
    var hash = location.hash.replace(/^#/, '');

    hasValidHash = /[0-9]+,[0-9]/.test(hash);

    if (hasValidHash) {
      var hashParts = hash.split(',');
      var clientX = parseInt(hashParts[0], 10);
      var clientY = parseInt(hashParts[1], 10);
      updateColor(clientX, clientY);
    }
  }

  function onMouseOver(e) {
    if (!hasValidHash) {
      updateColor(e.clientX, e.clientY);
    }
  }

  function onTouchEnd(e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
      var clientX = e.changedTouches[0].clientX;
      var clientY = e.changedTouches[0].clientY;
      location.hash = [clientX, clientY].join(',');
      updateColor(clientX, clientY);
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
