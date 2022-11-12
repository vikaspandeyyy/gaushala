const keys = require("../../config/keys");
const fetch = require("node-fetch");
const Setting = require("../models/settingModel");
const CurrencyRates = require("../models/currencyModel");

exports.fetchCurrencyRates = async (request, response) => {
  let setting;
  try {
    setting = await Setting.find();
  } catch (err) {
    response
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
  console.log(setting[0].Currency.SupportedCurrencies);
  let SETTING = setting[0];

  let fetchName;
  try {
    fetchName = await fetch(
      `https://openexchangerates.org/api/currencies.json`
    );
  } catch (err) {
    console.log(err);
    response
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
  fetchName = await fetchName.json();

  let result;

  console.log(SETTING.Currency.ExchangeRateService);

  if (SETTING.Currency.ExchangeRateService.name == "Fixer") {
    let codes = "";
    setting[0].Currency.SupportedCurrencies.forEach((code, i) => {
      console.log(i);
      if (i == 0) codes += code;
      else codes += "," + code;
      console.log(codes);
    });
    console.log(codes, "weh");

    try {
      result = await fetch(
        `http://data.fixer.io/api/latest?access_key=${SETTING.Currency.ExchangeRateService.API_Key}&symbols=${codes}`
      );
    } catch (err) {
      console.log(err);
      response
        .status(500)
        .json({ status: false, message: "Something went wrong" });
    }
    result = await result.json();

    // console.log(fetchName);
    console.log(result);
    const currencyRates = setting[0].Currency.SupportedCurrencies.map(
      (code, i) => {
        console.log(i);
        const data = {
          Code: code,
          Name: fetchName[code],
          Rate: result.rates[code],
        };
        return data;
      }
    );

    console.log(currencyRates);
    const refreshData = currencyRates.map(async (data) => {
      let foundRate;
      try {
        foundRate = await CurrencyRates.findOne({ Code: data.Code });
      } catch (err) {
        console.log(err);
        return { message: "Something went wrong" };
      }

      // console.log(foundRate, "0");

      if (!foundRate) {
        const currency = new CurrencyRates({
          ...data,
        });
        let saved;
        try {
          saved = currency.save();
        } catch (err) {
          console.log(err);
          return { message: "Something went wrong" };
        }

        return saved;
      } else {
        foundRate.Rate = data.Rate;

        let saved;
        try {
          saved = foundRate.save();
        } catch (err) {
          console.log(err);
          return { message: "Something went wrong" };
        }

        return saved;
      }
    });
    const Currency = await Promise.all(refreshData);
    response.status(200).json({ status: true, data: Currency });
  } else if (
    SETTING.Currency.ExchangeRateService.name == "Currency Data Feed"
  ) {
    let codes = "";
    setting[0].Currency.SupportedCurrencies.forEach((code, i) => {
      console.log(i);
      if (i == 0) codes += code;
      else codes += "+" + code;
      console.log(codes);
    });
    console.log(codes, "weh");

    const baseCurrency = SETTING.Currency.DefaultCurrency;
    // if(SETTING.Currency && SETTING.DefaultCurrency)

    try {
      result = await fetch(
        `https://currencydatafeed.com/api/source_currency.php?source=${baseCurrency}&target=${codes}&token=${SETTING.Currency.ExchangeRateService.API_Key}`,
        {
          Authorization: "Bearer " + keys.CURRENCY_DATA_FEED,
        }
      );
    } catch (err) {
      console.log(err);
      response
        .status(500)
        .json({ status: false, message: "Something went wrong" });
    }

    result = await result.json();
    console.log(result);

    const currencyRates = setting[0].Currency.SupportedCurrencies.map(
      (code, i) => {
        console.log(i);
        console.log(result, "@");
        const CUR = result.currency.find((r) => r.currency == code);
        console.log(CUR, "0");
        let data;
        if (code == baseCurrency) {
          data = {
            Code: code,
            Name: fetchName[code],
            Rate: 1.0,
          };
        } else {
          data = {
            Code: CUR.currency,
            Name: fetchName[code],
            Rate: CUR.value,
          };
        }
        return data;
      }
    );

    console.log(currencyRates);

    const refreshData = currencyRates.map(async (data) => {
      let foundRate;
      try {
        foundRate = await CurrencyRates.findOne({ Code: data.Code });
      } catch (err) {
        console.log(err);
        return { message: "Something went wrong" };
      }

      // console.log(foundRate, "0");

      if (!foundRate) {
        const currency = new CurrencyRates({
          ...data,
        });
        let saved;
        try {
          saved = currency.save();
        } catch (err) {
          console.log(err);
          return { message: "Something went wrong" };
        }

        return saved;
      } else {
        foundRate.Rate = data.Rate;

        let saved;
        try {
          saved = foundRate.save();
        } catch (err) {
          console.log(err);
          return { message: "Something went wrong" };
        }

        return saved;
      }
    });
    const Currency = await Promise.all(refreshData);

    response.json({ data: Currency });
  } else {
    response.json("NOT FOUND");
  }
};

exports.updateCurrency = (req, res) => {
  CurrencyRates.findByIdAndUpdate(
    req.body.id,
    { Rate: req.body.Rate },
    { new: true }
  )
    .then((updateCurrency) => {
      res.status(200).json({ status: true, data: updateCurrency });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};

exports.getCurrency = (req, res) => {
  CurrencyRates.find()
    .then((rates) => {
      res.json({ status: true, data: rates });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};

exports.getCurrencyById = (req, res) => {
  CurrencyRates.findById(req.params.id)
    .then((rates) => {
      res.json({ status: true, data: rates });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};
