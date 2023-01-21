import { useSelector } from "react-redux";
import { FlexboxGrid } from "rsuite";
import store from "../../store";

const MemberList = () => {
    // const myImg = useSelector(state => state.decoInfo.myDecoCanvas);
    const members = useSelector(state => state.membersInfo.members);
    const picBoothDisplay = useSelector(state => state.picpicoInfo.setPicBoothInfo);
    let myOrder;
    console.log("picBoothDisplay", picBoothDisplay);

    const memberKeys = Object.keys(members);

    const decoDisplay = useSelector(state => state.picpicoInfo.decoDisplay);
    console.log("decodis:", decoDisplay);

    const decos = useSelector(state => state.decoInfo.decoList);
    const decoKeys = Object.keys(decos);
    console.log("obj:", decos);
    console.log("decoKeys", decoKeys);
    const decoColors = useSelector(state => state.decoInfo.colorList);
    const decoMapping = {};
    for (let i = 0; i < 4; i++) {
        decoMapping[decoKeys[i]] = decoColors[i];
    }

    return (
        <div>
            {decoDisplay ? (
                <FlexboxGrid justify="center">
                    <ul style={{ color: "black", textAlign: "center", listStyle: "none", paddingLeft: 0 }}>
                        {decoKeys.map(idx => decos[idx]["viewers"].map(obj => <li style={{ float: "left", color: decoMapping[idx] }}>{obj["nickName"]}</li>))}
                    </ul>
                </FlexboxGrid>
            ) : (
                <FlexboxGrid justify="center">
                    <ul style={{ color: "black", textAlign: "center", listStyle: "none", paddingLeft: 0 }}>
                        {memberKeys.map(idx => (
                            <li style={{ float: "left" }}>{members[idx]["nickName"]}</li>
                        ))}
                    </ul>
                </FlexboxGrid>
            )}
        </div>
    );
};

export default MemberList;
