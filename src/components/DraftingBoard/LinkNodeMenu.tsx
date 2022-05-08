import React, { useMemo, useState } from "react";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import { Vector2d } from "konva/lib/types";
import { useResetRecoilState } from "recoil";
import { linkNodeMenuState } from "state";
import DeleteLinkDialog from "./DeleteLinkDialog";

type Props = {
  pos: Vector2d;
  onClickRemoveLink: () => void;
};

const LinkNodeMenu: React.FC<Props> = ({ pos, onClickRemoveLink }) => {
  const [isOpenDeleteLinkDialog, setIsOpenDeleteLinkDialog] = useState(false);
  const closeMenu = useResetRecoilState(linkNodeMenuState);
  const onClickDeleteLinkMenu = () => {
    setIsOpenDeleteLinkDialog(true);
  };
  const renderDeleteLinkDialog = useMemo(() => {
    return (
      <DeleteLinkDialog
        isOpen={isOpenDeleteLinkDialog}
        onDeleteLink={() => {
          onClickRemoveLink();
          setIsOpenDeleteLinkDialog(false);
        }}
        onCancel={() => {
          setIsOpenDeleteLinkDialog(false);
          closeMenu();
        }}
      />
    );
  }, [isOpenDeleteLinkDialog]);
  return (
    <Box component={"div"} onMouseLeave={() => closeMenu()}>
      <Paper sx={{ width: 320, position: "absolute", left: pos.x, top: pos.y }}>
        <MenuList dense>
          <MenuItem onClick={onClickDeleteLinkMenu}>Delete Link</MenuItem>
        </MenuList>
      </Paper>
      {renderDeleteLinkDialog}
    </Box>
  );
};

export default LinkNodeMenu;
