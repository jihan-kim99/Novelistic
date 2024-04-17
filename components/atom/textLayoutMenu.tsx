import { Box, Button, Menu, MenuItem, Select, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';

const MenuItemContainer = ({ children }) => (
  <MenuItem>
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
      {children}
    </Box>
  </MenuItem>
);

export default function TextLayoutMenu({
  fontSize,
  setFontSize,
  letterSpace,
  setLetterSpace,
  lineHeight,
  setLineHeight,
  lightMode,
  setLightMode,
}: {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  letterSpace: number;
  setLetterSpace: (letterSpace: number) => void;
  lineHeight: number;
  setLineHeight: (lineHeight: number) => void;
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
        setting
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
        <MenuItemContainer>
          <Typography marginRight={2}>Font Size</Typography>
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
        </MenuItemContainer>
        <MenuItemContainer>
          <Typography marginRight={2}>Letter Spacing</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={letterSpace}
            onChange={(e) => setLetterSpace(e.target.value as number)}
            size="small"
            style={{ position: 'relative' }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={1.5}>1.5</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={2.5}>2.5</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </MenuItemContainer>
        <MenuItemContainer>
          <Typography marginRight={2}>Line height</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lineHeight}
            onChange={(e) => setLineHeight(e.target.value as number)}
            size="small"
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={1.5}>1.5</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={2.5}>2.5</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </MenuItemContainer>
        <MenuItemContainer>
          <Typography marginRight={2}>Light Mode</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lightMode ? 'light' : 'dark'}
            onChange={(e) => setLightMode(e.target.value === 'light' ? true : false)}
            size="small"
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </MenuItemContainer>
      </Menu>
    </>
  );
}
