// src/components/Home.js
import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Divider,
} from "@mui/material";
import PropertySearch from "./PropertySearch";

// Данные для карточек с выгодными предложениями
const bestOffers = [
  {
    city: "Сочи",
    img: "/4.jpeg",
    price: "от 1800₽/ночь",
    description: "Лучшие квартиры у моря",
  },
  {
    city: "Казань",
    img: "/6.jpg",
    price: "от 1500₽/ночь",
    description: "Центр города, современный ремонт",
  },
  {
    city: "Санкт-Петербург",
    img: "/7.jpg",
    price: "от 2000₽/ночь",
    description: "Квартиры у Невы и Эрмитажа",
  },
  {
    city: "Москва",
    img: "/8.jpg",
    price: "от 2200₽/ночь",
    description: "Деловой центр, быстрый заезд",
  },
];

// Данные для фото номеров (локальные картинки из public)
const roomPhotos = [
  {
    img: "/1.png",
    title: "Номер 1",
    description: "Уютный номер с видом на парк",
  },
  {
    img: "/2.jpg",
    title: "Номер 2",
    description: "Светлый номер с балконом",
  },
  {
    img: "/3.jpg",
    title: "Номер 3",
    description: "Просторный семейный номер",
  },
  {
    img: "/8.jpg",
    title: "Номер 4",
    description: "Красивый номер с бассейном",
  },
];

const promoList = [
  "Плати потом, отдыхай сейчас - бронирование с оплатой частями без процентов",
  "Гарантируем заезд - деньги перечисляем хозяину только после вашего заселения",
  "Безопасные сделки - все объекты и хозяева проходят проверку",
  "Спорные ситуации берём на себя - у нас всё по правилам",
  "Бронируйте онлайн от 1 ₽ - никаких залогов и скрытых платежей",
];

const slogans = [
  "🏠 Ваш комфорт - наша забота!",
  "🌍 Путешествуйте по России легко и безопасно",
  "💸 Только честные цены и прозрачные условия",
  "🛡️ Мы первый русский аналог Airbnb - цивилизованный рынок аренды",
];

const Home = () => (
  <Box>
    {/* Баннер */}
    <Paper
      elevation={4}
      sx={{
        background: "linear-gradient(90deg, rgb(119 197 215) 50%, rgb(25 126 225) 90%)",
        color: "white",
        p: 4,
        mb: 3,
        borderRadius: 2,
        textAlign: "center",
        margin: "20px"
      }}
    >
      <Typography variant="h3" gutterBottom>
        Найдите идеальное жильё для отдыха или командировки
      </Typography>
      <Typography variant="h6" gutterBottom>
        Проверенные квартиры посуточно по всей России - гарантия заселения,
        удобная оплата, поддержка 24/7
      </Typography>
      <PropertySearch />
    </Paper>

    {/* Слоганы */}
    <Grid container spacing={2} mb={3} columns={12}>
      {slogans.map((slogan, idx) => (
        <Grid span={3} key={idx}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle1">{slogan}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* Акции и гарантии */}
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Почему выбирают нас?
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid span={6}>
          <ul>
            {promoList.map((promo, idx) => (
              <li key={idx}>
                <Typography variant="body1">{promo}</Typography>
              </li>
            ))}
          </ul>
        </Grid>
        <Grid span={6}>
          <Paper elevation={1} sx={{ p: 2, background: "#f5f5f5" }}>
            <Typography variant="h6" gutterBottom>
              Безопасные расчёты через платформу или на месте
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>
              Деньги хранятся на транзитном счёте и перечисляются хозяину только
              после вашего заселения. Все хозяева и объекты проходят проверку.
              Мы берём на себя решение спорных ситуаций.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>

    {/* Карточки выгодных предложений */}
    <Typography variant="h5" gutterBottom>
      Самые выгодные предложения в популярных городах
    </Typography>
    <Grid container spacing={3} mb={4} columns={12}>
      {bestOffers.map((offer, idx) => (
        <Grid span={3} key={idx}>
          <Card sx={{ height: "100%" }}>
            <CardMedia
              component="img"
              height="140"
              image={offer.img}
              alt={offer.city}
            />
            <CardContent>
              <Typography variant="h6">{offer.city}</Typography>
              <Typography color="text.secondary">{offer.description}</Typography>
              <Typography color="primary" sx={{ mt: 1, fontWeight: "bold" }}>
                {offer.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Карточки с фото номеров */}
    <Typography variant="h5" gutterBottom>
      Фото номеров гостиницы
    </Typography>
    <Grid container spacing={3} mb={4} columns={12}>
      {roomPhotos.map((room, idx) => (
        <Grid span={4} key={idx}>
          <Card sx={{ height: "100%" }}>
            <CardMedia
              component="img"
              height="160"
              image={room.img}
              alt={room.title}
            />
            <CardContent>
              <Typography variant="h6">{room.title}</Typography>
              <Typography>{room.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Описание сервиса */}
    <Paper elevation={0} sx={{ p: 3, background: "#e3f2fd" }}>
      <Typography variant="h6" gutterBottom>
        QuickRents - ваш надёжный помощник для аренды жилья посуточно
      </Typography>
      <Typography>
        Более 70 000 вариантов по всей России и СНГ, круглосуточная поддержка,
        только проверенные хозяева и прозрачные условия. Забронируйте квартиру,
        дом или апартаменты онлайн - быстро, удобно и безопасно!
      </Typography>
    </Paper>
  </Box>
);

export default Home;
