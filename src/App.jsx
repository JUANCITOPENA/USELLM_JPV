import React from "react";
import useLLM from "usellm";
import { useState, ChangeEvent } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import "./App.css";

export default function Demo() {
  const llm = useLLM({ serviceUrl: "https://usellm.org/api/llm" });
  const [result, setResult] = useState("");
  const [inputValue, setInputValue] = useState("");

  async function handleClick() {
    try {
      await llm.chat({
        messages: [{ role: "user", content: inputValue }],
        stream: true,
        onStream: ({ message }) => setResult(message.content),
      });
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function formatResult() {
    const paragraphs = result.split("\\n");
    let formattedResult = [];

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];

      if (paragraph.startsWith("```")) {
        // Si es un bloque de código
        const code = paragraphs[i + 1];
        const language = paragraph.substring(3).trim();
        formattedResult.push(
          <SyntaxHighlighter
            key={i}
            language={language}
            style={{ ...darcula, backgroundColor: "lightgray" }}
          >
            {code}
          </SyntaxHighlighter>
        );

        // Saltar una línea adicional para separar bloques de código
        i++;
      } else {
        // Si es un párrafo de texto regular
        const formattedParagraph = paragraph.trim();
        if (formattedParagraph !== "") {
          formattedResult.push(<p key={i}>{formattedParagraph}</p>);
        }
      }
    }

    return formattedResult;
  }

  function handleInputKeyPress(event) {
    if (event.keyCode === 13 || event.which === 13) {
      event.preventDefault();
      handleClick();
    }
  }

  return (
    <div className="container">
      <h1 className="title">
        Probando UserLLM con Real, Modelo de Inteligencia Artificial
      </h1>
      <div className="input-container">
  <textarea
    value={inputValue}
    placeholder="Ingresa tu mensaje"
    onChange={handleInputChange}
    onKeyPress={handleInputKeyPress}
    style={{
      width: "85vw",
      minHeight: "100px",
      maxHeight: "200px",
      resize: "vertical",
      marginBottom: "10px",
      textAlign: "justify",   // Justificación de texto
      fontWeight: "bold",     // Negrita
      fontSize: "16px",       // Tamaño de fuente
         
    }}
  />
  <br />
  <button
    onClick={handleClick}
    style={{ marginTop: "10px", marginBottom: "10px" ,
    width: "200px",       // Ancho del botón
    fontSize: "24px",     // Tamaño de fuente del texto
    fontWeight: "bold",   // Negrita del texto
  }}
  >
    <img
      draggable="false"
      role="img"
      className="emoji"
      alt="✅"
      src="https://s.w.org/images/core/emoji/14.0.0/svg/2705.svg"
      style={{
        width: "32px",      // Ancho del icono
        height: "32px",     // Altura del icono
      }}
      />{" "}
    Enviar
  </button>
</div>

      <div
        className="response-container"
        style={{ overflow: "auto", width: "85vw", color: "#1B1464", backgroundColor: "#FFC312" }}
      >
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    </div>
  );
}
