import React from "react";
import CodeBlock from "../components/codeMath/codeBlock";
import MathBlock from "../components/codeMath/mathBlock";

class CodeMath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "python",
      code: `import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# Importing the dataset
dataset = pd.read_csv('Data.csv')
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, 3].values
`,
      mathEquations: [
        "E = mc^2",
        `ax^2+bx+c=0`,
        `(x-h)^2+k=0`
      ],
    };
  }

  componentDidMount() {
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data: data });
      });
  }

  render() {
    return (
      <div id="codemath">
        <div id="code-block">
          <h2>Code Block</h2>
          <CodeBlock code={this.state.code} language={this.state.language} />
        </div>

        <div id="math-block">
          <h2>Math Block</h2>
          <MathBlock math={this.state.mathEquations} />
        </div>
      </div>
    );
  }
}

export default CodeMath;
