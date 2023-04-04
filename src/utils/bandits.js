/*
 * Interactive Javascript applets to explore bandit algorithms
 *
 * This code defines two applets to explore the multi-armed bandit problem,
 * and Thompson Sampling in particular. They are written for this blog post:
 *
 *   https://gertjanvandenburg.com/blog/thompson_sampling/
 *
 * The code for the EvaluationApplet depends on the LineGraph.js code
 * available here:
 *
 *   https://github.com/GjjvdBurg/LineGraph.js
 *
 * This code is released for demonstration purposes only, in case you'd like
 * to learn how to make Javascript applets such as these for yourself.
 *
 * Copyright 2020, G.J.J. van den Burg
 *
 */

/* Above copyright notice holds unless otherwise noted */
import * as noUiSlider from "nouislider";
// import 'nouislider/distribute/nouislider.css';
import { LineGraph } from "./lineGraph.js";

import * as d3 from "d3";

var DOMAIN = 3;

export class EvaluationApplet {
  constructor(selector, inputParams, setRegretPlotData) {
    this.selector = selector;
    // this.inputIds = inputIds;
    this.inputParams = inputParams;
    this.nBandits = 10;
    this.graph = null;

    this.appletRunning = false;
    this.setRegretPlotData = setRegretPlotData;
  }

  // static t = 0;
  static regret = {};

  init(outerWidth, outerHeight) {
    this.outerWidth = outerWidth;
    this.outerHeight = outerHeight;

    var self = this;
    // register the buttons
    document
      .getElementById("eval-btn-toggle")
      .addEventListener("click", function () {
        console.log("toggle");
        self.toggle();
      });
    document
      .getElementById("eval-btn-reset")
      .addEventListener("click", function () {
        console.log("reset");
        self.reset();
      });

    this.reset();
  }

  init_graph() {
    this.graph = new LineGraph(this.selector, null);

    var rawData = {
      meta: {
        xlabel: "Time",
        ylabel: "Regret",
        title: "",
      },
      data: {
        X: [],
        series: [],
      },
    };
    for (const name of this.banditNames) {
      rawData["data"]["series"].push({ name: name, values: [] });
    }
    this.graph.rawData = rawData;
    this.graph.dataReady = true;
    this.graph.realPreProcess();
    this.graph.build(this.outerWidth, this.outerHeight);
  }

  get_param() {
    var self = this;
    this.param = { ...self.inputParams };

    var intFromId = function (x) {
      return parseInt(document.getElementById(self.inputIds[x]).value);
    };
    var floatsFromId = function (x) {
      return document
        .getElementById(self.inputIds[x])
        .value.split(",")
        .map(parseFloat);
    };
    var onlyUnique = function (value, index, self) {
      return self.indexOf(value) === index;
    };
    var onlyPos = function (value, index, self) {
      return value > 0;
    };

    // extract the parameters from the input fields
    // this.param.repeats = intFromId("repeats");
    // this.param.epsilons = floatsFromId("epsilon").filter(onlyUnique);
    // this.param.cs = floatsFromId("c").filter(onlyUnique).filter(onlyPos);
    // this.param.ms = floatsFromId("m").filter(onlyUnique);
    // this.param.nus = floatsFromId("nu").filter(onlyUnique).filter(onlyPos);
    // this.param.alphas = floatsFromId("alpha")
    //   .filter(onlyUnique)
    //   .filter(onlyPos);
    // this.param.betas = floatsFromId("beta").filter(onlyUnique).filter(onlyPos);

    // this.param.repeats = 10;

    // construct all bandit configurations (cross product)
    this.param.banditConfig = [];
    for (const eps of this.param.epsilons)
      this.param.banditConfig.push(["EpsilonGreedy", [this.nBandits, eps]]);

    for (const c of this.param.cs)
      this.param.banditConfig.push([
        "UpperConfidenceBound",
        [this.nBandits, c],
      ]);

    for (const m of this.param.ms)
      for (const nu of this.param.nus)
        for (const alpha of this.param.alphas)
          for (const beta of this.param.betas)
            this.param.banditConfig.push([
              "ThompsonSampling",
              [this.nBandits, m, nu, alpha, beta],
            ]);

    this.banditClasses = {
      EpsilonGreedy,
      UpperConfidenceBound,
      ThompsonSampling,
    };
    this.banditNames = [];
    this.banditConfig = {};

    // map each bandit config to a unique name, using their
    // label() method.
    var tmp, name;
    for (var config of this.param.banditConfig) {
      tmp = new this.banditClasses[config[0]](...config[1]);
      name = tmp.label();
      this.banditNames.push(name);
      this.banditConfig[name] = config;
    }

    // console.log('banditNames', this.banditNames, 'config: ', this.banditConfig);
  }

