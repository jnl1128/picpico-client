import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "rsuite";
import Decoration from "./Decoration";
import Gallery from "./Gallery";
import Selection from "./Selection";
import PicBooth from "./PicBooth";
import MainController from "../controller/MainController";
import "../style/style.css";

const Picpico = () => {
  // const controller = WebrtcController();
  const { id } = useParams();
  const picBoothDone = useSelector(state => state.picpicoInfo.picBoothDisplay);
  const selectDone = useSelector(state => state.picpicoInfo.selectionDisplay);
  const decoDone = useSelector(state => state.picpicoInfo.decoDisplay);
  const galleryDone = useSelector(state => state.picpicoInfo.galleryDisplay);
  const controller = MainController();

  useEffect(() => {
    controller.init(id);
  }, []);

  return (
    <>
      <Container className="default_container">
        {picBoothDone ? (
          <PicBooth controller={controller} />
        ) : selectDone ? (
          <Selection controller={controller} />
        ) : decoDone ? (
          <Decoration controller={controller} />
        ) : galleryDone ? (
          <Gallery />
        ) : null}
      </Container>
    </>
  );
};
export default Picpico;
