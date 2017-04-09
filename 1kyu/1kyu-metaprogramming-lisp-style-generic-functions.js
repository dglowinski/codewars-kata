////////////////////////////////////////////////////////////////////////////
// Metaprogramming: Lisp-style Generic Functions                          //
//     - 1 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/526de57c8f428fc1fd000b8c//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////


function callNextMethod(methodInfo) {
  var args = Array.prototype.slice.call(arguments, 1);
  globalGeneric.checkNextAround();
  var primary = globalGeneric.getNextMethod();
  return primary.apply(this, args);
}

//1)  a instanceof Object and a.constructor.name === t
function rule1(a, t) {
  return (a instanceof Object) && a.constructor.name.toLowerCase() === t ? true : false;
}

//2)  a instanceof Object and a.__proto__ satisfies rule #1 or rule #2
function rule2(a, t, level) {
  var proto = a.__proto__;
  if (proto === null)
    return 0;

  if (rule1(proto, t)) {
    return level;
  } else {
    return rule2(proto, t, ++level);
  }
}

function compareMatches(m1, m2) {
  for (var i = 0; i < m1.length; i++) {
    if (m1[i].rule < m2[i].rule)
      return -1;
    if (m1[i].rule > m2[i].rule)
      return 1;
    if (m1[i].rule === m2[i].rule) {
      if (m1[i].level < m2[i].level)
        return -1;
      if (m1[i].level > m2[i].level)
        return 1;
    }
  }
  return 1;
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function defgeneric(name) {
  var name = name
    , methods = []
    , cmbIndex = { primary: 0, around: 0 }
    , matches = []
    , findCalls = []
    , currentCombination = ""
    , wrap = {};

  var generic = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var method = generic.findMethod.apply(this, args);
    globalGeneric = generic;
    return method.apply(this, args);
  };


  generic.makeFunction = function (wrap, methods, ind, args) {
    var wrapLocal = clone(wrap);
    var methodsLocal = clone(methods);
    var cmbIndexLocal = ind;
    return function () {

      if (cmbIndexLocal >= wrapLocal.primary.length)
        throw "No next method found for " + name + " in primary";

      var ret = methodsLocal[wrapLocal.primary[cmbIndexLocal++][0].ind].fn.apply(this, args);
      return ret;
    }
  }

  generic.makeFunctionWrap = function (wrap, methods, ind, args) {
    var wrapLocal = clone(wrap);
    var methodsLocal = clone(methods);
    var cmbIndexLocal = ind;
    return function () {
      for (var b in wrapLocal.before) {
        methodsLocal[wrapLocal.before[b][0].ind].fn.apply(this, args);
      }
      var ret = methodsLocal[wrapLocal.primary[0][0].ind].fn.apply(this, args);

      for (var a in wrapLocal.after) {
        methodsLocal[wrapLocal.after[a][0].ind].fn.apply(this, args);
      }
      return ret;
    }
  }

  generic.wrapMethods = function () {
    var ret;
    wrap = {};
    wrap.around = matches.filter(m => methods[m[0].ind].cmb === "around").sort(compareMatches);
    wrap.primary = matches.filter(m => methods[m[0].ind].cmb === "primary").sort(compareMatches);
    wrap.before = matches.filter(m => methods[m[0].ind].cmb === "before").sort(compareMatches);
    wrap.after = matches.filter(m => methods[m[0].ind].cmb === "after").sort(compareMatches).reverse();
  }
  generic.checkNextAround = function () {
    if (currentCombination === 'around' && cmbIndex['around'] === wrap.around.length && cmbIndex['primary'] === wrap.primary.length)
      throw "No next method found for " + name + " in around";
  }
  generic.getNextMethod = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    if (wrap.around.length > 0 && cmbIndex['around'] < wrap.around.length) {
      currentCombination = 'around';
      return methods[wrap.around[cmbIndex['around']++][0].ind].fn;
    } else {
      var r;
      currentCombination = 'primary';
      if (cmbIndex['primary'] == 0) {
        r = generic.makeFunctionWrap(wrap, methods, cmbIndex['primary']++, args);
      } else {
        r = generic.makeFunction(wrap, methods, cmbIndex['primary']++, args);
      }
      return r;
    }
  }

  generic.defmethod = function (discriminator, fn, combination) {
    combination = combination || 'primary';
    var disc, m;
    disc = discriminator.toLowerCase().split(',');
    m = { dsc: disc, fn: fn, cmb: combination };
    methods.push(m);
    return generic;
  };

  generic.removeMethod = function (discriminator, combination) {
    combination = combination || 'primary';
    var ind = methods.findIndex(m => discriminator.toLowerCase() === m.dsc.join(',') && combination === m.cmb ? true : false);
    if (ind > -1)  methods[ind].removed = 1;
    findCalls = [];
    return generic;
  };

  generic.findMethod = function () {
  
    var args = Array.prototype.slice.call(arguments, 0);
    var memoize;
    cmbIndex['primary'] = 0;
    cmbIndex['around'] = 0;
    currentCombination = '';

    matches = [];
    methods.map(function (method, ind) {
      //match argument
      var rule, level, a, t, match = [], matchMethods;
      if (method.removed) return;
      for (var i = 0; i < args.length; i++) {
        rule = 0;
        level = 0;
        a = args[i];
        t = method.dsc[i];

        //  1)  a instanceof Object and a.constructor.name === t
        if (rule1(a, t)) {
          rule = 1;
        } else if (level = rule2(a, t, 1)) {
          rule = 2;
        } else if (a === null && t === 'null') {
          rule = 3;
        } else if ((typeof a).toLowerCase() === t) {
          rule = 4;
        } else if (t === "*") {
          rule = 5;
        }

        match[i] = { rule: rule, level: level, ind: ind };
      }
      matches.push(match);
    });
    matches = matches.filter(m => m.every(x => x.rule > 0));
    if (matches.length === 0)
      throw "No method found for " + name + " with args: " + args.map(a => (typeof a)).join(',');

    generic.wrapMethods();

    for (var fc in findCalls) {
      memoize = true;
      for (var a in findCalls[fc].args) {
        if (!(args[a] instanceof Object) && args[a] != findCalls[fc].args[a])
          memoize = false;
        if ((args[a] instanceof Object) && !(findCalls[fc].args[a] instanceof Object))
          memoize = false;
        if ((args[a] instanceof Object) && (findCalls[fc].args[a] instanceof Object) && args[a].constructor.name != findCalls[fc].args[a].constructor.name)
          memoize = false;
      }
      if (memoize) {
        console.log('found');
        if (wrap.around.length == 0) {
          cmbIndex['primary']++;
          cmbIndex['around'] = 0;
          return findCalls[fc].fn;
        }
      }
    }

    var ret = generic.getNextMethod.apply(this, args);
    findCalls.push({ args: args, fn: ret });
    return ret;
  };
  generic.getName = function () { return name; };
  return generic;
};
var globalGeneric;