  toggle() {
    if (this.appletRunning) {
      this.appletRunning = false;
      // document.getElementById('eval-btn-toggle').className = 'btn-play';
    } else {
      this.appletRunning = true;
      // document.getElementById('eval-btn-toggle').className = 'btn-pause';
      this.get_param();
      console.log(this.banditConfig);
      this.animate();
    }
  }

  // d: path("M 8.674 284.372 L 56.863 255.975 L 105.052 228.341 L 153.241 199.503 L 201.43 174.98 L 249.62 152.62 L 297.809 131.09 L 345.998 110.285 L 394.187 90.526 L 442.376 71.172");

  reset() {
    var self = this;
    // window.localStorage.setItem('regret', JSON.stringify(EvaluationApplet.regret));
    // window.localStorage.setItem('t', EvaluationApplet.t);

    var real_reset = function () {
      self.t = 0;
      self.get_param();

      // initialize the regret value for each bandit (last
      // iter), as well as the environment and bandit
      // instance (replicated over the number of iterations)
      self.regret = {};
      // self.regret = {};
      self.envs = {};
      self.bandits = {};
      for (const name of self.banditNames) {
        self.regret[name] = 0.0;
        self.envs[name] = new Array(self.param.repeats);
        self.bandits[name] = new Array(self.param.repeats);
      }

      var seed, config;
      var alea = new Alea();

      for (let r = 0; r < self.param.repeats; r++) {
        // ensure the different bandits operate on the
        // same environment for the same repetition
        // index.
        seed = alea.randint();
        for (const name of self.banditNames) {
          self.envs[name][r] = new TestBed(self.nBandits, seed);
          config = self.banditConfig[name];
          self.bandits[name][r] = new self.banditClasses[config[0]](
            ...config[1]
          );
        }
      }

      self.init_graph();
    };

    // A delay is used because otherwise there's a chance that the
    // last animation frame updates our graph
    if (this.appletRunning) {
      this.appletRunning = false;
      document.getElementById("eval-btn-toggle").className = "btn-play";
      window.setTimeout(real_reset, 100);
    } else {
      real_reset();
    }
  }

  step() {
    // EvaluationApplet.t += 1;
    this.t += 1;

    var action,
      reward,
      t_regret = {};

    // regret for this iteration
    for (const name of this.banditNames) t_regret[name] = 0.0;

    // perform a single step of all the environments/bandits
    for (let r = 0; r < this.param.repeats; r++) {
      for (const name of this.banditNames) {
        action = this.bandits[name][r].act();
        reward = this.envs[name][r].step(action);
        this.bandits[name][r].record(action, reward);
        t_regret[name] +=
          this.envs[name][r].optimal - this.envs[name][r].means[action];
      }
    }
    // record the average regret over all repetitions
    // for (name of this.banditNames)
    // 	this.regret[name] += t_regret[name] / this.param.repeats;
    for (const name of this.banditNames) {
      EvaluationApplet.regret[name] += t_regret[name] / this.param.repeats;
      this.regret[name] += t_regret[name] / this.param.repeats;
    }
  }

  async draw() {
    // console.log('rback:  ', this.regret, EvaluationApplet.regret);
    // this.setTime(EvaluationApplet.t);
    // this.setRegret(EvaluationApplet.regret);
    await this.setRegretPlotData({
      current_time: this.t,
      current_regret: JSON.parse(JSON.stringify(this.regret)),
    });

    // window.localStorage.setItem('regret', JSON.stringify(EvaluationApplet.regret));
    // window.localStorage.setItem('t', EvaluationApplet.t);
    // window.dispatchEvent(new Event('storage'));

    this.graph.appendObservation(this.t, this.regret);
    this.graph.updateXYMinMax();

    // rebuild the graph. This may not be the most efficient, but
    // seems to work quite well in practice
    if (this.t % 2 == 0) this.graph.build(this.outerWidth, this.outerHeight);
  }

