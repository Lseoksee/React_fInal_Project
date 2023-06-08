import { useState } from "react";
import "./App.css";
import { Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Utils from "../src/Utils";

let reforder = "/";

function Mainpage(params) {
  return (
    <div id="maindiv">
      <h1 id="title">친구들과 빠르게 파일을 공유해보세요!</h1>
      <Button id="checkbt" onClick={params.btEV}>
        파일 확인하러가기
      </Button>
    </div>
  );
}

function Filelist(params) {
  const [value, copyState] = useState();
  const regex = /\.[^.\\/]*$/;
  const list = [];
  let icon;

  if (reforder !== "/") {
    list.push(
      <tr
        onClick={(e) => {
          reforder = reforder.replace(/\/([^/]+)\/$/, "/");
          params.btEV(e, reforder);
        }}
      >
        <td>
          <img
            src={`${process.env.PUBLIC_URL}/enter.png`}
            alt={"enter.png"}
            width={"32px"}
          ></img>
        </td>
        <td>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
            }}
            style={{color: "black"}}
          >
            이전으로
          </a>
        </td>
        <td></td>
      </tr>
    );
  }

  params.value.forEach((e) => {
    if (Utils.isvideo(e)) {
      icon = "video.png";
    } else if (Utils.isaudio(e)) {
      icon = "music.png";
    } else if (Utils.isphoto(e)) {
      icon = "img.png";
    } else if (!regex.test(e)) {
      icon = "logo512.png";
    } else {
      icon = "doc.png";
    }

    list.push(
      <tr>
        <td>
          <img
            src={`${process.env.PUBLIC_URL}/${icon}`}
            alt={icon}
            width={"32px"}
          ></img>
        </td>
        <td
          onClick={(ex) => {
            if (regex.test(e)) {
              window.location.href = "download" + reforder + e;
            } else {
              reforder += e + "/";
              params.btEV(ex, reforder);
            }
          }}
          style={{fontSize: "18px"}}
        >
          {regex.test(e) ? (
            <a href={"download" + reforder + e}>{e}</a>
          ) : (
            <a
              href={reforder + e}
              onClick={(ex) => {
                ex.preventDefault();
              }}
            >
              {e}
            </a>
          )}
        </td>
        {regex.test(e) ? (
          <td>
            <Button
              variant="outline-warning"
              onClick={async () => {
                try {
                  let url = window.document.location.href;
                  if (navigator.clipboard) {
                    //http 프로토콜로 인한 복사 오류
                    await navigator.clipboard.writeText(url + "download/" + e);
                    alert("주소를 복사했습니다!");
                  } else {
                    alert(url + "download/" + e);
                  }
                  copyState(e);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              {e === value ? "복사됨!" : "공유하기"}
            </Button>
          </td>
        ) : (
          <td></td>
        )}
      </tr>
    );
  });

  return (
    <div id="filelist">
      <div id="tablediv">
        <Table
          id="filetable"
          striped
          bordered
          hover
          size="sm"
          style={{ margin: "0", whiteSpace: "nowrap" }}
        >
          <colgroup>
            <col width="10%" />
            <col width="70%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th>파일 유형</th>
              <th>이름</th>
              <th>공유하기</th>
            </tr>
          </thead>
          <tbody>{list}</tbody>
        </Table>
      </div>
      <Button
        onClick={(e) => {
          reforder = "/";
          params.btEV(e);
        }}
      >
        갱신하기
      </Button>
    </div>
  );
}

function App() {
  const [value, setState] = useState();
  let res;

  const getfile = async (e, link) => {
    let response1;

    if (link) {
      response1 = await fetch("/getfile" + link);
    } else {
      response1 = await fetch("/getfile");
    }

    const result1 = await response1.json();
    setState(result1);
  };

  if (value) {
    res = <Filelist value={value} btEV={getfile}></Filelist>;
  } else {
    res = <Mainpage btEV={getfile}></Mainpage>;
  }

  return <div id="home">{res}</div>;
}

export default App;
