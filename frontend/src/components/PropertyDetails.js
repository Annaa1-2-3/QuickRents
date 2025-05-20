import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { mockProperties } from "../data/mockProperties";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";

// Пример отзывов (можно заменить на данные с backend)
const initialReviews = [
  {
    id: 1,
    name: "Иван Иванов",
    rating: 5,
    comment: "Отличное жильё, всё чисто и удобно!",
    improvement: "Добавить больше полотенец",
  },
  {
    id: 2,
    name: "Мария Петрова",
    rating: 4,
    comment: "Хорошее расположение, но слышно соседей.",
    improvement: "Звукоизоляция могла бы быть лучше",
  },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === Number(id));

  // Состояние отзывов и формы
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ name: "", rating: "", comment: "", improvement: "" });

  if (!property) {
    return <Typography>Объявление не найдено.</Typography>;
  }

  // Обработка отправки нового отзыва
  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    setReviews([...reviews, { id: Date.now(), ...newReview }]);
    setNewReview({ name: "", rating: "", comment: "", improvement: "" });
  };

  return (
    <Box mt={4}>
      <Card>
        <CardMedia component="img" height="320" image={property.image} alt={property.title} />
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <LocationOn color="primary" />
            <Typography variant="h6">{property.city}</Typography>
            {property.isBest && <Chip label="Выгодное предложение" color="success" />}
          </Stack>
          <Typography variant="h4" gutterBottom>
            {property.title}
          </Typography>
          <Typography variant="body1" mb={2}>
            {property.description}
          </Typography>

          {/* Правила и удобства */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Правила проживания и удобства
          </Typography>
          <Typography variant="body2" mb={2}>
            {/* Здесь можно вывести реальные данные, пока пример */}
            Курение запрещено. Животные допускаются по согласованию. Бесплатный Wi-Fi, парковка, кухня, стиральная машина.
          </Typography>

          {/* Отчёты о состоянии жилья */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Отчёты о состоянии жилья и отзывы арендаторов
          </Typography>

          {reviews.length === 0 ? (
            <Typography>Пока нет отзывов.</Typography>
          ) : (
            <List>
              {reviews.map((rev) => (
                <ListItem key={rev.id} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "stretch" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {rev.name} - Оценка: {rev.rating}/5
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {rev.comment}
                  </Typography>
                  {rev.improvement && (
                    <Typography variant="caption" color="text.secondary">
                      Предложения по улучшению: {rev.improvement}
                    </Typography>
                  )}
                  <Divider sx={{ my: 1 }} />
                </ListItem>
              ))}
            </List>
          )}

          {/* Форма добавления отзыва */}
          <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Оставить отзыв
            </Typography>
            <TextField
              label="Ваше имя"
              name="name"
              value={newReview.name}
              onChange={handleReviewChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Оценка (1-5)"
              name="rating"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              value={newReview.rating}
              onChange={handleReviewChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Комментарий"
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              fullWidth
              required
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              label="Предложения по улучшению (необязательно)"
              name="improvement"
              value={newReview.improvement}
              onChange={handleReviewChange}
              fullWidth
              multiline
              rows={2}
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Отправить отзыв
            </Button>
          </Box>

          {/* Виртуальный тур */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Виртуальный тур по объекту
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 400,
              backgroundColor: "#000",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Пример вставки 360-градусного видео или изображения */}
            <iframe
              title="Виртуальный тур"
              src="https://ep.matterport.host/index/?m=jWucpxW1C5Y"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              style={{ border: "none" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PropertyDetails;