  animate() {
    var frame,
      paint,
      parent = this;

    paint = function () {
      parent.step();
      parent.draw();

      frame = window.requestAnimationFrame(paint);
      if (!parent.appletRunning) {
        window.cancelAnimationFrame(frame);
      }
    };

    frame = requestAnimationFrame(paint);
  }
}

export class SVGImage {
  constructor(width, height, margin) {
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.scale = d3
      .scaleLinear()
      .domain([-DOMAIN, DOMAIN])
      .range([this.margin.left, this.width - this.margin.right]);
    this.svg = null;
  }

  init(element) {
    var color = this.getColor();
    this.svg = d3
      .select(element)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .call(rampHorizontal(this.scale, color));
  }

  getColor(mu, sigma2) {
    if (mu === undefined) mu = 0;
    if (sigma2 === undefined) sigma2 = 1;

    return d3
      .scaleSequentialQuantile(d3.interpolateRdBu)
      .domain(
        Float32Array.from(
          { length: 10000 },
          d3.randomNormal(mu, Math.sqrt(sigma2))
        )
      );
  }

  update(mu, sigma2, latest_reward) {
    var color = this.getColor(mu, sigma2);
    this.svg.call(rampHorizontal(this.scale, color));
  }
}

export class CanvasImage {
  /* This was an alternative visualization for the normal distribution
   * in the bandits application, where we would add a pixel for each
   * draw of the posterior. It didn't quite work as nicely.
   */
  constructor(width, height, margin) {
    this.width = width;
    this.height = height;
    this.margin = margin;

    this.canvas = null;
    this.ctx = null;
    this.data = null;
    this.rng = new RNG();
  }

  init(parent) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.data = this.ctx.getImageData(0, 0, this.width, this.height);
    parent.appendChild(this.canvas);
  }

  drawPixel(x, y, r, g, b, a) {
    var idx = (x + y * this.width) * 4;
    this.data.data[idx + 0] = r;
    this.data.data[idx + 1] = g;
    this.data.data[idx + 2] = b;
    this.data.data[idx + 3] += a;
  }

  update(mu, sigma, latest_reward) {
    if (latest_reward === undefined || Math.abs(latest_reward) > DOMAIN) return; // drop out of bounds
    var x = Math.floor(((latest_reward + DOMAIN) / (2 * DOMAIN)) * this.width);
    for (let y = 0; y < this.height; y++) this.drawPixel(x, y, 255, 0, 0, 17);
    this.ctx.putImageData(this.data, 0, 0);
  }
}

export class TestBed {
  constructor(nBandits, seed, do_clamp) {
    this.nBandits = nBandits;
    this.rng = new RNG(seed);
    this.means = null;
    this.optimal = null;
    this.do_clamp = do_clamp === undefined ? false : do_clamp;

    this.stdevs = null;
    this.reset();
  }

  reset() {
    this.means = Array.from({ length: this.nBandits }, (v, i) =>
      this.rng.gauss(0, 1)
    );
    this.stdevs = Array.from({ length: this.nBandits }, (v, i) =>
      this.rng.unif(0.5, 4.0)
    );
    while (
      this.do_clamp &&
      Math.max.apply(null, this.means.map(Math.abs)) > DOMAIN
    ) {
      this.means = Array.from({ length: this.nBandits }, (v, i) =>
        this.rng.gauss(0, 1)
      );
    }
    this.optimal = Math.max(...this.means);
  }

  step(action) {
    return this.rng.gauss(this.means[action], this.stdevs[action]);
    //return this.rng.gauss(this.means[action], 1.0);
  }
}

export class EpsilonGreedy {
  constructor(nBandits, epsilon) {
    this.nBandits = nBandits;
    this.epsilon = epsilon;
    this.reset();
    this.rng = new RNG();
  }

  reset() {
    this.t = 0;
    this.Q = new Array(this.nBandits).fill(0.0);
    this.N = new Array(this.nBandits).fill(0);
  }

  act() {
    if (this.rng.random() <= this.epsilon) {
      return this.rng.randint(0, this.nBandits - 1);
    }
    var qprime = -Infinity;
    var aprime = null;
    for (let a = 0; a < this.nBandits; a++) {
      if (this.Q[a] > qprime) {
        aprime = a;
        qprime = this.Q[a];
      }
    }
    return aprime;
  }

