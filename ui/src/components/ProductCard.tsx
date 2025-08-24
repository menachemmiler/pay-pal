import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { usePayment } from "../context/PaymentContext";
import { useNavigate } from "react-router";

export interface ProductCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  price: number;
}

export default function ProductCard({
  title,
  description,
  imageUrl,
  price,
}: ProductCardProps) {
  const { setPayment } = usePayment();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    setPayment({ amount: price.toFixed(2), name: title });
    navigate("/payment");
  };
  
  return (
    <Card sx={{ maxWidth: 345 }} onClick={handleBuyNow}>
      <CardActionArea>
        <CardMedia component="img" height="140" image={imageUrl} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {price.toFixed(2)}
            {"₪"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
