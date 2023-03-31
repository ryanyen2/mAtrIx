import React, { cloneElement } from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import jStat from "jstat";
import cloneDeep from "lodash";

export default function AlgGraph(props) {
    const [trueRewards, setTrueRewards] = useState([0.4, 0.5, 0.6, 0.7]);
    const numArms = 4;
    const w = 400,
        h = 100;
    const mounted = useRef(0);
    // const [lastSelectedBanditIndex, setLastSelectedBanditIndex] = useState(-1);
    const [theBandits, setTheBandits] = useState([
        {
            // currentDistributionParameters: {
            alpha: 1,
            beta: 1,
            // },
            currentActualProbability: 0.3,
            // stats: {
            numberSuccesses: 0,
            numberPulls: 1,
            probabilityHistory: [],
            // },
        },
        {
            // currentDistributionParameters: {
            alpha: 1,
            beta: 1,
            // },
            currentActualProbability: 0.5,
            // stats: {
            numberSuccesses: 0,
            numberPulls: 1,
            probabilityHistory: [],
            // },
        },
        {
            // currentDistributionParameters: {
            alpha: 1,
            beta: 1,
            // },
            currentActualProbability: 0.7,
            // stats: {
            numberSuccesses: 0,
            numberPulls: 1,
            probabilityHistory: [],
            // },
        },
        {
            // currentDistributionParameters: {
            alpha: 1,
            beta: 1,
            // },
            currentActualProbability: 0.9,
            // stats: {
            numberSuccesses: 0,
            numberPulls: 1,
            probabilityHistory: [],
            // },
        },
        -1
    ]);

    var x_array = [];
    var _N = 100;
    var max_data = 80;
    var margin = 15;

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

        // for ( var i =0; i < _N; i++ ){
        // x_array.push( .01*i )
        // }
        x_array.push(0.0001);
        for (var i = 1; i < _N - 1; i++) {
            x_array.push(0.01 * i);
        }
        x_array.push(1 - 0.0001);

        theBandits.forEach(function (b, index) {
            var theId = "graph_" + index;

            var vis = d3
                .select("#alggraphparent")
                .append("svg")
                .attr("id", "#" + theId)
                .attr("width", w)
                .attr("height", h);

            var g = vis.append("svg:g").attr("id", "theGraph_" + index);
        });

        draw();

        var i = setInterval(() => runBandits(), 1000);

        return () => clearInterval(i);
    }, []);

    useEffect(() => {
        update();
    }, [theBandits]);

    function runBandits() {
        // console.log("Running bandits");
        var selectedBandit = Math.floor(Math.random() * numArms);
        // setLastSelectedBanditIndex(selectedBandit);
        console.log("Bandit index " + selectedBandit + " chosen");
        // if(selectedBandit === 1) {
        // console.log("Bandit index " + selectedBandit + " chosen, prior alpha is " +
        // theBandits[1].alpha  +
        // " and beta is " +
        // theBandits[1].beta);
        // }
        // var copy = JSON.parse(JSON.stringify(theBandits));
        var c = cloneDeep(theBandits).__wrapped__;
        // console.log(c);
        if (Math.random() < c[selectedBandit].currentActualProbability) {
            c[selectedBandit].alpha++;
        } else {
            c[selectedBandit].beta++;
        }
        c[numArms] = selectedBandit;
        setTheBandits(c);
        // const updatedBandits = theBandits.map((b, i) => {
        //     if(i === selectedBandit) {
        //         var c = cloneDeep(b);
        //         if (
        //             Math.random() < b.currentActualProbability
        //         )
        //             c.alpha = c.alpha + 1;
        //         else
        //             c.beta = c.beta + 1;
        //         return c;
        //     } else {
        //         return b;
        //     }
        // })
        // setTheBandits(updatedBandits);

        // if (
        //     Math.random() < theBandits[selectedBandit].currentActualProbability
        // ) {
        //     setTheBandits(prevBandits => {
        //         console.log(prevBandits);
        //         // const allB = [...prevBandits];
        //         var allB = cloneDeep(prevBandits);
        //         console.log(prevBandits);
        //         // // allB[selectedBandit] = [...allB[selectedBandit]];
        //         // allB[selectedBandit].alpha =
        //         // allB[selectedBandit].alpha + 1;
        //         // // if(selectedBandit === 1) {
        //         //     console.log("Bandit index " + selectedBandit + " chosen, alpha is " +
        //         //     allB[1].alpha  +
        //         //     " and beta is " +
        //         //     allB[1].beta);
        //         // }
        //         return allB;
        //       });
        //     // success
        //     // copy[selectedBandit].alpha++;
        // } else {
        //     // failure
        //     setTheBandits(prevBandits => {
        //         // const allB = [...prevBandits];
        //         var allB = cloneDeep(prevBandits);
        //         // allB[selectedBandit] = [...allB[selectedBandit]];
        //         // allB[selectedBandit].beta =
        //         // allB[selectedBandit].beta + 1;
        //         // // if(selectedBandit === 1) {
        //         //     console.log("Bandit index " + selectedBandit + " chosen, alpha is " +
        //         //     allB[1].alpha  +
        //         //     " and beta is " +
        //         //     allB[1].beta);
        //         // }
        //         return allB;
        //       });
        //     // copy[selectedBandit].beta++;
        // }
        // setTheBandits(copy);
        // if(selectedBandit === 1) {
        //     console.log("Bandit index 1 chosen, alpha is " +
        //     copy[selectedBandit].alpha  +
        //     " and beta is " +
        //     copy[selectedBandit].beta);
        // }
    }

    function update() {
        console.log("In update");
        if(theBandits[numArms] < 0) return;
        console.log("Update called for index " + theBandits[numArms]);
        var b = theBandits[theBandits[numArms]];
        var index = theBandits[numArms];
        var alpha = b.alpha;
        var beta = b.beta;
        var theMax = -1;
        var g = d3.select("#theGraph_" + index);

        var _data = x_array.map(function (x) {
            var y = jStat.beta.pdf(x, alpha, beta);
            theMax = Math.max(y, theMax);
            // console.log(y);
            return y;
            //console.log(x + ", " + jStat.beta.pdf(x,alpha,beta));
            //            return jStat.beta.pdf(x,alpha,beta);
        });
        var y = d3
                .scaleLinear()
                .domain([0, theMax])
                .range([h - margin, 0 + margin]),
            x = d3
                .scaleLinear()
                .domain([0, _N])
                .range([0 + margin, w - margin]);

        var line = d3
            .line()
            .x(function (d, i) {
                return x(i);
            })
            .y((d) => {
                // console.log(d);
                return d;
            });
        d3.selectAll("#line-" + index).remove();
        g.selectAll("path.line")
            .data([_data])
            .enter()
            .append("path")
            // .join("path")
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
    }

    function draw() {
        theBandits.forEach(function (b, index) {
            var theId = "graph_" + index;
            // var w = that.defaultWidth; //400;
            // var h = that.defaultHeight; //100;

            // console.log(d3.select("#" + theId));
            // var vis = d3
            //     .select("#" + theId)
            //     .append("svg")
            //     .attr("width", w)
            //     .attr("height", h);

            var g = d3.select("#theGraph_" + index);

            var alpha = b.alpha;
            var beta = b.beta;

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
                .y((d) => {
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

            //     //console.log(_N*b.currentActualProbability);
            // g.append("svg:line")
            //     .attr("id", "actualProb_" + index)
            //     .attr(
            //         "x1",
            //         margin + (w - 2 * margin) * b.currentActualProbability
            //     )
            //     .attr("y1", y(0))
            //     .attr(
            //         "x2",
            //         margin + (w - 2 * margin) * b.currentActualProbability
            //     )
            //     .attr("y2", y(max_data))
            //     .attr("stroke", "#000000")
            //     .attr("stroke-width", "2px")
            //     .attr("banditIndex", index)
            //     .attr("class", "actualProbabilityLine")
            //     .attr(
            //         "titleIgnore",
            //         "This is the current actual probability of success for this bandit.  If it is lower than that of the other bandits, then the bandit may be tried rarely; if it changes later to a high value, it may take a while for the bandit to be tried again so that the algorithm can start learning that it has become better."
            //     );
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
                .data(d3.range(0, 1.2, 0.1).map((e) => e.toFixed(1)))
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

            var vis = d3.select("#" + theId);

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
                    margin + (w - 2 * margin) * b.currentActualProbability
                )
                .attr("y1", y(0))
                .attr(
                    "x2",
                    margin + (w - 2 * margin) * b.currentActualProbability
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
    }

    return <div></div>;
}
