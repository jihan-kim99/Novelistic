import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse, List, ListItemButton, Typography } from '@mui/material';
import { useState } from 'react';

const SampleFiles = ({ handleExapleFiles }: { handleExapleFiles: (fileName: string) => void }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box
      width={{ lg: '400px', xs: '50%' }}
      sx={{
        alignItems: 'start',
        justifyContent: 'start',
        mt: '20px',
      }}
    >
      <List>
        <ListItemButton onClick={handleClick}>
          <Typography
            sx={{
              color: 'gray',
              '&:hover': {
                color: '#236',
                cursor: 'pointer',
              },
            }}
          >
            샘플 파일
          </Typography>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <a onClick={() => handleExapleFiles('위대한_개츠비.txt')}>
              <Typography
                color="gray"
                sx={{
                  '&:hover': {
                    color: '#236',
                    cursor: 'pointer',
                  },
                }}
              >
                위대한 개츠비
              </Typography>
            </a>
            <a onClick={() => handleExapleFiles('김내성-애인(상).txt')}>
              <Typography
                color="gray"
                sx={{
                  '&:hover': {
                    color: '#236',
                    cursor: 'pointer',
                  },
                }}
              >
                김내성-애인(상)
              </Typography>
            </a>
            <a onClick={() => handleExapleFiles('김내성-애인(하).txt')}>
              <Typography
                color="gray"
                sx={{
                  '&:hover': {
                    color: '#236',
                    cursor: 'pointer',
                  },
                }}
              >
                김내성-애인(하)
              </Typography>
            </a>
            <a onClick={() => handleExapleFiles('김내성-청춘극장(상).txt')}>
              <Typography
                color="gray"
                sx={{
                  '&:hover': {
                    color: '#236',
                    cursor: 'pointer',
                  },
                }}
              >
                김내성-청춘극장(상)
              </Typography>
            </a>
            <a onClick={() => handleExapleFiles('김내성-청춘극장(하).txt')}>
              <Typography
                color="gray"
                sx={{
                  '&:hover': {
                    color: '#236',
                    cursor: 'pointer',
                  },
                }}
              >
                김내성-청춘극장(하)
              </Typography>
            </a>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default SampleFiles;
