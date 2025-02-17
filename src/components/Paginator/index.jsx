import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationOutlined({ nPages, currentPages, setCurrentPages }) {
  const handleChange = (event, value) => {
    setCurrentPages(value);
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Pagination 
        count={nPages} 
        page={currentPages} 
        onChange={handleChange} 
        variant="outlined" 
        color="success" 
        siblingCount={1}
        boundaryCount={2}
      />
    </Stack>
  );
}
