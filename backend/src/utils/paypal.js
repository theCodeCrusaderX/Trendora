import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id: "ARRPT6AsJtGR4RSzI6QnRgE_8OcxTMTO3gYXH8oxFsq7G713E2VBNxqEXAvsNbnwP6DwlVZHM6PPAakR",
  client_secret: "EIVc3piGtntcrrv3ZtppAdHZOAsheKWQHYCt6B6dPd3PDESf60bJo_ivT6RwIey4IVV2urJf8j4Ji96D",
});

export { paypal };
