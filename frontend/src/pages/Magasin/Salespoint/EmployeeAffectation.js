import { Grid, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useRef, useState } from "react";
import magasin_routes from "routes/magasin";
import { getSalesPoint } from "routes/ws_call";
import { affectEmployee } from "routes/ws_call";
import { searchEmployees } from "routes/ws_call";

export default function EmployeeAffectation() {
  const q = useRef();

  const [employees, setEmployees] = useState([]);
  const [salesPoints, setSalesPoints] = useState([]);
  const fetchData = async () => {
    try {
      const data = await searchEmployees(q.current.value);
      const stores = await getSalesPoint();
      setSalesPoints(stores);
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    searchEmployees(q.current.value)
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const affectSelectInput = (params) => {
    const affect = (event, params) => {
      event.preventDefault();
      const value = event.target.value;

      affectEmployee(params.row.id, value);
    };

    return (
      <TextField
        sx={{ minWidth: "fit-content" }}
        label="Affectation"
        onChange={(event) => {
          affect(event, params);
        }}
        defaultValue={params.row.store?.id}
        fullWidth
        select
        placeholder="Points de vente"
        variant="standard"
      >
        <MenuItem value={""} disabled></MenuItem>
        {salesPoints.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.store_name}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const columns = [
    {
      field: "lastname",
      headerName: "Nom",
      width: 150,
    },
    {
      field: "firstname",
      headerName: "Prénom",
      width: 150,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 200,
    },

    {
      field: "profil",
      headerName: "Poste",
      width: 150,
      valueGetter: (params) => `${params.row.profil.profil_name || ""}`,
    },
    {
      field: "salespoint",
      headerName: "Point de vente ",
      width: 200,
      renderCell: (params) => affectSelectInput(params),
    },
  ];

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Affectations des employés
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
            rows={employees}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Grid>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
