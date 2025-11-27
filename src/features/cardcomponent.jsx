import { CardContent, Typography } from "@mui/material";

export const CardText = ({ title, value, isDark }) => {
  return (
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        bgcolor: isDark ? "#282828 !important" : "white !important",
      }}
      className="!p-3 tablet-sm:!p-[16px]"
    >
      <Typography
        variant="subtitle2"
        component={"p"}
        color={isDark ? "#A0A0A0" : "text.secondary"}
        className="!text-[13px] tablet-sm:!text-[14px]"
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        component={"p"}
        color={isDark ? "white" : "text.primary"}
        className="!text-[18px] tablet-sm:!text-[24px]"
        fontWeight="bold"
      >
        {value}
      </Typography>
    </CardContent>
  );
};
