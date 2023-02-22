import React from "react";
import * as d3 from "d3";

class RadarChart extends React.Component {
    componentDidMount() {
        // this.drawChart();
        var margin = { top: 100, right: 100, bottom: 100, left: 100 },
            width =
                Math.min(700, window.innerWidth - 10) -
                margin.left -
                margin.right,
            height = Math.min(
                width,
                window.innerHeight - margin.top - margin.bottom - 20
            );

        DrawRadarChart("#barchart", [], {
            w: width,
            h: height,
            margin: margin,
            maxValue: 0.5,
            levels: 5,
            roundStrokes: true,
            // color: d3.scaleOrdinal().range(['#EDC951', '#CC333F', '#00A0B0']),
            axis: [
                "Battery Life",
                "Brand",
                "Contract Cost",
                "Design And Quality",
                "Have Internet Connectivity",
                "Large Screen",
                "Price Of Device",
                "To Be A Smartphone",
            ],
        });
    }

    render() {
        return <div></div>;
    }
}

// REF: https://stackoverflow.com/questions/32281168/find-a-point-on-a-line-closest-to-a-third-point-javascript
function findNearestPointOnLine(px, py, ax, ay, bx, by) {
    const atob = { x: bx - ax, y: by - ay };
    const atop = { x: px - ax, y: py - ay };
    const len = atob.x * atob.x + atob.y * atob.y;
    let dot = atop.x * atob.x + atop.y * atob.y;
    const t = Math.min(1, Math.max(0, dot / len));

    dot = (bx - ax) * (py - ay) - (by - ay) * (px - ax);

    return { x: ax + atob.x * t, y: ay + atob.y * t };
}

// REF: https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

