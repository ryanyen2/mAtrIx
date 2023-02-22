import Editor from "@monaco-editor/react";
import React, { useRef } from "react";
import Button from "@mui/material/Button";

class CodeBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.language,
      code: props.code,
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
        const lineDom = document.getElementsByClassName(
          `view-line`
        )[i - 1];
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
    }
    , 1000);
  };

  render() {
    return (
      <div>
        <Button
          variant="contained"
          onClick={() => this.handleHighlightLine("import seaborn as sns")}
        >
          Highlight Line
        </Button>
        <span style={{ fontSize: "1rem", fontStyle: 'italic', marginLeft: '10px' }}> import seaborn as sns</span>
        <Editor
          onMount={(editor, monaco) => {
            this.editorRef.current = editor;
            this.monacoRef.current = monaco;
          }}
          height="30vh"
          defaultLanguage={this.state.language}
          defaultValue={this.state.code}
          theme="vs-dark"
        />
      </div>
    );
  }
}

export default CodeBlock;
