function loadImpactUTT() {
  (function (a, b, c, d, e, f, g) {
    e['ire_o'] = c;
    e[c] =
      e[c] ||
      function () {
        (e[c].a = e[c].a || []).push(arguments);
      };
    f = d.createElement(b);
    g = d.getElementsByTagName(b)[0];
    f.async = 1;
    f.src = a;
    g.parentNode.insertBefore(f, g);
  })(
    'https://utt.impactcdn.com/A4885649-8e5c-478e-8262-622b0ac59c801.js',
    'script',
    'ire',
    document,
    window
  );
}

export default loadImpactUTT;
