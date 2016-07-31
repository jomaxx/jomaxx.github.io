(function factory(global) {
  var window = global;
  var location = window.location;
  var document = global.document;
  var hasValidHash = false;
  var isTouchDevice = typeof window.ontouchstart !== 'undefined';

  function updateColor(clientX, clientY) {
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var r = Math.min(Math.round(clientX / windowWidth * 255), 255);
    var g = Math.min(Math.round(clientY / windowHeight * 255), 255);
    var b = Math.round((r + g) / 2);
    document.body.style.color = 'rgb(' + [r, g, b].join(',') + ')';
    document.body.style.backgroundColor = 'rgb(' + [255 - r, 255 - g, 255 - b].join(',') + ')';
  }

  function onClick(e) {
    if (event.target.tagName.toLowerCase() !== 'a') {
      location.hash = hasValidHash && !isTouchDevice ? '' : [e.clientX, e.clientY].join(',');
      updateColor(e.clientX, e.clientY);
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

  window.addEventListener('click', onClick);
  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('mousemove', onMouseOver);
  onHashChange();
}(window));
