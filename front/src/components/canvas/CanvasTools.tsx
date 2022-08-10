import { Stack, IconButton, Slider, Box } from "@mui/material";
import React, { FC, useEffect, useRef, useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import UndoIcon from "@mui/icons-material/Undo";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  onChangeColor: (color: string) => void;
  brushRadius: number;
  onChangeRadius: (number: number) => void;
  onUndo: () => void;
  onEraseAll: () => void;
  onSave: (num: number) => void;
}

export const CanvasTools: FC<IProps> = ({
  onChangeColor,
  brushRadius,
  onChangeRadius,
  onUndo,
  onEraseAll,
  onSave,
}) => {
  const picker = useRef<any>();
  useEffect(() => {
    if (!picker) {
      return;
    }
    picker.current.addEventListener(
      "change",
      (event: any) => {
        onChangeColor(event.target.value);
      },
      false
    );
  }, [onChangeColor]);

  return (
    <Stack direction="column" alignItems="center" spacing={1}>
      <Box bgcolor="white" p={1} borderRadius="10px" position="relative">
        <IconButton sx={{ padding: 0 }}>
          <input ref={picker} type="color" />
        </IconButton>
      </Box>
      <Stack bgcolor="white" alignItems="center" p={1} borderRadius="10px" spacing={1}>
        <Slider
          orientation="vertical"
          valueLabelDisplay="auto"
          value={brushRadius}
          onChange={(_, v, __) => onChangeRadius(v as number)}
          sx={{ height: 150 }}
          min={1}
          max={80}
          color="secondary"
        />
      </Stack>
      <Box bgcolor="white" p={1} borderRadius="10px">
        <IconButton onClick={onUndo}>
          <UndoIcon />
        </IconButton>
      </Box>
      <Box bgcolor="white" p={1} borderRadius="10px">
        <IconButton onClick={onEraseAll}>
          <DeleteIcon />
        </IconButton>
      </Box>
      {[1, 2, 3, 4].map((it) => (
        <Stack
          key={it}
          bgcolor="white"
          p={1}
          borderRadius="10px"
          direction="column"
          alignItems="center"
        >
          {it}번
          <IconButton onClick={() => onSave(it)}>
            <SaveAltIcon />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  );
};
