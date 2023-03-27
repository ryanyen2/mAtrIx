import React from "react";
import { useState, useEffect } from "react";
// import * as d3 from "d3";

export default function AlgGraph(props) {
    const [trueRewards, setTrueRewards] = useState([0.4, 0.5, 0.6, 0.7]);
    const numArms = 4;
    const theBandits = [
      {
        currentDistributionParameters: {
          alpha: .4,
          alpha: .5,
        }
    }
    ];

    var unselectIt = function () {
        d3.selectAll(".actualProbabilityLine").classed("lineActive", false);
        that.currentLineSelected = null;
    };

    theBandits.forEach(function (b, index) {
        var theId = "graph_" + index;
        var w = that.defaultWidth; //400;
        var h = that.defaultHeight; //100;
        var margin = 15; //15;

        var vis = d3
            .select("#" + theId)
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            // .on("ignoremouseout", unselectIt)
            // .on("mouseup", unselectIt)
            // .on("mousemove", function () {
            //     if (that.currentLineSelected) {
            //         //console.log(d3.mouse(this));

            //         //.attr("x1", margin + (w-2*margin)*b.CurrentActualProbability)
            //         //map mouse x to place on axis
            //         var theX = d3.mouse(this)[0];

            //         var val; // = (theX-margin)/that.defaultWidth;
            //         if (theX <= margin) {
            //             val = 0;
            //         } else if (theX > that.defaultWidth - margin) {
            //             val = 1;
            //         } else {
            //             val =
            //                 (theX - margin) / (that.defaultWidth - 2 * margin);
            //         }

            //         val = val.toFixed(2);
            //         //map val back to X
            //         theX = margin + val * (that.defaultWidth - 2 * margin);
            //         var banditIndex =
            //             that.currentLineSelected.attr("banditIndex");
            //         //tell things that we need to change this...
            //         caller.updateBanditActualProbability(banditIndex, val);

            //         that.currentLineSelected.attr("x1", theX);
            //         that.currentLineSelected.attr("x2", theX);
            //     }
            // });

        var g = vis.append("svg:g").attr("id", "theGraph_" + index);

        var alpha = b.currentDistributionParameters.alpha;
        var beta = b.currentDistributionParameters.beta;

        var theMax = -1;
        var _data = x_array.map(function (x) {
            var y = jStat.beta.pdf(x, alpha, beta);
            theMax = Math.max(y, theMax);
            return y;
            //console.log(x + ", " + jStat.beta.pdf(x,alpha,beta));
            //            return jStat.beta.pdf(x,alpha,beta);
        });

        (y = d3.scale
            .linear()
            .domain([0, max_data])
            .range([h - margin, 0 + margin])),
            (x = d3.scale
                .linear()
                .domain([0, _N])
                .range([0 + margin, w - margin]));

        var line = d3.svg
            .line()
            .x(function (d, i) {
                return x(i);
            })
            .y(y);

        //console.log(_data);
        g.selectAll("path.line")
            .data([_data])
            .enter()
            .append("svg:path")
            .attr("stroke", "#0000FF")
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

        //console.log(_N*b.CurrentActualProbability);
        g.append("svg:line")
            .attr("id", "actualProb_" + index)
            .attr("x1", margin + (w - 2 * margin) * b.CurrentActualProbability)
            .attr("y1", y(0))
            .attr("x2", margin + (w - 2 * margin) * b.CurrentActualProbability)
            .attr("y2", y(max_data))
            .attr("stroke", "#000000")
            .attr("stroke-width", "2px")
            .attr("banditIndex", index)
            .attr("class", "actualProbabilityLine")
            .attr(
                "titleIgnore",
                "This is the current actual probability of success for this bandit.  If it is lower than that of the other bandits, then the bandit may be tried rarely; if it changes later to a high value, it may take a while for the bandit to be tried again so that the algorithm can start learning that it has become better."
            )
            .on("mouseover", function () {
                d3.select(this).classed("lineActive", true);
            })
            .on("mousedown", function () {
                //d3.select(this).classed("lineSelected",true);
                that.currentLineSelected = d3.select(this);
                //var theThing = d3.select(this);
                //console.log(d3.select(this));
            })
            .on("mouseout", function () {
                if (!that.currentLineSelected) {
                    d3.select(this).classed("lineActive", false);
                }
            });

        // .on("mousemove",function() {
        // //d3.select(this).classed("lineSelected",false);
        // })

        // var drag = d3.behavior.drag()
        // .on("drag", function(d,i) {
        // d.x += d3.event.dx;
        // d.y += d3.event.dy;
        // var thing = d3.select(this);
        // if (thing.classed("lineSelected")) {
        //
        // console.log(thing);
        //
        // thing.attr("transform", function(d,i){
        // return "translate(" + [ d.x,d.y ] + ")"
        // })
        // }
        // });

        g.selectAll(".xLabel")
            .data(d3.range(0, 1.2, 0.1))
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

        // vis.append("text")
        // .attr("x", (w / 2))
        // .attr("y", 15 )
        // .attr("text-anchor", "middle")
        // .style("font-size", "17px")
        // .text("Posterior Distributions");

        that.theVis[index] = vis;
    });

    useEffect(() => {
        console.log("Current algorithm changed: " + currentAlgorithm);

        fetch("/api/updateModelId", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(currentAlgorithm),
        })
            .then((response) => response.json())
            .catch((error) => console.log(error));

        if (currentAlgorithm === 0) {
            console.log("Setting parameters for epsilon greedy");

            setParameterHtml(
                <form onSubmit={handleSubmitModelParameters}>
                    <label htmlFor="epsilon">Epsilon value here:</label>
                    <input
                        type="number"
                        id="epsilon"
                        name="epsilon"
                        min="0.0001"
                        max="1"
                    ></input>
                    <button type="submit">Submit</button>
                </form>
            );
        } else if (currentAlgorithm === 1) {
            // UCB
            console.log("Setting parameters for UCB");
            setParameterHtml(<div></div>);
        } else if (currentAlgorithm === 2) {
            // Beta TS
            console.log("Setting parameters for Beta TS");
            setParameterHtml(<div></div>);
        } else if (currentAlgorithm === 3) {
            // Gaussian TS
            console.log("Setting parameters for Gaussian TS");
            setParameterHtml(<div></div>);
        } else {
            console.error(
                "Sorry, no model linked to index " + currentAlgorithm
            );
        }
    }, [currentAlgorithm]);

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
        <div style={{ color: "black" }}>
            <div id="graph_0"></div>
            <div id="graph_1"></div>
            <div id="graph_2"></div>
            <div id="graph_3"></div>
        </div>
    );
}
