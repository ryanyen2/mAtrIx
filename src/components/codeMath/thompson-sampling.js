import React, { useEffect, useRef } from "react";
import LeaderLine from "react-leader-line";
import { useRecoilState } from "recoil";
import { currentStep } from "../../state/atoms";

export const ThompsonSampling = () => {
  const [step, setStep] = useRecoilState(currentStep);
  const [lines, setLines] = React.useState([]);

  async function showLine(line) {
    line.show("draw", { duration: Math.random() * 500 + 2000, timing: "ease-in-out" });
  }

  useEffect(() => {
    if (step.startCodeFlow) {
      let all_lines = [];
      const Line1 = drawLine("init", "run_steps", '10', "#ebbabf", "#ebbabf");
      const Line2 = drawLine("run_steps", "step1", '[10, 20]', "#ebbabf", "#bce7cb");
      const Line3 = drawLine("step1", "step2", '[10, 20]', "#bce7cb", "#bce7cb");
      const Line4 = drawLine("step2", "step3", '[10, 20]', "#bce7cb", "#bce7cb");
      const Line5 = drawLine("step3", "step4", '3', "#bce7cb", "#bce7cb");
      const Line6 = drawLine("step4", "social-media-app", 'Dog', "#bce7cb", "", 'bottom')

      all_lines.push(...[Line1, Line2, Line3, Line4, Line5, Line6]);
      setLines(all_lines);

      // showline1 -> line2... -> line5 after timeout
      for (let i = 0; i < all_lines.length; i++) {
        setTimeout(() => {
          showLine(all_lines[i]);
        }, ((Math.random() * 500 + 2000) * i));
      }
    } else {
      lines.forEach((line) => {
        line.remove();
      });
      setLines([]);
    }
  }, [step.startCodeFlow]);

  // destroy all lines when exit
  useEffect(() => {
    return () => {
      lines.forEach((line) => {
        line.remove();
      });
    };
  }, []);

  const drawLine = (start, end, value, startColor, endColor, position="right") => {
    const startElement = document.getElementById(start);
    const endElement = document.getElementById(end);
    const line = new LeaderLine(
      LeaderLine.areaAnchor(startElement, {color: startColor, radius: 8}),
      LeaderLine.areaAnchor(endElement, {color: endColor, radius: 8}),
      {
        startPlug: "disc",
        startSocket: position==="bottom" ? "left" : "right",
        endSocket: position,
        path: "grid",
        startPlugColor: startColor,
        endPlugColor: endColor,
        gradient: true,
        size: 2,
        dash: { animation: true },
        middleLabel: LeaderLine.captionLabel(value, {
          size: 0.6,
          color: '#000'
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
        <p className="code-Class-Name">ThompsonSampling(Solver)</p>
        <p className="code-Method-Explain">
          <span className="code-Method-Name" id="init">
            __init__:{" "}
          </span>
          initialize Beta distribution parameters
        </p>
        <fieldset className="code-Method">
          <legend className="codeType">fucntion</legend>
          <p className="code-Method-Name-1" id="estimated_probas">
            estimated_probas
            <span className="code-Method-Args">(self)</span>
          </p>
          <p className="code-Method-Explain">
            return the estimated probability of each arm
          </p>
        </fieldset>
        <fieldset className="code-Method">
          <legend className="codeType">fucntion</legend>
          <p className="code-Method-Name-2" id="run_steps">
            run_steps
            <span className="code-Method-Args">(self)</span>
          </p>
          <fieldset className="code-Step" id="step1">
            <legend className="codeType">step 1</legend>
            <p className="code-Method-Explain">
              sample from Beta distribution for each arm
            </p>
            <code className="code-Step-Code">
              sample = [np.random.beta(self._as[x], self._bs[x]) for x in
              range(self.bandit.n)]
            </code>
          </fieldset>
          <fieldset className="code-Step" id="step2">
            <legend className="codeType">step 2</legend>
            <p className="code-Method-Explain">
              select the arm with the highest sample
            </p>
            <code className="code-Step-Code">
              i = max(range(self.bandit.n), key=lambda x: samples[x])
            </code>
          </fieldset>
          <fieldset className="code-Step" id="step3">
            <legend className="codeType">step 3</legend>
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
              update Beta distribution parameters
            </p>
            <code className="code-Step-Code">
              self._as[i] += r
              <br />
              self._bs[i] += (1 - r)
            </code>
          </fieldset>
        </fieldset>
      </fieldset>
    </div>
  );
};

export default ThompsonSampling;
