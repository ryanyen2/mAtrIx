/*
 * Multi-line graph using d3js (v5) with zoom and mouseover legend
 *
 * Copyright 2020, G.J.J. van den Burg
 * License: MIT
 */

import * as d3 from "d3";

export class LineGraph {

	constructor(selector, data_url) {
		this.selector = selector;
		this.dataPreprocessed = false;

		this.preprocess(data_url);
	}

	buildWhenReady(width, height) {
		var waiter, that = this;
		(waiter = function() {
			if(that.dataPreprocessed) {
				that.build(width, height);
			}
			else {
				setTimeout(waiter, 100);
			}
		})();
	}

	build(outerWidth, outerHeight) {
		if (this.data == null) {
			// we somehow have no data, so we won't build anything
			console.warn("Graph for ", this.selector, "received no data");
			return;
		}

		const leftMar = (outerWidth < 800) ? 0 : 20;

		var that = this;
		var margin = {top: 10, right: 20, bottom: 20, left: leftMar};
		var padding = {top: 0, right: 0, bottom: 30, left: 60};
		var innerWidth = outerWidth - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top - margin.bottom;
		var width = innerWidth - padding.left - padding.right;
		var height = innerHeight - padding.top - padding.bottom;

		this.initScaleAndAxis(width, height);

		/*
		* ##############################
		* #         Functions          #
		* ##############################
		*/

		var zoomTransform = function() {
			// var transform = d3.event.transform;
            var transform = d3.zoomTransform(this);
			that.xScale.domain(transform.rescaleX(that.xScaleOrig).domain());
			that.yScale.domain(transform.rescaleY(that.yScaleOrig).domain());
			that.svg.selectAll('.line').attr('d', d => line(d.values));
			that.svg.select('.axis--x').call(that.xAxis);
			that.svg.select('.axis--y').call(that.yAxis);
		}

		var moved = function(e) {
            // preventdefault
            e.preventDefault();

			// var xy = d3.mouse(this);
            var xy = d3.pointer(this);
			const X = that.data.X;
			const ym = that.yScale.invert(xy[1]);
			const xm = that.xScale.invert(xy[0]);
			const i1 = d3.bisectLeft(X, xm, 1);
			const i0 = i1 - 1;
			const i = xm - X[i0] > X[i1] - xm ? i1 : i0;
			const s = that.data.series.reduce(
				(a, b) => Math.abs(a.values[i] - ym) <
				Math.abs(b.values[i] - ym) ? a : b);
			path.attr('class', d => d === s ? 'line line-show' :
				'line line-hide').filter(d => d === s).raise();
			legend.select('text').text(s.name);
		}

		var entered = function() {
			legend.attr('display', null);
		}

		var left = function() {
			path.attr('class', 'line line-show')
				.style('stroke', d => swatch(d.name));
			legend.attr('display', "none");
		}

		/*
		* ##############################
		* #           Objects          #
		* ##############################
		*/

		// zoom Object
		var zoomObj = d3.zoom()
			.scaleExtent([1, 20]) // max zoom
			.translateExtent([[0, 0], [width, height]])
			.extent([[0, 0], [width, height]])
			.on("zoom", zoomTransform);

		var line = d3.line()
			.defined(d => !isNaN(d))
			.x((d, i) => that.xScale(that.data.X[i]))
			.y(d => that.yScale(d));

		/*
		* ################################
		* #           Build SVG          #
		* ################################
		*/

		d3.select(this.selector).select('svg').remove();

		// base svg
		this.svg = d3.select(this.selector)
			.on("touchstart", function(e) {
				// d3.event.preventDefault();
                e.preventDefault();
			})
			.on("touchmove", function(e) {
				e.preventDefault();
			})
			.append("svg")
			.attr("width", outerWidth)
			.attr("height", outerHeight)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' +
				margin.top + ')')
			.attr("viewBox", "0 0 " + outerWidth + " " +
				outerHeight);

		// defs for keeping the clip path
		var defs = this.svg.append('defs');
		defs.append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('width', width)
			.attr('height', height);

		// outer rectangle
		this.svg.append('rect')
			.attr('class', 'outer')
			.attr('width', innerWidth)
			.attr('height', innerHeight);

		// outer group (padding around the axes)
		var g = this.svg.append('g')
			.attr('transform', 'translate(' + padding.left + ',' +
				padding.top + ')');

		// inner rectangle
		g.append('rect')
			.attr('class', 'inner')
			.attr('width', width)
			.attr('height', height);

