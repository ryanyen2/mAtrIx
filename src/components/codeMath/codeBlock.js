import Editor from "@monaco-editor/react";
import React from "react";
import Button from "@mui/material/Button";

class CodeBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "python",
      algorithm: props.algorithm,
      code: `class ThompsonSampling(Solver):
      def __init__(self, bandit, init_a=1, init_b=1):
          """
          init_a (int): initial value of a in Beta(a, b).
          init_b (int): initial value of b in Beta(a, b).
          """
          super(ThompsonSampling, self).__init__(bandit)
  
          self._as = [init_a] * self.bandit.n
          self._bs = [init_b] * self.bandit.n
  
      @property
      def estimated_probas(self):
          return [self._as[i] / (self._as[i] + self._bs[i]) for i in range(self.bandit.n)]
  
      def run_one_step(self):
          samples = [np.random.beta(self._as[x], self._bs[x]) for x in range(self.bandit.n)]
          i = max(range(self.bandit.n), key=lambda x: samples[x])
          r = self.bandit.generate_reward(i)
  
          self._as[i] += r
          self._bs[i] += (1 - r)
  
          return i`
    };

    this.editorRef = React.createRef();
    this.monacoRef = React.createRef();
  }

  handleHighlightLine = (text) => {
    // highlight the line of the code the same as the text
    text = text.trim();
    const editor = this.editorRef.current;
    const model = editor.getModel();
    const lineCount = model.getLineCount();
    let lineContent = "";
    let sameTextLine = -1;

    for (let i = 1; i < lineCount; i++) {
      lineContent = model.getLineContent(i).trim();
      if (lineContent === text) {
        console.log("found line: ", i);
        sameTextLine = i;
        editor.revealLineInCenter(i);
        // highlight the line with background color with transition effect
        const lineDom = document.getElementsByClassName(`view-line`)[i - 1];
        lineDom.style.background = "brown";
        lineDom.style.borderRadius = "5rem";
        lineDom.style.transition = "all .5s";
        lineDom.classList.add("myHighlightCode");

        editor.setPosition({ lineNumber: i, column: 1 });
        editor.focus();
        // editor.setSelection({ startLineNumber: i, startColumn: 1, endLineNumber: i+1, endColumn: 1 });
        break;
      }
    }

    // remove highlight after 1 second with fade out effect
    setTimeout(() => {
      const highlightCode = document.getElementsByClassName("myHighlightCode");
      for (let i = 0; i < highlightCode.length; i++) {
        highlightCode[i].style.transition = "all 1s";
        highlightCode[i].style.background = "transparent";
        highlightCode[i].style.borderRadius = "0";
        highlightCode[i].classList.remove("myHighlightCode");
      }
    }, 1000);
  };

  render() {
    return (
      <div>
        <Editor
          onMount={(editor, monaco) => {
            this.editorRef.current = editor;
            this.monacoRef.current = monaco;
          }}
          height="70vh"
          defaultLanguage={this.state.language}
          defaultValue={this.state.code}
          theme="atom"
            options={{ 
                minimap: { enabled: false },
                lineNumbers: "off",
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                folding: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                wordWrap: "off",
            }}
        />
      </div>
    );
  }
}

export default CodeBlock;
