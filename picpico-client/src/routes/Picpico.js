import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Header, Content, Footer } from "rsuite";
import LinkModal from "../components/Modal/LinkModal";
import Decoration from "./Decoration";
import Gallery from "./Gallery";
import Selection from "./Selection";
import PicBooth from "./PicBooth";
import MainController from "../controller/MainController";

// Button
import MuteBtn from "./../components/Btn/MuteBtn";
import PicDoneBtn from "../components/Btn/PicDoneBtn";
import TakePicBtn from "./../components/Btn/TakePicBtn";
import CameraTransBtn from "./../components/Btn/CameraTransBtn";
import SelectDoneBtn from "../components/Btn/SelectDoneBtn";
import DecoDoneBtn from "../components/Btn/DecoDoneBtn";
import PicDownloadBtn from "../components/Btn/PicDownloadBtn";
import GalleryDoneBtn from "../components/Btn/GalleryDoneBtn";

// Message
import DecoMessage from "../components/Message/DecoMessage";
import GalleryMessage from "../components/Message/GalleryMessage";
import SelectMessage from "../components/Message/SelectMessage";

// List
import MemberList from "../components/List/MemberList";

import "../style/style.css";
import "./Picpico.css";
import store from "../store";
import { setErrorInfo } from "../slice/errorInfo";

const Picpico = () => {
  const { id } = useParams();
  const picBoothDone = useSelector(state => state.picpicoInfo.picBoothDisplay);
  const selectDone = useSelector(state => state.picpicoInfo.selectionDisplay);
  const decoDone = useSelector(state => state.picpicoInfo.decoDisplay);
  const galleryDone = useSelector(state => state.picpicoInfo.galleryDisplay);
  const controller = MainController();
  const error = useSelector(state => state.errorInfo.error);

  useEffect(() => {
    controller.init(id);
  }, []);

  // useEffect(() => {
  //   if (error !== "") {
  //     alert(error);
  //     // store.dispatch(setErrorInfo(""))
  //   }
  // }, [error]);

  return (
    <>
      {picBoothDone ? (
        <Container className="default_container">
          <Header className="picbooth_header">
            <LinkModal />
            <h3 style={{ color: "#7986CB" }}>PicPico</h3>
            <PicDoneBtn controller={controller} />
          </Header>
          <Content>
            <PicBooth controller={controller} />
          </Content>
          <Footer className="picbooth_footer">
            <MuteBtn />
            <TakePicBtn controller={controller} />
            <CameraTransBtn />
          </Footer>
        </Container>
      ) : selectDone ? (
        <Container className="default_container">
          <Header className="selection_header">
            <SelectMessage />
          </Header>
          <Content>
            <Selection />
          </Content>
          <Footer className="selection_footer">
            <SelectDoneBtn />
          </Footer>
        </Container>
      ) : decoDone ? (
        <Container className="default_container">
          <Header className="deco_header">
            <DecoMessage />
          </Header>
          <Content>
            <MemberList />
            <Decoration controller={controller} />
          </Content>
          <Footer className="deco_footer">
            <DecoDoneBtn />
          </Footer>
        </Container>
      ) : galleryDone ? (
        <Container className="default_container">
          <Header className="gallery_header">
            <GalleryMessage />
          </Header>
          <Content>
            <Gallery />
          </Content>
          <Footer className="gallery_footer">
            <PicDownloadBtn />
            <GalleryDoneBtn />
          </Footer>
        </Container>
      ) : null}
    </>
  );
};
export default Picpico;