  record(action, reward) {
    var A = action;
    var R = reward;
    this.N[A] += 1;
    this.Q[A] += (1.0 / this.N[A]) * (R - this.Q[A]);
  }

  get_Q(idx){
    return this.Q[idx];
  }

  label() {
    return `ε-Greedy (ε = ${this.epsilon})`;
  }
}

export class UpperConfidenceBound {
  constructor(nBandits, c) {
    this.nBandits = nBandits;
    this.c = c;
    this.reset();
  }

  reset() {
    this.t = 0;
    this.Q = new Array(this.nBandits).fill(0.0);
    this.N = new Array(this.nBandits).fill(0);
  }

  act() {
    this.t += 1;
    var V_a;
    var aprime = null;
    var Vprime = -Infinity;
    for (let a = 0; a < this.nBandits; a++) {
      if (this.N[a] == 0)
        // pull each handle at least once
        return a;

      // compute this action's value
      V_a = this.Q[a] + this.c * Math.sqrt(Math.log(this.t) / this.N[a]);

      // find the best action
      if (V_a > Vprime) {
        Vprime = V_a;
        aprime = a;
      }
    }
    return aprime;
  }

  get_Q(idx){
    return this.Q[idx];
  }

  record(action, reward) {
    var A = action;
    var R = reward;
    this.N[A] += 1;
    this.Q[A] += (1.0 / this.N[A]) * (R - this.Q[A]);
  }

  label() {
    return `UCB (c = ${this.c})`;
  }
}

export class ThompsonSampling {
  constructor(nBandits, prior_m, prior_v, prior_alpha, prior_beta) {
    this.nBandits = nBandits;
    this.m_a = prior_m;
    this.v_a = prior_v;
    this.alpha_a = prior_alpha;
    this.beta_a = prior_beta;
    this.rng = new RNG();
    this.reset();
  }

  reset() {
    this.N = new Array(this.nBandits).fill(0);
    this.mean = new Array(this.nBandits).fill(0.0);
    this.rho = new Array(this.nBandits).fill(this.m_a);
    this.ssd = new Array(this.nBandits).fill(0.0);
    this.beta_t_a = new Array(this.nBandits).fill(this.beta_a);

    // initialize prior variance at the mode of the IG divided by
    // the pseudocount (reflects prior parameters)
    this.latest_zeta = new Array(this.nBandits).fill(
      this.beta_a / (this.alpha_a + 1) / this.v_a
    );
  }

  _draw_ig(alpha, beta) {
    return 1.0 / this.rng.gamma(alpha, 1.0 / beta);
  }

  _draw_normal(mu, sigma2) {
    return this.rng.gauss(mu, Math.sqrt(sigma2));
  }

  act() {
    var sigma2_a, mu_a;
    var aprime = null;
    var muprime = -Infinity;
    for (let a = 0; a < this.nBandits; a++) {
      sigma2_a = this._draw_ig(
        0.5 * this.N[a] + this.alpha_a,
        this.beta_t_a[a]
      );
      this.latest_zeta[a] = sigma2_a / (this.N[a] + this.v_a);

      mu_a = this._draw_normal(this.rho[a], this.latest_zeta[a]);

      if (mu_a > muprime) {
        aprime = a;
        muprime = mu_a;
      }
    }
    return aprime;
  }

  record(action, reward) {
    var A = action;
    var R = reward;
    var prevN = this.N[A];
    var prevMean = this.mean[A];
    console.log(A + " " + this.N[A]);
    this.N[A] += 1;
    this.mean[A] += (1 / this.N[A]) * (R - this.mean[A]);
    this.rho[A] =
      (this.v_a * this.m_a + this.N[A] * this.mean[A]) / (this.v_a + this.N[A]);
    this.ssd[A] +=
      R * R +
      prevN * prevMean * prevMean -
      this.N[A] * this.mean[A] * this.mean[A];
    this.beta_t_a[A] =
      this.beta_a +
      0.5 * this.ssd[A] +
      (this.N[A] *
        this.v_a *
        (this.mean[A] - this.m_a) *
        (this.mean[A] - this.m_a)) /
        (2 * (this.N[A] + this.v_a));
  }

  /* external */

  get_rho(idx) {
    return this.rho[idx];
  }

