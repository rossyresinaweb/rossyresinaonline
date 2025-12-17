interface Props {
  amount: number | string | null | undefined;
}

const FormattedPrice = ({ amount }: Props) => {
  const n = Number(amount);
  const value = isNaN(n) ? 0 : n;
  const formattedAmount = Number(value).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  });
  return <span>{formattedAmount}</span>;
};

export default FormattedPrice;
