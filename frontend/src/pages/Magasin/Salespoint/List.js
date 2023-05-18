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
import { searchSalespoint } from "routes/ws_call";

export default function ListSalespoint() {
  const navigate = useNavigate();

  const q = useRef();

  const [salespoint, setSalespoint] = useState([]);
  const fetchData = async () => {
    try {
      const data = await searchSalespoint(q.current.value);
      setSalespoint(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    searchSalespoint(q.current.value)
      .then((data) => {
        setSalespoint(data);
      })
      .catch((error) => {
        // Handle any potential errors from the Promise
        console.error(error);
      });
  }

  const handleClick = (
    event,
    params // GridRowParams
  ) => {
    event.preventDefault();
    const data = salespoint.find((item) => item.id === params.row.id);

    navigate(`/magasin/salespoint/${params.row.id}`, {
      state: data,
    });
  };

  const columns = [
    { field: "location", headerName: "Lieu", width: 300 },
    { field: "store_name", headerName: "Point de vente", width: 300 },
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

  const rows = salespoint.map((item) => ({
    id: item.id,
    location: item.location.location_name,
    store_name: item.store_name,
  }));

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Point de ventes
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
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
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