		// horizontal axis
		g.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + height + ')')
			.call(this.xAxis);

		// horizontal axis label
		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('class', 'axis-label')
			.attr('transform', 'translate(' + 0.95 * width + ',' +
				(height + 40) + ')')
			.text(this.meta.xlabel);

		// vertical axis
		g.append('g')
			.attr('class', 'axis axis--y')
			.attr('transform', 'translate(0, 0)')
			.call(this.yAxis);

		// vertical axis label
		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('class', 'axis-label')
			.attr('transform', 'rotate(270) translate(-' + 
				(height/2) + ', -50)')
			.text(this.meta.ylabel);

		// zoom group, with mouse events
		var gZoom = this.svg.append('g')
			.attr('transform', 'translate(' + padding.left + ',' + 
				padding.top + ')')
			.style('pointer-events', 'all');
		if ("ontouchstart" in document) {
			gZoom
				.on('touchmove', moved)
				.on('touchstart', entered)
				.on('touchend', left);
		} else {
			gZoom
				.on('mousemove', moved)
				.on('mouseenter', entered)
				.on('mouseleave', left);
		}
		gZoom.call(zoomObj);

		// zoom rectangle (this needs fill not none so we can hit it)
		gZoom.append('rect')
			.attr('class', 'zoom')
			.attr('width', width)
			.attr('height', height);

		// add the group we hang all the lines under
		var gView = gZoom.append('g')
			.attr('class', 'view');

		// pick a color swatch
		var swatch = d3.scaleOrdinal(d3.schemeCategory10)
			.domain(that.data.series.map(d => d.name));

		var path = gView.selectAll('path')
			.data(this.data.series)
			.join('path')
			.attr('class', 'line')
			.style('stroke', d => swatch(d.name))
			.attr('d', d => line(d.values));

		// legend
		var legend = g.append('g')
			.attr('class', 'legend')
			.attr('display', 'none');

		// legend text
		legend.append('text')
			.attr('class', 'legend-text')
			.attr('y', -8)
			.attr('transform', 'translate(' + 0.5 * width + ',' +
				(height + 50) + ')');

	}

	preprocess(datafile) {
		/* Accepts json data file
		 *
		 * {
		 * "meta": {
		 * 	"xlabel": "",
		 * 	"ylabel": "",
		 * 	("ymin": ymin)
		 * 	("ymax": ymax)
		 * 	("xmin": xmin)
		 * 	("xmax": xmax)
		 * 	},
		 * "data": {
		 * 	"X": [x1, x2, ..., xn],
		 * 	"series": [
		 * 		{
		 * 			"name": "Y_1",
		 * 			"values": [y11, y12, ..., y1n]
		 * 		},
		 * 		{
		 * 			"name": "Y_2",
		 * 			"values": [y21, y22, ..., y2n]
		 * 		}
		 * 	    ]
		 * 	}
		 * }
		 *
		 */
		if (datafile == null || datafile === undefined)
			return;

		this.fetchJSON(datafile);

		var waitFunc, that = this;
		(waitFunc = function() {
			if (that.dataReady)
				that.realPreProcess();
			else
				setTimeout(waitFunc, 100);
		})();
	}

	updateXYMinMax() {
		var D = this.data;

		this.xmin = this.meta.xmin === undefined ? d3.min(D.X) :
			parseFloat(this.meta.xmin);
		this.xmax = this.meta.xmax === undefined ? d3.max(D.X) :
			parseFloat(this.meta.xmax);
		this.ymin = this.meta.ymin === undefined ? d3.min(D.series,
			d => d3.min(d.values)) : parseFloat(this.meta.ymin);
		this.ymax = this.meta.ymax === undefined ? d3.max(D.series,
			d => d3.max(d.values)) : parseFloat(this.meta.ymax);

		this.xmin = this.xmin === undefined ? 0 : this.xmin;
		this.xmax = this.xmax === undefined ? 1 : this.xmax;
		this.ymin = this.ymin === undefined ? 0 : this.ymin;
		this.ymax = this.ymax === undefined ? 1 : this.ymax;
	}

	realPreProcess() {
		if (this.rawData == null) {
			return;
		}

		this.meta = this.rawData.meta;
		this.data = this.rawData.data;

		this.nLines = this.data.series.length;
		this.lineNames = this.data.series.map(s => s.name);

		this.lineNameMap = {};
		for (let s=0; s<this.nLines; s++) {
			this.lineNameMap[this.data.series[s].name] = s;
		}

		this.updateXYMinMax();

		this.dataPreprocessed = true;
	}

	fetchJSON(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		this.dataReady = false;
		this.rawData = null;

		var that = this;
		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				that.rawData = JSON.parse(this.response);
			}
			that.dataReady = true;
		}
		request.send();
	}

	initScaleAndAxis(W, H) {
		// the current scale (can be zoomed)
		this.xScale = d3.scaleLinear().range([0, W]);
		this.xScaleOrig = d3.scaleLinear().range([0, W]);
		this.yScale = d3.scaleLinear().range([H, 0]);
		this.yScaleOrig = d3.scaleLinear().range([H, 0]);

		this.xAxis = d3.axisBottom(this.xScale);
		this.yAxis = d3.axisLeft(this.yScale);

		// for small graph sizes, use half the number of ticks
		if (W < 400)
			this.xAxis.ticks(5);

		var xExt = [this.xmin, this.xmax];
		var yExt = [this.ymin, this.ymax];

		var xRange = xExt[1] - xExt[0];
		var xDomainMin = xExt[0] - xRange * 0.02;
		var xDomainMax = xExt[1] + xRange * 0.02;

		var yRange = yExt[1] - yExt[0];
		this.yDomainMin = yExt[0] - yRange * 0.02;
		this.yDomainMax = yExt[1] + yRange * 0.02;

		this.xScale.domain([xDomainMin, xDomainMax]);
		this.xScaleOrig.domain([xDomainMin, xDomainMax]);
		this.yScale.domain([this.yDomainMin, this.yDomainMax]);
		this.yScaleOrig.domain([this.yDomainMin, this.yDomainMax]);
	}

	appendObservation(x, ys) {
		// Append a set of observations to the data this graph holds
		// -> x is a scalar for the X axis
		// -> ys is an Object where each key is a name and each value 
		// is a scalar to append to the series with that name
		this.data.X.push(x);

		var S;
		for (const [key, val] of Object.entries(ys)) {
			S = this.data.series[this.lineNameMap[key]];
			S.values.push(val);
		}
	}
}