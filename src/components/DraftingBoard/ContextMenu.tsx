import React, { ChangeEvent, FC, useRef, MouseEvent } from "react";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import { Vector2d } from "konva/lib/types";
import RouterImg from "assets/images/router.png";
import { Article, Download, Upload } from "@mui/icons-material";

type Props = {
  pos: Vector2d;
  onClickNewIntentMenu: () => void;
  onClickAddNodeMenu: () => void;
  onClickImportIntentMenu: (importFile: File) => void;
  onClickExportIntentMenu: () => void;
};

const ContextMenu: FC<Props> = ({
  pos,
  onClickNewIntentMenu,
  onClickAddNodeMenu,
  onClickImportIntentMenu,
  onClickExportIntentMenu,
}) => {
  const importIntentMenuRef = useRef<HTMLInputElement | null>(null);
  const onClickAddNodeMenuHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClickAddNodeMenu();
  };
  const onClickNewIntentMenuHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClickNewIntentMenu();
  };
  const onClickImportIntentMenuHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (importIntentMenuRef.current === null) return;
    importIntentMenuRef.current.click();
  };
  const onChangeImportIntentMenuHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (e.target.files === null) return;
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      onClickImportIntentMenu(file);
    }
  };
  const onClickExportIntentMenuHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClickExportIntentMenu();
  };
  return (
    <Paper sx={{ width: 320, position: "absolute", left: pos.x, top: pos.y }}>
      <MenuList dense>
        <MenuItem onClick={onClickAddNodeMenuHandler}>
          <ListItemIcon>
            <img src={RouterImg} style={{ width: "20px", height: "20px" }} />
          </ListItemIcon>
          <ListItemText>Add Node</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickExportIntentMenuHandler}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Intent（*.json）</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickImportIntentMenuHandler}>
          <ListItemIcon>
            <Upload fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import Intent（*.json）</ListItemText>
          <input
            type="file"
            ref={importIntentMenuRef}
            onChange={onChangeImportIntentMenuHandler}
            hidden
          />
        </MenuItem>
        <MenuItem onClick={onClickNewIntentMenuHandler}>
          <ListItemIcon>
            <Article fontSize="small" />
          </ListItemIcon>
          <ListItemText>New Intent</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default ContextMenu;
