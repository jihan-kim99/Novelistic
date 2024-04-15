import { LightMode } from '@mui/icons-material';
import { Button, Menu, MenuItem, Select, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';

export default function TextLayoutMenu({
  fontSize,
  setFontSize,
  lineSpace,
  setLineSpace,
  lightMode,
  setLightMode,
}: {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  lineSpace: number;
  setLineSpace: (lineSpace: number) => void;
  lightMode: boolean;
  setLightMode: (mode: boolean) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="LayoutMenu"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        style={{
          borderRadius: 20,
          marginRight: 40,
          color: lightMode ? 'black' : 'white',
          borderColor: lightMode ? 'black' : 'white',
        }}
      >
        설정
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem>
          <Typography marginRight={2}>크기</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as number)}
            size="small"
          >
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={24}>24</MenuItem>
            <MenuItem value={28}>28</MenuItem>
          </Select>
        </MenuItem>
        <MenuItem>
          <Typography marginRight={2}>간격</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lineSpace}
            onChange={(e) => setLineSpace(e.target.value as number)}
            size="small"
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={1.5}>1.5</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={2.5}>2.5</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </MenuItem>
        <MenuItem>
          <Typography marginRight={2}>모드</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lightMode ? 'light' : 'dark'}
            onChange={(e) => setLightMode(e.target.value === 'light' ? true : false)}
            size="small"
          >
            <MenuItem value="light">라이트</MenuItem>
            <MenuItem value="dark">다크</MenuItem>
          </Select>
        </MenuItem>
      </Menu>
    </>
  );
}
