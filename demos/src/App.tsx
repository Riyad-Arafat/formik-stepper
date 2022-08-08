import "./App.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark as dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { BasicFormCode, BasicForm } from "./Components/BasicForm";
import { MultiStep, MultiStepFormCode } from "./Components/MultiStep";

import { useState } from "react";

import "formik-stepper/dist/style.css";

function App() {
  const [form, setform] = useState("basic");
  return (
    <>
      <header>
        <button
          className={`card ${form === "basic" ? "active" : ""}`}
          onClick={() => setform("basic")}
        >
          Besic Form
        </button>
        <button
          className={`card ${form === "multi" ? "active" : ""}`}
          onClick={() => setform("multi")}
        >
          Multi Step
        </button>
      </header>
      <main>
        {form === "basic" && (
          <>
            <div className="view">
              <BasicForm />
            </div>

            <div className="code">
              <SyntaxHighlighter language="javascript" style={dark}>
                {BasicFormCode}
              </SyntaxHighlighter>
            </div>
          </>
        )}

        {form === "multi" && (
          <>
            <div className="view">
              <MultiStep />
            </div>

            <div className="code">
              <SyntaxHighlighter language="javascript" style={dark}>
                {MultiStepFormCode}
              </SyntaxHighlighter>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default App;
