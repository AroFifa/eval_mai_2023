import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useRef, useState } from "react";
import magasin_routes from "routes/magasin";
import { searchLaptop } from "routes/ws_call";

export default function Achat() {
  const q = useRef();

  const [laptops, setLaptops] = useState([]);
  const fetchData = async () => {
    try {
      const data = await searchLaptop(q.current.value);
      setLaptops(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    searchLaptop(q.current.value)
      .then((data) => {
        setLaptops(data);
      })
      .catch((error) => {
        // Handle any potential errors from the Promise
        console.error(error);
      });
  }

  // const handleClick = (
  //   event,
  //   params // GridRowParams
  // ) => {
  //   event.preventDefault();
  //   const data = laptops.find((laptop) => laptop.id === params.row.id);

  //   navigate(`/magasin/laptops/${params.row.id}`, {
  //     state: data,
  //   });
  // };

  const qttInput = (params) => {
    console.log(params.row);
    return <input type="number" />;
  };
  const columns = [
    {
      field: "Marque",
      headerName: "Marque",
      valueGetter: (params) => `${params.row.model.brand.brand_name || ""}`,
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
      valueGetter: (params) =>
        `${params.row.model.ram.ram_name + "," || ""} ${
          params.row.model.ram.ram_value + " Go" || ""
        }`,
    },
    {
      field: "Disk",
      headerName: "Disque",
      width: 150,
      valueGetter: (params) =>
        `${params.row.model.disktype.type_name + "," || ""} ${
          params.row.model.disk_size + " Go" || ""
        }`,
    },
    {
      field: "qtt",
      headerName: "Qtt ",
      renderCell: (params) => qttInput(params),
    },
    {
      field: "montant",
      headerName: "Prix d'achat",
      renderCell: (params) => qttInput(params),
    },
  ];

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Approvisionnement des ordinateurs
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
            checkboxSelection
            rows={laptops}
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
