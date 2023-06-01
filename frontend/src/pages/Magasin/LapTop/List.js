import { Edit } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import magasin_routes from "routes/magasin";
import { searchLaptop } from "routes/ws_call";

export default function ListLaptop() {
  const navigate = useNavigate();

  const q = useRef();

  const [laptops, setLaptops] = useState([]);

  // Pagination
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const fetchData = async (page, pageSize) => {
    try {
      const data = await searchLaptop(q.current.value, page, pageSize);
      setLaptops(data.content);
      console.log(data.content);
      setRowCount(data.totalElements);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(page, pageSize);
  }, []);

  function handleSearch() {
    fetchData(page, pageSize);
  }

  const handleClick = (
    event,
    params // GridRowParams
  ) => {
    event.preventDefault();
    const data = laptops.find((laptop) => laptop.id === params.row.id);

    navigate(`/magasin/laptops/${params.row.id}`, {
      state: data,
    });
  };

  const columns = [
    {
      field: "Marque",
      headerName: "Marque",
      // valueGetter: (params) => `${params.row.model?.brand.brand_name || ""}`,
      valueGetter: ({ row }) => {
        return row.model?.brand.brand_name || "";
      },
    },
    {
      field: "Model",
      headerName: "Référence",
      width: 200,
      valueGetter: (params) => `${params.row.model.model_name || ""}`,
    },
    {
      field: "Cpu",
      headerName: "CPU",
      width: 150,
      valueGetter: (params) => `${params.row.model.cpu.cpu_name || ""}`,
    },

    {
      field: "Ram",
      headerName: "Ram",
      width: 150,
      valueGetter: (params) => `${params.row.model.ram_size + " Go" || ""}`,
    },
    {
      field: "Disk",
      headerName: "Disque",
      width: 150,
      valueGetter: (params) => `${params.row.model.disk_size + " Go" || ""}`,
    },
    {
      field: "sales_price",
      headerName: "Prix",
      width: 200,
    },
    {
      field: "Update Link",
      headerName: "",
      renderCell: (params) => (
        // How can I send props to the component in the link, I wanna send the data where id = params.row.id so taht I don"t to call a WS

        <IconButton onClick={(event) => handleClick(event, params)}>
          <Edit />
        </IconButton>
      ),
    },
  ];

  const handlePageChange = (params) => {
    setPage(params.page);
    setPageSize(params.pageSize);
    fetchData(params.page, params.pageSize);
  };

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Liste des ordintateurs
          </MKTypography>
        </Grid>
        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <form>
            <MKInput
              variant="standard"
              label="Recherche"
              type="search"
              inputRef={q}
              placeholder="pattern"
              InputLabelProps={{ shrink: true }}
              fullWidth
              onChange={handleSearch}
            />
          </form>
        </Grid>
        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          {/* <DataGrid
            rows={laptops}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            localeText={{
              MuiTablePagination: {
                labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} pour ${count}`,
                labelRowsPerPage: `Lignes:`,
              },
            }}
            // onRowClick={handleClick}
          /> */}

          <DataGrid
            rows={laptops}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: page, pageSize: pageSize },
              },
            }}
            paginationMode="server"
            onPaginationModelChange={handlePageChange}
            pageSizeOptions={[5, 10, 20, 100]}
            rowCount={rowCount}
            localeText={{
              MuiTablePagination: {
                labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} pour ${count}`,
                labelRowsPerPage: `Lignes:`,
              },
            }}
            // onRowClick={handleClick}
          />
        </Grid>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