  get_sigma2_map(idx) {
    return (
      this.beta_t_a[idx] /
      (0.5 * this.N[idx] + this.alpha_a + 1) /
      (this.N[idx] + this.v_a)
    );
  }

  label() {
    return `ThompsonSampling (m = ${this.m_a}, ν = ${this.v_a}, α = ${this.alpha_a}, β = ${this.beta_a})`;
  }
}

export class RNG {
  constructor(seed) {
    // these are for the gamma distribution
    this.LOG4 = Math.log(4.0);
    this.SG_MAGICCONST = 1.0 + Math.log(4.5);

    // these are for the normal distribution
    this.TAU = 2 * Math.PI;
    this.z1 = null;
    this.generate = false;

    // use alea as underlying RNG so we can seed it
    this.seed = seed;
    this.alea = new Alea([seed]);
  }

  gauss(mu, sigma) {
    // sigma is standard deviation!
    this.generate = !this.generate;
    if (!this.generate) return this.z1 * sigma + mu;

    var u1 = 0,
      u2 = 0,
      z0;
    while (u1 === 0) u1 = this.alea.random();
    while (u2 === 0) u2 = this.alea.random();

    z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(this.TAU * u2);
    this.z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(this.TAU * u2);
    return z0 * sigma + mu;
  }

  gamma(alpha, beta) {
    // adapted from CPython.

    if (alpha <= 0.0 || beta <= 0.0) return null;

    if (alpha > 1.0) {
      var ainv = Math.sqrt(2.0 * alpha - 1.0);
      var bbb = alpha - this.LOG4;
      var ccc = alpha + ainv;

      var u1, u2, v, x, z, r;
      while (1) {
        u1 = this.alea.random();
        if (!(1e-7 < u1 && u1 < 0.9999999)) continue;

        u2 = 1.0 - this.alea.random();
        v = Math.log(u1 / (1.0 - u1)) / ainv;
        x = alpha * Math.exp(v);
        z = u1 * u1 * u2;
        r = bbb + ccc * v - x;
        if (r + this.SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z))
          return x * beta;
      }
    } else if (alpha == 1.0) {
      return -Math.log(1.0 - this.alea.random()) * beta;
    } else {
      var u, b, p, x, u1;
      while (1) {
        u = this.alea.random();
        b = (Math.E + alpha) / Math.E;
        p = b * u;
        if (p <= 1.0) x = Math.pow(p, 1.0 / alpha);
        else x = -Math.log((b - p) / alpha);
        u1 = this.alea.random();
        if (p > 1.0) {
          if (u1 <= x ** (alpha - 1.0)) break;
        } else if (u1 <= Math.exp(-x)) break;
      }
      return x * beta;
    }
  }

  unif(a, b) {
    // return uniform on [a, b)
    return a + this.alea.random() * (b - a);
  }

  random() {
    return this.unif(0, 1);
  }

  randint(a, b) {
    // random integer on [a, b]
    var min = Math.ceil(a);
    var max = Math.floor(b);
    return Math.floor(this.alea.random() * (max - min + 1)) + min;
  }
}

// The following rampHorizontal function is adapted from here:
// https://github.com/d3/d3-axis/issues/41
// The following license applies for this function.
/*
 * Copyright 2010-2016 Mike Bostock
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 *  * Neither the name of the author nor the names of contributors may be used
 *    to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 */
function rampHorizontal(x, color) {
  var size = 20; // should be the same as cvHeight for us

  function ramp(g) {
    var image = g.selectAll("image").data([null]),
      xz = x.range(),
      x0 = xz[0],
      x1 = xz[xz.length - 1],
      canvas = document.createElement("canvas"),
      context = ((canvas.width = x1 - x0 + 1),
      (canvas.height = 1),
      canvas).getContext("2d");

    for (let i = x0; i <= x1; ++i) {
      context.fillStyle = color(x.invert(i));
      context.fillRect(i - x0, 0, 1, 1);
    }

    image = image
      .enter()
      .append("image")
      .merge(image)
      .attr("x", x0)
      .attr("y", -size)
      .attr("width", x1 - x0 + 1)
      .attr("height", size)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", canvas.toDataURL());
  }

  ramp.position = function (_) {
    return arguments.length ? ((x = _), ramp) : x;
  };

  ramp.color = function (_) {
    return arguments.length ? ((color = _), ramp) : color;
  };

  ramp.size = function (_) {
    return arguments.length ? ((size = +_), ramp) : size;
  };

  return ramp;
}

