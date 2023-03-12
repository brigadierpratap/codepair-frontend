import React, { useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useParams } from "react-router-dom";
import { get } from "../api/methods";

var client = null;

const Room = () => {
  const params = useParams();
  const [value, setValue] = React.useState("");
  const [language, setLanguage] = React.useState("javascript");

  const [loading, setLoading] = React.useState(false);

  const sendMessage = (e) => {
    console.log(e);
    if (client) {
      client.send(
        `/app/message`,
        {},
        JSON.stringify({
          sendToTopic: params.id,
          message: e,
          language: language,
        })
      );
    }
  };

  const handleChange = (e) => {
    setValue(e);
    //should we use debounce here?
    sendMessage(e);
  };

  const onConnected = () => {
    setLoading(false);
    console.log(params);
    client.subscribe(`/room/${params.id}/receive`, (message) => {
      const data = JSON.parse(message.body);
      setValue(data.message);
      setLanguage(data.language);
    });
  };

  const onError = () => {};

  const registerRoom = async () => {
    const Sock = SockJS("http://localhost:8080/ws");
    client = over(Sock);
    await client.connect({}, onConnected, onError);
  };
  const getRoomDetails = async () => {
    try {
      let response = await get(`room/${params.id}`);
      if (response.success) {
        setValue(response.data.code);
        setLanguage(response.data.language);
        await registerRoom();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    getRoomDetails();
  }, []);

  return (
    <Container>
      <div className="row">
        <div className="col">
          <span>Choose Language</span>
          <select
            className="form-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="kotlin">Kotlin</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="rust">Rust</option>
            <option value="scala">Scala</option>
          </select>
        </div>
      </div>
      <Editor
        height="95vh"
        defaultLanguage={"javascript"}
        language={language}
        defaultValue="// some comment"
        theme="vs-dark"
        value={value}
        onChange={handleChange}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgb(30 30 30);
  color: #fff;
  display: flex;
  flex-direction: column;
  .row {
    height: 5vh;
    display: flex;
    align-items: center;
    padding-right: 1em;
    margin-left: auto;
    .col {
      display: flex;
      align-items: center;
      gap: 1em;
    }
  }
`;

export default Room;
