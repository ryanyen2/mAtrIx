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
        -1,
    ]);

    const [xArray, setXArray] = useState([]);
    var _N = 100;
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
        // xArray.push( .01*i )
        // }
        xArray.push(0.0001);
        for (var i = 1; i < _N - 1; i++) {
            xArray.push(0.01 * i);
        }
        xArray.push(1 - 0.0001);
        setXArray(xArray);

        theBandits.forEach(function (b, index) {
            if (index >= numArms) return;
            var theId = "graph_" + index;

            d3.selectAll("#graph_" + index).remove();
            var vis = d3
                .select("#alggraphparent")
                .append("svg")
                .attr("id", theId)
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
        // // console.log("Running bandits");
        var selectedBandit = Math.floor(Math.random() * numArms);
        const newBanidtsList = theBandits.map((b, i) => {
            if (i === selectedBandit) {
                if (Math.random() < b.currentActualProbability) {
                    b.alpha++;
                } else {
                    b.beta++;
                }
            } else if (i === numArms) {
                b = selectedBandit;
            }
            return b;
        });
        setTheBandits(newBanidtsList);
    }

    function update() {
        console.log(xArray);
        // console.log("In update");
        if(theBandits[numArms] < 0) return;
        console.log("Update called for index " + theBandits[numArms]);
        var b = theBandits[theBandits[numArms]];
        var index = theBandits[numArms];
        var alpha = b.alpha;
        var beta = b.beta;
        
        var g = d3.select("#theGraph_" + index);
        console.log(g);

        var theMax = -1;
        var _data = xArray.map(function (x) {
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

        var d = [];
        var xt10 = x.ticks(_N);
        for (var i = 0; i < _N; i++) {
            d.push([x(xt10[i]), y(_data[i])]);
        }
        console.log(alpha, beta, xArray, _data, d);
        var line = d3.line();
        
        d3.selectAll("#line_" + index).remove();
        g.append("path")
            .attr("d", line(d))
            .attr("stroke", "#0000FF")
            .attr("id", "line_" + index)
            .attr("fill", "none")
            .attr("stroke-width", "2px");
    }

    function draw() {
        theBandits.forEach(function (b, index) {
            if (index == numArms) return;
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

            var _data = xArray.map(function (x) {
                var y = jStat.beta.pdf(x, alpha, beta);
                // var y = jStat.beta.pdf(x, 1, 2);
                theMax = Math.max(y, theMax);
                // console.log(y);
                return y;
                //console.log(x + ", " + jStat.beta.pdf(x,alpha,beta));
                //            return jStat.beta.pdf(x,alpha,beta);
            });
            // console.log(_data);
            // console.log(theMax);

            var y = d3
                    .scaleLinear()
                    .domain([0, theMax])
                    .range([h - margin, 0 + margin]),
                x = d3
                    .scaleLinear()
                    .domain([0, _N])
                    .range([0 + margin, w - margin]);

            var d = [];
            var xt10 = x.ticks(_N);
            for (var i = 0; i < _N; i++) {
                d.push([x(xt10[i]), y(_data[i])]);
            }
            var line = d3.line();

            g.append("path")
                .attr("d", line(d))
                .attr("stroke", "#0000FF")
                .attr("id", "line_" + index)
                .attr("fill", "none")
                .attr("stroke-width", "2px");

            g.append("svg:line")
                .attr("x1", x(0))
                .attr("y1", y(0))
                // .attr("x2", x(w))
                .attr("x2", x(_N))
                .attr("y2", y(0))
                .attr("stroke", "#000000")
                .attr("id", "xAxis_" + index);

            g.append("svg:line")
                .attr("x1", x(0))
                .attr("y1", y(0))
                .attr("x2", x(0))
                // .attr("y2", y(max_data))
                .attr("y2", y(theMax))
                .attr("stroke", "#000000")
                .attr("id", "yAxis_" + index);

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
                // .attr("y2", y(max_data))
                .attr("y2", y(theMax))
                .attr("stroke", "#000000")
                .attr("stroke-width", "2px")
                .attr("banditIndex", index)
                .attr("class", "actualProbabilityLine");
            console.log(xArray);
        });
    }

    return <div></div>;
}
