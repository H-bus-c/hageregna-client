import * as Yup from "yup";

const passengerSchema = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^[A-Za-z]+\s[A-Za-z]+$/,
      "Full name should be at least two words."
    )
    .min(5, "Too Short!")
    .max(50, "Too Long")
    .required("Full name is required."),
  phone: Yup.string()
  .matches(/^[79]+[0-9]+$/, "Must start with 7 or 9 and only digits")
    .min(9, "Must be 9 digits") // optional
    .max(9, "Must be 9 digits") // optional
    ,
});
export const passengersSchema = Yup.array().of(passengerSchema);
