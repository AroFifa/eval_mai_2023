import { DataGrid } from "@mui/x-data-grid";

const rows = [
  { id: 1, field: "Rouge", color: "red" },
  { id: 2, field: "Bleu", color: "blue" },
  { id: 3, field: "Vert", color: "green" },
];

const ColorCell = (params) => {
  const { color } = params.row;
  return (
    <div style={{ backgroundColor: color, width: "100%", height: "100%" }}>{params.value}</div>
  );
};

function CustomDataGrid() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={[
          { field: "id", headerName: "ID", width: 70 },
          { field: "field", headerName: "Field", width: 150, renderCell: ColorCell },
        ]}
      />
    </div>
  );
}

export default CustomDataGrid;
