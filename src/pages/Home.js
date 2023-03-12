import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { post } from "../api/methods";

const Home = () => {
  const navigate = useNavigate();
  const createRoom = async () => {
    console.log("create room");
    try {
      const response = await post("room", {});
      if (response.success) {
        console.log(response.data);
        navigate(`/room/${response.data.id}`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container>
      <button onClick={createRoom}>Create a Room</button>
    </Container>
  );
};

export const Container = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgb(30 30 30);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Home;
