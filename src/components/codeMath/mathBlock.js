import { MathComponent } from "mathjax-react";
import React from "react";
import Button from "@mui/material/Button";

class MathBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mathEquations: this.props.math,
      mathEquationsDom: [],
    };

    this.mathRef = React.createRef();
  }

  highlightMathEquation = (text) => {
    // highlight the line of the code the same as the text
    text = text.trim();
    const math = this.mathRef.current;
    const mathEquations = this.state.mathEquations;
    let mathContent = "";
    let mathEquationDom = null;

    for (let i = 0; i < mathEquations.length; i++) {
      mathContent = mathEquations[i].trim();
      if (mathContent === text) {
        console.log("found line: ", i);
        mathEquationDom = document.getElementById(`math-equation-${i}`);
        mathEquationDom.style.background = "brown";
        mathEquationDom.style.borderRadius = "5rem";
        mathEquationDom.style.transition = "all 1s";
        break;
      }
    }

    // remove highlight after 2 seconds with fade out effect
    setTimeout(() => {
      mathEquationDom.style.background = "transparent";
      mathEquationDom.style.borderRadius = "0";

      mathEquationDom.style.transition = "all 1s";
    }, 1000);
  };

  render() {
    return (
      <div>
        <Button
          variant="contained"
          onClick={() => this.highlightMathEquation(`E = mc^2`)}
        >
          Highlight First Math Equation
        </Button>
        <div>
          {this.state.mathEquations.map((equation, index) => (
            <div id={`math-equation-${index}`} key={index}>
              <MathComponent tex={String.raw`${equation}`}/>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MathBlock;
