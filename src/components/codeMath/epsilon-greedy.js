import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import React, { useEffect, useRef } from "react";
import LeaderLine from "react-leader-line";
import { useRecoilState, useRecoilValue } from "recoil";
import { allSettingsParam, armTagNames } from "../../state/atoms";

export const EpsilonGreedy = (props) => {
  const allSettingsParamValue = useRecoilValue(allSettingsParam);
  const [lines, setLines] = React.useState([]);
  const banditInfoValue = props.banditInfoValue;
  const armTagNamesValue = useRecoilValue(armTagNames);
  const [allInterimVals, setAllInterimVals] = React.useState({
    sampled_vals: [],
    max_sampled_val_idx: -1,
    curr_reward: -1,
    cur_tag_idx: 1,
    cur_tag: "cat",
  });

  const [startDemo, setStartDemo] = React.useState(false);

  async function showLine(line) {
    line.show("draw", {
      duration: Math.random() * 500 + 3000,
      timing: "ease-in-out",
    });
  }

  //   useEffect(() => {
  //     if (
  //       !banditInfoValue ||
  //       !banditInfoValue.code_math ||
  //       !banditInfoValue.code_math.exploration_threshold
  //     )
  //       return;

  //     let sampled_vals = banditInfoValue.code_math.sampled_vals;
  //     let max_sampled_val_idx = getMaxSampledVal(
  //       banditInfoValue.code_math.sampled_vals
  //     );

  //     setAllInterimVals({
  //       sampled_vals: sampled_vals.map((val) => val.toFixed(2)),
  //       max_sampled_val_idx: getMaxSampledVal(sampled_vals),
  //       curr_reward: getReward(max_sampled_val_idx),
  //       cur_tag_idx: banditInfoValue.cur_arm,
  //       cur_tag: armTagNamesValue[banditInfoValue.cur_arm],
  //     });

  //     console.log("allInterimVals: ", allInterimVals);
  //   }, [banditInfoValue]);

  const getReward = (i) => {
    const p = Math.random();
    const tagName = armTagNamesValue[i];
    const pobab = allSettingsParamValue.targetProbability[tagName];
    console.log("pobab: ", pobab);
    if (p < pobab) {
      return 1;
    }
    return 0;
  };

  const getMaxSampledVal = (vals) => {
    // i = max(range(self.bandit.n), key=lambda x: samples[x])
    let maxVal = -1;
    let maxIdx = -1;
    vals.forEach((val, idx) => {
      if (val > maxVal) {
        maxVal = val;
        maxIdx = idx;
      }
    });
    return maxIdx.toString();
  };

  //   useEffect(() => {
  //     if (startDemo) {
  //       let all_lines = [];
  //       const Line1 = drawLine("init", "run_steps", "", "#ebbabf", "#ebbabf");
  //       const Line2 = drawLine("run_steps", "step1", "", "#ebbabf", "#bce7cb");
  //       const Line3 = drawLine(
  //         "step1",
  //         "estimated_probas",
  //         "",
  //         "#bce7cb",
  //         "#ebbabf"
  //       );
  //       const Line4 = drawLine(
  //         "estimated_probas",
  //         "step2",
  //         (allInterimVals.sampled_vals || []).join(", "),
  //         "#bce7cb",
  //         "#bce7cb"
  //       );
  //       const Line5 = drawLine(
  //         "step2",
  //         "step3",
  //         `max_idx: ${allInterimVals.max_sampled_val_idx}`,
  //         "#bce7cb",
  //         "#bce7cb"
  //       );
  //       const Line6 = drawLine(
  //         "step3",
  //         "generate_reward",
  //         `max_idx: ${allInterimVals.max_sampled_val_idx}`,
  //         "#bce7cb",
  //         "#ebbabf"
  //       );
  //       const Line7 = drawLine(
  //         "generate_reward",
  //         "step4",
  //         `reward: ${allInterimVals.curr_reward}`,
  //         "#ebbabf",
  //         "#bce7cb",
  //         "top"
  //       );
  //       const Line8 = drawLine(
  //         "step4",
  //         "social-media-app",
  //         allInterimVals.cur_tag.toString(),
  //         "#bce7cb",
  //         "",
  //         "bottom"
  //       );

  //       all_lines.push(
  //         ...[Line1, Line2, Line3, Line4, Line5, Line6, Line7, Line8]
  //       );
  //       setLines(all_lines);

  //       // showline1 -> line2... -> line5 after timeout
  //       for (let i = 0; i < all_lines.length; i++) {
  //         setTimeout(() => {
  //           showLine(all_lines[i]);
  //         }, (Math.random() * 500 + 3000) * i);
  //       }
  //     } else {
  //       lines.forEach((line) => {
  //         line.remove();
  //       });
  //       setLines([]);
  //     }
  //   }, [startDemo]);

  // destroy all lines when exit
  //   useEffect(() => {
  //     return () => {
  //       lines.forEach((line) => {
  //         line.remove();
  //       });
  //     };
  //   }, []);

  const drawLine = (
    start,
    end,
    value,
    startColor,
    endColor,
    position = "right"
  ) => {
    const startElement = document.getElementById(start);
    const endElement = document.getElementById(end);
    const line = new LeaderLine(
      LeaderLine.areaAnchor(startElement, { color: startColor, radius: 8 }),
      LeaderLine.areaAnchor(endElement, { color: endColor, radius: 8 }),
      {
        startPlug: "disc",
        startSocket:
          position === "bottom" ? "left" : position === "top" ? "top" : "right",
        endSocket: position === "top" ? "bottom" : position,
        path: "grid",
        startPlugColor: startColor,
        endPlugColor: endColor,
        gradient: true,
        size: 2,
        dash: { animation: true },
        middleLabel: LeaderLine.captionLabel(value, {
          size: 0.6,
          color: "#000",
        }),
        hide: true,
      }
    );
    return line;
  };

  return (
    <div>
      <fieldset className="code-Class">
        <legend className="codeType">class</legend>
        <p className="code-Class-Name">
          EpsilonGreedy(Solver)
          <IconButton
            // onClick={() => setStartDemo(!startDemo)}
            size="small"
            style={{ float: "right" }}
            color="success"
          >
            {startDemo ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </p>
        <p className="code-Method-Explain">
          <span className="code-Method-Name" id="init">
            __init__:{" "}
            <span className="code-Method-Args">
              (self, bandit, eps, init_proba=1.0)
            </span>
          </span>
          Initialize optimistic initialization and epsilon
        </p>
        <code className="code-Step-Code">
          self.eps = eps
          <br />
          self.estimates = [init_proba] * self.bandit.n
        </code>
        <fieldset className="code-Method">
          <legend className="codeType">fucntion</legend>
          <p className="code-Method-Name-1" id="estimated_probas">
            estimated_probas
            <span className="code-Method-Args">(self)</span>
          </p>
          <p className="code-Method-Explain">
            return the estimated probability
          </p>
          <code className="code-Step-Code">return self.estimates</code>
        </fieldset>
        <fieldset className="code-Method">
          <legend className="codeType">fucntion</legend>
          <p className="code-Method-Name-2" id="run_steps">
            run_steps
            <span className="code-Method-Args">(self)</span>
          </p>
          <fieldset className="code-Step" id="step1">
            <legend className="codeType">if random smaller than eps</legend>
            <p className="code-Method-Explain">
                Pick a random arm (exploration)
            </p>
            <code className="code-Step-Code">
                i = np.random.randint(0, self.bandit.n)
            </code>
          </fieldset>
          <fieldset className="code-Step" id="step2">
            <legend className="codeType">else</legend>
            <p className="code-Method-Explain">
              Pick the best arm (exploitation)
            </p>
            <code className="code-Step-Code">
                i = max(range(self.bandit.n), key=lambda x: self.estimates[x])
            </code>
          </fieldset>
          <fieldset className="code-Step" id="step3">
            <legend className="codeType">Generate Rewards</legend>
            <p className="code-Method-Explain">
              generate reward for the selected arm
            </p>
            <code className="code-Step-Code">
              r = self.bandit.generate_reward(i)
            </code>
          </fieldset>
          <fieldset className="code-Step" id="step4">
            <legend className="codeType">step 4</legend>
            <p className="code-Method-Explain">
              update estimtes
            </p>
            <code className="code-Step-Code">
                self.estimates[i] += 1. / (self.counts[i] + 1) * (r - self.estimates[i])
            </code>
          </fieldset>
        </fieldset>
      </fieldset>
      <fieldset className="code-Class">
        <legend className="codeType">class</legend>
        <p className="code-Class-Name">BernoulliBandit(Bandit)</p>
        <fieldset className="code-Method">
          <legend className="codeType">fucntion</legend>
          <p className="code-Method-Name-1" id="generate_reward">
            generate_reward
            <span className="code-Method-Args">(self, i)</span>
          </p>
          <p className="code-Method-Explain">
            generate reward ([1, 0]) for the selected arm
          </p>
        </fieldset>
      </fieldset>
    </div>
  );
};

export default EpsilonGreedy;