// The following Alea export class is a port of an algorithm by Johannes Baagøe
// <baagoe@baagoe.com>, 2010 http://baagoe.com/en/RandomMusings/javascript/
// It is licensed under the following MIT license.
//
/*
 * Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
export class Alea {
  constructor(args) {
    this.s0 = 0;
    this.s1 = 0;
    this.s2 = 0;
    this.c = 1;

    if (
      args === undefined ||
      args == null ||
      args.length == 0 ||
      args[0] === undefined ||
      args[0] == null
    ) {
      args = [+new Date()];
    }

    var mash = this.Mash();
    this.s0 = mash(" ");
    this.s1 = mash(" ");
    this.s2 = mash(" ");

    for (let i = 0; i < args.length; i++) {
      this.s0 -= mash(args[i]);
      if (this.s0 < 0) this.s0 += 1;
      this.s1 -= mash(args[i]);
      if (this.s1 < 0) this.s1 += 1;
      this.s2 -= mash(args[i]);
      if (this.s2 < 0) this.s2 += 1;
    }

    mash = null;
  }

  random() {
    var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
    this.s0 = this.s1;
    this.s1 = this.s2;
    return (this.s2 = t - (this.c = t | 0));
  }

  randint() {
    return this.random() * 0x100000000; // 2^32
  }

  Mash() {
    var n = 0xefc8249d;

    var mash = function (data) {
      data = String(data);
      for (let i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-3
    };

    return mash;
  }
}

export class GenerateNewBandit {
  static banditInfo = {
    model: new ThompsonSampling(3, 0, 1, 1, 1),
    model_name: "N/A",
    model_id: 2, //0 = EGreedy, 1 = UCB, 2 = Thompson Sampling
    n_arms: 4, // Number of Arms, we can set at init
    parameters: {}, // Parameters for bandit of each arm
    steps: [],
    cur_step: 0, // Index of current step
    cur_arm: 0, // Index tag of current arm
    regret_t: [],
    true_mus: {}
  };

  constructor() {
    this.banditInfo = GenerateNewBandit.banditInfo;
    this.optimal = -1;
  }

  startGenerate = async (model_id, n_arms, extra_params={}, callback) => {
    console.log("startGenerate", model_id, n_arms);
    this.banditInfo.model_id = model_id;
    this.banditInfo.parameters = {};
    this.banditInfo.steps = [];
    this.banditInfo.cur_step = 0;
    this.banditInfo.cur_arm = 0;
    this.banditInfo.n_arms = n_arms;
    this.banditInfo.regret_t = [];

    this.banditInfo.true_mus = {};
    for(var i = 0; i < n_arms; i++){ this.banditInfo.true_mus[i] = 0.0; }
    this.banditInfo.true_mus = extra_params["true_mus"] !== undefined ? extra_params["true_mus"] : this.banditInfo.true_mus;

    this.optimal = Object.entries(this.banditInfo.true_mus).reduce((a, b) => a[1] > b[1] ? a : b)[1]

    if (this.banditInfo.model_id === 2) {
      // Thompson Sampling Init
      console.log("Init Thompson Sampling");
      this.banditInfo.model_name = "Thompson Sampling";

      // Supply provided parameters if they exist:
      var ma = extra_params["ma"] !== undefined ? extra_params["ma"] : 0;
      var va = extra_params["va"] !== undefined ? extra_params["va"] : 1;
      var alpha = extra_params["alpha"] !== undefined ? extra_params["alpha"] : 1;
      var beta = extra_params["beta"] !== undefined ? extra_params["beta"] : 1;

      // create a new parameter list for each key
      for (let i = 0; i < this.banditInfo.n_arms; i++) {
        this.banditInfo.parameters[i] = {"mu": 0, "sig2": 1, "ma": ma, "va": va, "alpha": alpha, "beta": beta, "n" : 0};
      }
      this.banditInfo.model = new ThompsonSampling(this.banditInfo.n_arms, ma, va, alpha, beta );
    }
    else if(this.banditInfo.model_id === 1) { // UpperConfidenceBound Init
      console.log("Init UpperConfidenceBound")
      this.banditInfo.model_name = "Upper Confidence Bound";

      // Supply provided parameters if they exist:
      var c = extra_params["c"] !== undefined ? extra_params["c"] : 1;

      for (let i = 0; i < this.banditInfo.n_arms; i++) {
        // create a new parameter list for each key
        this.banditInfo.parameters[i] = {"c": c, "Q": 0, "n": 0};
      }

      this.banditInfo.model = new UpperConfidenceBound(this.banditInfo.n_arms, c);
    }
    else if(this.banditInfo.model_id === 0) { // EpsilonGreedy Init
      console.log("Init EpsilonGreedy")
      this.banditInfo.model_name = "Epsilon Greedy";

      // Supply provided parameters if they exist:
      var epsln = extra_params["epsilon"] !== undefined ? extra_params["epsilon"] : 0.5;

      for (let i = 0; i < this.banditInfo.n_arms; i++) {
        // create a new parameter list for each key
        this.banditInfo.parameters[i] = {"epsilon": epsln, "n": 0};
      }
      this.banditInfo.model = new EpsilonGreedy(this.banditInfo.n_arms, epsln);
    }

    this.banditInfo.steps.push(this.banditInfo.parameters)
    
    // await this.setBanditInfo(this.banditInfo);
    if (callback) {
      let {model: _, true_mus: __, ...rest} = this.banditInfo;
      await callback(rest);
    }
  };

  recordInit = async (callback) => {
    this.banditInfo.cur_arm = this.banditInfo.model.act();
    console.log("very first arm is " + this.banditInfo.cur_arm);
    this.banditInfo.cur_step += 1;

    // TODO: Might duplicate first parameters, may want to remove this
    this.banditInfo.steps.push(this.banditInfo.parameters);

    // if (callback) await callback(this.banditInfo);
    if (callback) {
      let {model: _, true_mus: __, ...rest} = this.banditInfo;
      await callback(rest);
    }
  };

  record = async (reward, callback) => {
    console.log("In record, reward is " + reward);
    this.banditInfo.model.record(this.banditInfo.cur_arm, reward);
    // Perform parameter update:
    if (this.banditInfo.model_id === 2){ // Thompson Sampling Update
      this.banditInfo.parameters[this.banditInfo.cur_arm]["mu"] = this.banditInfo.model.get_rho(this.banditInfo.cur_arm);
      this.banditInfo.parameters[this.banditInfo.cur_arm]["sig2"] = this.banditInfo.model.get_sigma2_map(this.banditInfo.cur_arm);
    }
    else if (this.banditInfo.model_id === 1){
      this.banditInfo.parameters[this.banditInfo.cur_arm]["Q"] = this.banditInfo.model.get_Q(this.banditInfo.cur_arm);
    }
    else if (this.banditInfo.model_id === 0){
      this.banditInfo.parameters[this.banditInfo.cur_arm]["Q"] = this.banditInfo.model.get_Q(this.banditInfo.cur_arm);
    }
    this.banditInfo.parameters[this.banditInfo.cur_arm]["n"] += 1;

    // model Regret
    this.banditInfo.regret_t.push( this.optimal - this.banditInfo.true_mus[this.banditInfo.cur_arm])

    this.banditInfo.cur_arm = this.banditInfo.model.act();
    this.banditInfo.cur_step += 1;
    this.banditInfo.steps.push(this.banditInfo.parameters);

    // if (callback) await callback(this.banditInfo);
    if (callback) {
      let {model: _, true_mus: __, ...rest} = this.banditInfo;
      await callback(rest);
    }
  };

  getArm = (callback) => {
    if (callback) callback(this.banditInfo.cur_arm);
  };

  resetModel = (extra_params={}) => {
    this.banditInfo.model.reset();
    this.startGenerate(this.banditInfo.model_name, this.banditInfo.model_id, this.banditInfo.n_arms, extra_params);
  };

  newModel = (new_model_id, extra_params={}, callback) => {
    this.startGenerate(new_model_id, this.banditInfo.n_arms, extra_params);

    if (callback) callback();
  };

  getAtTimeline = (idx, callback) => {
    if (idx < this.banditInfo.steps.length){
      callback(this.banditInfo.steps[idx]);
    }
  };

  getModel = (callback) => {
    callback(this.banditInfo.model);
  };

  getParams = (callback) => {
    callback(this.banditInfo.parameters);
  };
}
