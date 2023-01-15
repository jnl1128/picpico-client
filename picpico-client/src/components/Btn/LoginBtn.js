import React from "react";
import axios from "axios";
import { API } from "../../config";
import { useNavigate } from "react-router-dom";
import { Button } from "rsuite";

function LoginBtn() {
  const navigate = useNavigate();
  function onKakaoLogin() {
    axios
      .get(API.KAKAOLOGIN)
      .then(res => {
        console.log(res);
        // let jwtToken = res.headers.get("Authorization");
        // localStorage.setItem("Authorization", jwtToken);
        // return res.json();
      })
      .catch(err => {
        alert("로그인에 실패하였습니다.");
      });
  }
  return (
    // <div style={{ margin: "10px" }}>
    <Button
      block
      className="yellow_btn"
      onClick={onKakaoLogin}
      color="yellow"
      appearance="primary"
      style={{ color: "black", padding: "10px 70px", margin: "10px" }}
    >
      카카오 로그인
    </Button>
    // </div>
  );
}

export default LoginBtn;
