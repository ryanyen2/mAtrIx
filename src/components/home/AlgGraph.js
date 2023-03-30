import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import jStat from "jstat";

export default function AlgGraph(props) {
    const [trueRewards, setTrueRewards] = useState([0.4, 0.5, 0.6, 0.7]);
    const numArms = 4;
    const w = 400,
        h = 100;
    const mounted = useRef(0);
    const theBandits = [
        {
            currentDistributionParameters: {
                alpha: 0.4,
                beta: 0.5,
            },
            CurrentActualProbability: .3
        },
        {
            currentDistributionParameters: {
                alpha: 0.4,
                beta: 0.5,
            },
            CurrentActualProbability: .5
        },
        {
            currentDistributionParameters: {
                alpha: 0.4,
                beta: 0.5,
            },
            CurrentActualProbability: .7
        },
        {
            currentDistributionParameters: {
                alpha: 0.4,
                beta: 0.5,
            },
            CurrentActualProbability: .9
        },
    ];

    // var unselectIt = function () {
    //     d3.selectAll(".actualProbabilityLine").classed("lineActive", false);
    //     that.currentLineSelected = null;
    // };

    // REF: https://stackoverflow.com/questions/32855077/react-get-bound-parent-dom-element-name-within-component
    // const parentNodeID = ReactDOM.findDOMNode(this).parentNode.getAttribute("id");
    // console.log(parentNodeID);

    // https://stackoverflow.com/questions/53945763/componentdidmount-equivalent-on-a-react-function-hooks-component
    // run only at the start after mounting
    useEffect(() => {
        console.log("I am in here");
        // var d3ParentDiv = d3
        //     .select("#alggraphparent")
        //     .append("svg")
        //     .attr("id", "thisisatest")
        //     .attr("width", w)
        //     .attr("height", h * 4);

        // REF: https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
        // [...Array(numArms).keys()].forEach(function (n, index) {
        //     d3ParentDiv.append("svg").attr("id", "graph_" + index);
        // });
        var x_array = [];
        var _N = 100;
        var max_data = 80;
        // for ( var i =0; i < _N; i++ ){
        // x_array.push( .01*i )
        // }
        x_array.push(0.0001);
        for (var i = 1; i < _N - 1; i++) {
            x_array.push(0.01 * i);
        }
        x_array.push(1 - 0.0001);
        var w = 400;
        var h = 100;
        var margin = 15;

        theBandits.forEach(function (b, index) {
            var theId = "graph_" + index;
            // var w = that.defaultWidth; //400;
            // var h = that.defaultHeight; //100;

            console.log(d3.select("#" + theId));
            // var vis = d3
            //     .select("#" + theId)
            //     .append("svg")
            //     .attr("width", w)
            //     .attr("height", h);
            var vis = d3
                .select("#alggraphparent")
                .append("svg")
                .attr("id", "#" + theId)
                .attr("width", w)
                .attr("height", h);

            var g = vis.append("svg:g").attr("id", "theGraph_" + index);

            var alpha = b.currentDistributionParameters.alpha;
            var beta = b.currentDistributionParameters.beta;

            var theMax = -1;

            var _data = x_array.map(function (x) {
                var y = jStat.beta.pdf(x, alpha, beta);
                theMax = Math.max(y, theMax);
                // console.log(y);
                return y;
                //console.log(x + ", " + jStat.beta.pdf(x,alpha,beta));
                //            return jStat.beta.pdf(x,alpha,beta);
            });
            // console.log(_data);

            var y = d3
                    .scaleLinear()
                    .domain([0, theMax])
                    .range([h - margin, 0 + margin]),
                x = d3
                    .scaleLinear()
                    .domain([0, _N])
                    .range([0 + margin, w - margin]);

            // (y = d3.scaleLinear()
            //     .domain([0, max_data])
            //     .range([h - margin, 0 + margin])),
            //     (x = d3.scaleLinear()
            //         .domain([0, _N])
            //         .range([0 + margin, w - margin]));

            var line = d3
                .line()
                .x(function (d, i) {
                    return x(i);
                })
                .y(d => {
                    // console.log(d);
                    return d;
                });
                // .y(y);

            // console.log(line);

            //console.log(_data);
            g.selectAll("path.line")
                .data([_data])
                .enter()
                .append("path")
                .attr("stroke", "#0000FF")
                .attr("fill", "none")
                .attr("class", "area")
                .attr("d", line)
                .attr("id", "line-" + index)
                .attr("stroke-width", "2px")
                .attr(
                    "titleIgnore",
                    "This is the current distribution for the probability of success (it is a beta distribution with parameters alpha=1+#successes, beta=1+#misses).  Each time the bandit is tried, this distribution will get updated based on whether there was a success or not."
                );

            g.append("svg:line")
                .attr("x1", x(0))
                .attr("y1", y(0))
                .attr("x2", x(w))
                .attr("y2", y(0))
                .attr("stroke", "#000000");

            g.append("svg:line")
                .attr("x1", x(0))
                .attr("y1", y(0))
                .attr("x2", x(0))
                .attr("y2", y(max_data))
                .attr("stroke", "#000000");

            //     //console.log(_N*b.CurrentActualProbability);
            g.append("svg:line")
                .attr("id", "actualProb_" + index)
                .attr(
                    "x1",
                    margin + (w - 2 * margin) * b.CurrentActualProbability
                )
                .attr("y1", y(0))
                .attr(
                    "x2",
                    margin + (w - 2 * margin) * b.CurrentActualProbability
                )
                .attr("y2", y(max_data))
                .attr("stroke", "#000000")
                .attr("stroke-width", "2px")
                .attr("banditIndex", index)
                .attr("class", "actualProbabilityLine")
                .attr(
                    "titleIgnore",
                    "This is the current actual probability of success for this bandit.  If it is lower than that of the other bandits, then the bandit may be tried rarely; if it changes later to a high value, it may take a while for the bandit to be tried again so that the algorithm can start learning that it has become better."
                );
            // .on("mouseover", function () {
            //     d3.select(this).classed("lineActive", true);
            // })
            // .on("mousedown", function () {
            //     //d3.select(this).classed("lineSelected",true);
            //     that.currentLineSelected = d3.select(this);
            //     //var theThing = d3.select(this);
            //     //console.log(d3.select(this));
            // })
            // .on("mouseout", function () {
            //     if (!that.currentLineSelected) {
            //         d3.select(this).classed("lineActive", false);
            //     }
            // });

            //     // .on("mousemove",function() {
            //     // //d3.select(this).classed("lineSelected",false);
            //     // })

            //     // var drag = d3.behavior.drag()
            //     // .on("drag", function(d,i) {
            //     // d.x += d3.event.dx;
            //     // d.y += d3.event.dy;
            //     // var thing = d3.select(this);
            //     // if (thing.classed("lineSelected")) {
            //     //
            //     // console.log(thing);
            //     //
            //     // thing.attr("transform", function(d,i){
            //     // return "translate(" + [ d.x,d.y ] + ")"
            //     // })
            //     // }
            //     // });
            g.selectAll(".xLabel")
                // fix floating point precision issues
                .data(d3.range(0, 1.2, 0.1).map(e => e.toFixed(1)))
                .enter()
                .append("svg:text")
                .attr("class", "xLabel")
                .text(String)
                .attr("x", function (d) {
                    return x(100 * d);
                })
                .attr("y", h)
                .attr("text-anchor", "middle")
                .attr("dy", 0.0);

            g.selectAll(".xTicks")
                .data(x.ticks(10))
                .enter()
                .append("svg:line")
                .attr("class", "xTicks")
                .attr("x1", function (d) {
                    return x(d);
                })
                .attr("y1", y(0))
                .attr("x2", function (d) {
                    return x(d);
                })
                .attr("y2", y(-0.3));

            vis.append("text")
                .attr("x", w / 2)
                .attr("y", 15)
                .attr("text-anchor", "middle")
                .style("font-size", "17px")
                .text("Posterior Distributions");

            g.append("svg:line")
                .attr("id", "actualProb_" + index)
                .attr(
                    "x1",
                    margin + (w - 2 * margin) * b.CurrentActualProbability
                )
                .attr("y1", y(0))
                .attr(
                    "x2",
                    margin + (w - 2 * margin) * b.CurrentActualProbability
                )
                .attr("y2", y(max_data))
                .attr("stroke", "#000000")
                .attr("stroke-width", "2px")
                .attr("banditIndex", index)
                .attr("class", "actualProbabilityLine");
                // .attr(
                //     "titleIgnore",
                //     "This is the current actual probability of success for this bandit.  If it is lower than that of the other bandits, then the bandit may be tried rarely; if it changes later to a high value, it may take a while for the bandit to be tried again so that the algorithm can start learning that it has become better."
                // )
                // .on("mouseover", function () {
                //     d3.select(this).classed("lineActive", true);
                // })
                // .on("mousedown", function () {
                //     //d3.select(this).classed("lineSelected",true);
                //     that.currentLineSelected = d3.select(this);
                //     //var theThing = d3.select(this);
                //     //console.log(d3.select(this));
                // })
                // .on("mouseout", function () {
                //     if (!that.currentLineSelected) {
                //         d3.select(this).classed("lineActive", false);
                //     }
                // });

            //     that.theVis[index] = vis;
        });
    });

    function handleSubmitModelParameters(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        fetch("/api/updateModelParams", { method: "PUT", body: formData });

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        // console.log(formData);
        // console.log(formJson);
    }

    return (
        <div id="alg_graph" style={{ color: "black" }}>
            {/* <div id="graph_0"></div>
            <div id="graph_1"></div>
            <div id="graph_2"></div>
            <div id="graph_3"></div> */}
        </div>
    );
}
