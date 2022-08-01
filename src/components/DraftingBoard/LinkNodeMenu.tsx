import React, { useMemo, useState } from "react";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import { Vector2d } from "konva/lib/types";
import { useResetRecoilState } from "recoil";
import { linkNodeMenuState } from "state";
import DeleteLinkDialog from "./DeleteLinkDialog";
import { Link as LinkIntent } from "models/intent";

type Props = {
  pos: Vector2d;
  links: LinkIntent[];
  onClickRemoveLink: (targetLinkId: string) => void;
};

const LinkNodeMenu: React.FC<Props> = ({ pos, links, onClickRemoveLink }) => {
  const [isOpenDeleteLinkDialog, setIsOpenDeleteLinkDialog] = useState(false);
  const [targetLinkId, setTargetLinkId] = useState("");
  const closeMenu = useResetRecoilState(linkNodeMenuState);
  const renderDeleteLinkDialog = useMemo(() => {
    if (targetLinkId === "") return;
    return (
      <DeleteLinkDialog
        isOpen={isOpenDeleteLinkDialog}
        onDeleteLink={() => {
          onClickRemoveLink(targetLinkId);
          setIsOpenDeleteLinkDialog(false);
          setTargetLinkId("");
        }}
        onCancel={() => {
          setIsOpenDeleteLinkDialog(false);
          setTargetLinkId("");
          closeMenu();
        }}
      />
    );
  }, [isOpenDeleteLinkDialog]);
  const linkName = (link: LinkIntent): string => {
    const fromNodeName = link.from.p.name;
    const fromIFName = link.from.name;
    const toNodeName = link.to.p.name;
    const toIFName = link.to.name;
    return `Delete Link: ${fromNodeName}:${fromIFName} <-> ${toNodeName}:${toIFName}`;
  };
  return (
    <Box component={"div"} onMouseLeave={() => closeMenu()}>
      <Paper
        sx={{ width: "auto", position: "absolute", left: pos.x, top: pos.y }}
      >
        <MenuList dense>
          {links.map((link) => {
            return (
              <MenuItem
                onClick={() => {
                  setIsOpenDeleteLinkDialog(true);
                  setTargetLinkId(link.id);
                }}
                key={`LinkNodeMenuListItem-${link.id}`}
              >
                {linkName(link)}
              </MenuItem>
            );
          })}
        </MenuList>
      </Paper>
      {renderDeleteLinkDialog}
    </Box>
  );
};

export default LinkNodeMenu;
