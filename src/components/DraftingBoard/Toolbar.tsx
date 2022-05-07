import styled from "@emotion/styled";
import { Upload, Cable, Download, NearMe } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import Portal from "components/Portal";
import React, { ChangeEvent, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { createNodeModalState, modeState } from "state";
import RouterImg from "assets/images/router.png";

const Wrapper = styled(Paper)({
  position: "absolute",
  width: "50px",
  height: "500px",
  top: "100px",
  left: "30px",
  zIndex: 1000,
  cursor: "pointer",
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  justifyItems: "center",
});

const IconWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
});

type Props = {
  onClickDownload: () => void;
  onClickUpload: (uploadFile: File) => void;
};

const Toolbar: React.FC<Props> = ({ onClickDownload, onClickUpload }) => {
  const setMode = useSetRecoilState(modeState);
  const setCreateNodeModal = useSetRecoilState(createNodeModalState);
  const uploadBtnRef = useRef<HTMLInputElement | null>(null);
  const onClickUploadHandler = () => {
    uploadBtnRef.current?.click();
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files === null) return;
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      onClickUpload(file);
    }
  };
  return (
    <Portal>
      <Wrapper>
        <IconWrapper
          onClick={() => {
            setMode({ currentMode: "View" });
          }}
        >
          <NearMe
            style={{
              width: "30px",
              height: "30px",
              padding: "10px",
            }}
          />
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            setMode({ currentMode: "CreateLink" });
          }}
        >
          <Cable style={{ width: "30px", height: "30px", padding: "10px" }} />
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            setCreateNodeModal({ isOpen: true });
          }}
        >
          <img
            src={RouterImg}
            style={{ width: "30px", height: "30px", padding: "10px" }}
          />
        </IconWrapper>
        <IconWrapper onClick={onClickDownload}>
          <Download
            style={{ width: "30px", height: "30px", padding: "10px" }}
          />
        </IconWrapper>
        <IconWrapper onClick={onClickUploadHandler}>
          <Upload style={{ width: "30px", height: "30px", padding: "10px" }} />
          <input
            type="file"
            ref={uploadBtnRef}
            onChange={onChangeHandler}
            hidden
          />
        </IconWrapper>
      </Wrapper>
    </Portal>
  );
};

export default Toolbar;
