import * as React from "react";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
export default function CustomPaginationGrid() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        pagination
        {...data}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        hideFooterSelectedRowCount
        localeText={{
          MuiTablePagination: {
            labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} pour ${count}`,
            labelRowsPerPage: `Lignes:`,
          },
        }}
      />
    </Box>
  );
}
