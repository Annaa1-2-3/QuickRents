import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import PropertyCard from "./PropertyCard";
import { mockProperties } from "../data/mockProperties";
import { useLocation } from "react-router-dom";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const location = useLocation();

  // Получаем параметры поиска из URL (например, ?guests=4)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const guests = params.get("guests");
    if (guests) {
      setProperties(mockProperties.filter(p => p.guests >= Number(guests)).slice(0, 9));
    } else {
      setProperties(mockProperties.slice(0, 9));
    }
  }, [location.search]);

  return (
    <Box>
      <Typography variant="h4" mb={3}>Найдено объявлений: {properties.length}</Typography>
      <Grid container spacing={3} columns={12}>
        {properties.map(property => (
          <Grid span={4} key={property.id}>
            <PropertyCard property={property} />
          </Grid>
        ))}
      </Grid>
      {properties.length === 0 && (
        <Typography color="text.secondary" mt={4}>Нет подходящих объявлений.</Typography>
      )}
    </Box>
  );
};

export default PropertyList;
