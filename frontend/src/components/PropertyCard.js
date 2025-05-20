import React from "react";
import { Card, CardMedia, CardContent, Typography, Chip, Stack } from "@mui/material";
import { People, LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => (
  <Card sx={{ height: "100%", position: "relative", textDecoration: "none" }} component={Link} to={`/properties/${property.id}`}>
    <CardMedia
      component="img"
      height="160"
      image={property.image}
      alt={property.title}
    />
    {property.isBest && (
      <Chip
        label="Выгодное предложение"
        color="success"
        sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
      />
    )}
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <LocationOn fontSize="small" color="primary" />
        <Typography variant="subtitle2">{property.city}</Typography>
      </Stack>
      <Typography variant="h6" gutterBottom>
        {property.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {property.description}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <People fontSize="small" />
          <Typography variant="body2">{property.guests} гостей</Typography>
        </Stack>
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold" }}>
          {property.price}₽/ночь
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

export default PropertyCard;
