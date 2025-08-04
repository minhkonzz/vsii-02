import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Box)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function BreedItem({ breed }: { breed: Breed }) {
  const { name, description, life, male_weight, female_weight } = breed.attributes;

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="subtitle2" color="text.secondary">
          Life Span: {life.min} - {life.max} years
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Item>
            <Typography variant="subtitle2" color="text.secondary">
              Male Weight: {male_weight.min} - {male_weight.max} kg
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle2" color="text.secondary">
              Female Weight: {female_weight.min} - {female_weight.max} kg
            </Typography>
          </Item>
        </Box>
      </CardContent>
    </Card>
  );
}