// REF: https://stackoverflow.com/questions/6139720/pure-javascript-function-similar-to-jquery-offset
function getOffset(element)
{
    if (!element.getClientRects().length)
    {
      return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return (
    {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });   
}

// REF: https://gist.github.com/nbremer/21746a9668ffdf6d8242
function DrawRadarChart(id, data, options) {
    var cfg = {
        w: 600, //Width of the circle
        h: 600, //Height of the circle
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
        levels: 3, //How many levels or inner circles should there be drawn
        maxValue: 0, //What is the value that the biggest circle will represent
        labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, //The opacity of the area of the blob
        dotRadius: 8, //The size of the colored circles of each blog
        opacityCircles: 0.1, //The opacity of the circles of each blob
        strokeWidth: 2, //The width of the stroke around each blob
        roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.schemeCategory10, //Color function
    };

    //Put all of the options into a variable called cfg
    if ("undefined" !== typeof options) {
        for (var i in options) {
            if ("undefined" !== typeof options[i]) {
                cfg[i] = options[i];
            }
        } //for i
    } //if
    console.log(cfg.color);

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = data.length
        ? Math.max(
              cfg.maxValue,
              d3.max(data, function (i) {
                  return d3.max(
                      i.map(function (o) {
                          return o.value;
                      })
                  );
              })
          )
        : cfg.maxValue;

    // var allAxis = data[0].map(function (i, j) {
    //     return i.axis
    //   }), //Names of each axis
    var allAxis = cfg.axis,
        total = allAxis.length, //The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
        Format = d3.format(".0%"), //Percentage formatting REF: https://github.com/d3/d3-format
        angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    var dataNew;
    function resetDataNew() {
        dataNew = { data: [], numFilled: 0, dataFinal: [] };
        allAxis.forEach((ax, ind) => {
            dataNew.data.push({ axis: ax, value: -1, ind: ind });
        });
    }
    resetDataNew();

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3
        .select(id)
        .append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);
    //Append a g element
    var g = svg
        .append("g")
        .attr(
            "transform",
            "translate(" +
                (cfg.w / 2 + cfg.margin.left) +
                "," +
                (cfg.h / 2 + cfg.margin.top) +
                ")"
        );

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append("defs").append("filter").attr("id", "glow"),
        feGaussianBlur = filter
            .append("feGaussianBlur")
            .attr("stdDeviation", "2.5")
            .attr("result", "coloredBlur"),
        feMerge = filter.append("feMerge"),
        feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
        feMergeNode_2 = feMerge
            .append("feMergeNode")
            .attr("in", "SourceGraphic");

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid
        .selectAll(".levels")
        .data(d3.range(1, cfg.levels + 1).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d, i) {
            return (radius / cfg.levels) * d;
        })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    //Text indicating at what % each level is
    axisGrid
        .selectAll(".axisLabel")
        .data(d3.range(1, cfg.levels + 1).reverse())
        .enter()
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function (d) {
            return (-d * radius) / cfg.levels;
        })
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function (d, i) {
            return Format((maxValue * d) / cfg.levels);
        });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid
        .selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) {
            return (
                rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
            );
        })
        .attr("y2", function (d, i) {
            return (
                rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
            );
        })
        .attr("class", function (d, i) {
            return "line";
            // return `line line${i}`
            // return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
        })
        .attr("id", function (d, i) {
            return `line${i}`;
            // return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
        })
        .style("stroke", "white")
        .style("stroke-width", "8px")
        .on("mouseover", function (d, i) {
            // REF: https://stackoverflow.com/questions/20641953/how-to-select-parent-element-of-current-element-in-d3-js
            d3.select(this.parentNode).raise();
            d3.select(this).transition().duration(20).style("opacity", .7).transition().duration(200).style("stroke", cfg.color[9]);
        })
        .on("click", function (d, i) {
            // we want to know the axis value where the click happened
            // REF: https://stackoverflow.com/questions/2614461/javascript-get-mouse-position-relative-to-parent-element
            // REF: https://stackoverflow.com/questions/33429136/round-to-3-decimal-points-in-javascript-jquery
            var x1 = +d.currentTarget.x1.baseVal.value.toFixed(3);
            var y1 = +d.currentTarget.y1.baseVal.value.toFixed(3);
            var x2 = +d.currentTarget.x2.baseVal.value.toFixed(3);
            var y2 = +d.currentTarget.y2.baseVal.value.toFixed(3);
            var clickX =
                x2 < 0
                    ? getOffset(d.currentTarget).left +
                      (x1 > x2 ? x1 - x2 : x2 - x1) -
                      d.pageX
                    : d.pageX - getOffset(d.currentTarget).left;
            var clickY =
                y2 < 0
                    ? getOffset(d.currentTarget).top +
                      (y1 > y2 ? y1 - y2 : y2 - y1) -
                      d.pageY
                    : d.pageY - getOffset(d.currentTarget).top;
            x1 = Math.abs(x1);
            y1 = Math.abs(y1);
            x2 = Math.abs(x2);
            y2 = Math.abs(y2);
            var closestPoint = findNearestPointOnLine(
                clickX,
                clickY,
                x1,
                y1,
                x2,
                y2
            );
            var axisVal = Math.min(
                (distance(x1, y1, closestPoint.x, closestPoint.y) /
                    (distance(x1, y1, x2, y2) / 1.1)) *
                    maxValue,
                maxValue
            );
            // console.log(axisVal)
            // REF: https://stackoverflow.com/questions/1623221/how-to-find-a-number-in-a-string-using-javascript
            var ind = +d.currentTarget.id.match(/\d+/)[0];
            dataNew.data[ind].value = axisVal;
            dataNew.numFilled++;
            if (dataNew.numFilled === allAxis.length) {
                console.log("ALL AXES SELECTED");
            }
            // REF: https://www.youtube.com/watch?v=om9MicFOzA4
            drawblob([dataNew.data.filter((a) => a.value >= 0)]);
        })
        .on("mouseout", function (d, i) {
            d3.select(this).transition().duration(200).style("stroke", "white").transition().duration(20).style("opacity", 1);
        });

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function (d, i) {
            return (
                rScale(maxValue * cfg.labelFactor) *
                Math.cos(angleSlice * i - Math.PI / 2)
            );
        })
        .attr("y", function (d, i) {
            return (
                rScale(maxValue * cfg.labelFactor) *
                Math.sin(angleSlice * i - Math.PI / 2)
            );
        })
        .text(function (d) {
            return d;
        })
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    function drawblob(receivedData) {
        var radarLine = d3
            .lineRadial()
            .curve(d3.curveBasisClosed)
            .radius(function (d) {
                return rScale(d.value);
            })
            .angle(function (d, i) {
                return d.ind * angleSlice;
            });

        if (cfg.roundStrokes) {
            radarLine.curve(d3.curveCardinalClosed);
        }
        //Create a wrapper for the blobs
        var blobWrapper = g
            .selectAll(".radarWrapper")
            .data(receivedData);

        var blobRadarWrapper = blobWrapper
            .enter()
            .append("g")
            // REF: https://www.youtube.com/watch?v=om9MicFOzA4
            .merge(blobWrapper)
            .attr("class", function (d, i) {
                return "radarWrapper";
            });

        // we do not want the background so that it will not occlude the axis lines behind it, so that users can still click on the axis behind to change the axis values.
        //Append the backgrounds
        // var blobRadarArea = blobRadarWrapper.selectAll('.radarArea').data((d, i) => [d])

        // blobRadarArea
        //   .enter()
        //   .append('path')
        //   .merge(blobRadarArea)
        //   .attr('class', 'radarArea')
        //   .attr('d', function (d, i) {
        //     return radarLine(d)
        //   })
        //   .style('fill', function (d, i) {
        //     return cfg.color(i)
        //   })
        //   .style('fill-opacity', cfg.opacityArea)
        //   .on('mouseover', function (d, i) {
        //     //Dim all blobs
        //     d3.selectAll('.radarArea').transition().duration(200).style('fill-opacity', 0.1)
        //     //Bring back the hovered over blob
        //     d3.select(this).transition().duration(200).style('fill-opacity', 0.7)
        //   })
        //   .on('mouseout', function () {
        //     //Bring back all blobs
        //     d3.selectAll('.radarArea').transition().duration(200).style('fill-opacity', cfg.opacityArea)
        //   })

        //Create the outlines
        var blobRadarStroke = blobRadarWrapper
            .selectAll(".radarStroke")
            .data((d, i) => [d]);

        blobRadarStroke
            .enter()
            .append("path")
            .merge(blobRadarStroke)
            .attr("class", "radarStroke")
            .attr("d", function (d, i) {
                return radarLine(d);
            })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function (d, i) {
                // return cfg.color(1);
                return cfg.color[1];
            })
            .style("fill", "none")
            .style("filter", "url(#glow)");

        //Append the circles
        var blobRadarCircle = blobRadarWrapper
            // REF: https://binyamin.medium.com/d3-select-selectall-data-enter-and-exit-f0e4f0d3e1d0
            // selectAll returns an empty selection, because there’s no radarCircle whatsoever within the svg that we targeted. That means D3 will decide that all X data points are leftover or missing elements, so it adds all X numbers to the enter selection.
            .selectAll(".radarCircle")
            .data(function (d, i) {
                // console.log(`radarCircle data: ${d}`);
                return d;
            });
        blobRadarCircle
            // .data(dataNew.data.filter((a) => a.value >= 0))
            .enter()
            .append("circle")
            .merge(blobRadarCircle)
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function (d, i) {
                // console.log(`HELLO: ${d.value}`)
                return (
                    rScale(d.value) * Math.cos(angleSlice * d.ind - Math.PI / 2)
                );
                // return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
            })
            .attr("cy", function (d, i) {
                return (
                    rScale(d.value) * Math.sin(angleSlice * d.ind - Math.PI / 2)
                );
                // return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
            })
            .style("fill", function (d, i, j) {
                // return cfg.color(j)
                return cfg.color[3];
            })
            .style("fill-opacity", 0.8)
            .style("pointer-events", "all")
            .on("mouseover", function (d, i) {
                var newX = parseFloat(d3.select(this).attr("cx")) - 10;
                var newY = parseFloat(d3.select(this).attr("cy")) - 10;

                tooltip
                    .attr("x", newX)
                    .attr("y", newY)
                    .text(Format(i.value))
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200).style("opacity", 0);
            });
    }

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text").attr("class", "tooltip").style("opacity", 0);

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text
                    .text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");

            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
    } //wrap
} //RadarChart

export default RadarChart;
