function loadPixel(){
    (function (w, d) {
        var id = 'podscribe-capture',
        n = 'script';
        var e = d.createElement(n);
        e.id = id;
        e.async = true;
        e.src = 'https://d34r8q7sht0t9k.cloudfront.net/tag.js';
        var s = d.getElementsByTagName(n)[0];
        s.parentNode.insertBefore(e, s);
        e.addEventListener('load', function() {
          w.podscribe('init', { user_id: '5c244146-22a5-49e0-95f7-4d6845bb0124', advertiser: 'aurahealth' });
          w.podscribe('view');
        })
      })(window, document);
}

export default loadPixel;