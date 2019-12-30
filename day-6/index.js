const { Motion, spring } = ReactMotion;

const WU_API_KEY = "34d154391731d953";

class WeatherApp extends React.Component {
  constructor() {
    super();

    this.state = {
      isRefreshing: true,
      unitType: "celsius",
      city: null,
      yesterdayData: null,
      forecastData: null
    }

    this.onToggleUnitType = this.onToggleUnitType.bind(this);
  }
  componentDidMount() {
    this.fetchData("autoip");
  }

  fetchData(query) {
    fetch(
      `https://api.wunderground.com/api/${
        WU_API_KEY
      }/yesterday/forecast10day/geolookup/q/${query}.json`
    )
      .then(response => response.json())
      .then(json => {
        if (Boolean(json.response.error)) {
          return Promise.reject("No cities match your search query");
        }

        const { location, history, forecast } = json;
        const { city } = location;

        this.setState({
          city,
          simpleForecast: forecast.simpleforecast.forecastday.slice(0, 6),
          txtForecast: forecast.txt_forecast.forecastday.slice(0, 12),
          yesterdayData: history,
          isRefreshing: false
        });
      })
      .catch(reason => {
        console.log(`Failed to get weather data: ${reason}`);

        this.setState({
          isRefreshing: false
        });
      });
  }

  onToggleUnitType() {
    const currentType = this.state.unitType;

    this.setState({
      unitType: currentType === "celsius" ? "fahrenheit" : "celsius"
    });
  };

  _getPropsForPrevWeatherBox() {
    const { date, observations, dailysummary } = this.state.yesterdayData;
    const { year, mon, mday: day } = date;
    const jsMon = parseInt(mon) - 1;

    const yesterday = new Date(year, jsMon, day);
    const weekdayShort = yesterday.toLocaleDateString("en-US", {
      weekday: "short"
    });

    // WU API doesn't provide celsius/fahrenheit fields in historical data,
    // instead opting for keys like `tempm` and `tempi` 😢
    // https://www.wunderground.com/weather/api/d/docs?d=resources/phrase-glossary
    const phraseToUnitMapping = {
      celsius: {
        high: "maxtempm",
        low: "mintempm"
      },
      fahrenheit: {
        high: "maxtempi",
        low: "mintempi"
      }
    };

    const { unitType } = this.state;
    const high = dailysummary[0][phraseToUnitMapping[unitType].high];
    const low = dailysummary[0][phraseToUnitMapping[unitType].low];

    console.log(`yesterday day:${observations[Math.floor(observations.length / 2)].icon} night:${observations[observations.length - 1].icon}`);
    
    return {
      key: "yesterday",
      day,
      weekdayShort,
      high,
      low,
      dayWeather: observations[Math.floor(observations.length / 2)].icon,
      nightWeather: observations[observations.length - 1].icon
    };
  }

  _getPropsForWeatherBoxes() {
    // Group daytime/nighttime forecast by weekday
    const {txtForecast, simpleForecast} = this.state;
    const groupedTxtForecast = txtForecast.reduce((acc, curr) => {
      const weekday = curr.title.replace(" Night", "");

      acc[weekday] = acc[weekday] || {};

      if (curr.title.indexOf(" Night") !== -1) {
        acc[weekday].night = curr;
      } else {
        acc[weekday].day = curr;
      }

      return acc;
    }, {});

    return simpleForecast.map(forecast => {
      const {
        pretty: key,
        day,
        weekday,
        weekday_short: weekdayShort
      } = forecast.date;

      console.log(`${weekdayShort} day:${groupedTxtForecast[weekday].day.icon} night:${groupedTxtForecast[weekday].night.icon}`);

      return {
        key,
        day,
        weekdayShort,
        high: forecast.high[this.state.unitType],
        low: forecast.low[this.state.unitType],
        dayWeather: groupedTxtForecast[weekday].day.icon,
        nightWeather: groupedTxtForecast[weekday].night.icon
      };
    });
  }

  renderBlankState() {
    return <div className="weather-app">Loading...</div>;
  }

  render() {
    const { isRefreshing, city, forecastData } = this.state;

    if (isRefreshing && !Boolean(forecastData)) {
      return this.renderBlankState();
    }

    const className = isRefreshing ? "weather-app refreshing" : "weather-app";
    const propsForPrevWeatherBox = this._getPropsForPrevWeatherBox();
    const propsForWeatherBoxes = this._getPropsForWeatherBoxes();

    return (
      <div className={className}>
        <div className="unit-toggle" onClick={this.onToggleUnitType}>
          {this.state.unitType === "celsius" ? "°C" : "°F"}
        </div>
        <WeatherBox {...propsForPrevWeatherBox} />
        {propsForWeatherBoxes
          .map((forecastProps, index) => (
            <WeatherBox {...forecastProps} isActive={index === 0} />
          ))}
      </div>
    );
  }
}

/* WeatherBox Component */

class WeatherBox extends React.Component {
  render() {
    const { isActive, weekdayShort, day, high, low } = this.props;
    const isWeekendDay = ["sat", "sun"].includes(weekdayShort.toLowerCase());

    const boxClassName = classNames("weather-box", {
      "weather-box-active": isActive,
      "weather-box-weekend": isWeekendDay
    });

    return (
      <div className={boxClassName}>
        {<p className="weekday-short">{weekdayShort}</p>}
        {<p className="day">{day}</p>}
        {this.renderIcon()}
        {
          <p className="temp">
            {this.renderTemp(high, "high")}
            {" – "}
            {this.renderTemp(low, "low")}
          </p>
        }
      </div>
    );
  }

  renderTemp(value, type) {
    let _value = parseInt(value);

    return (
      <Motion
        defaultStyle={{ value: 0 }}
        style={{ value: spring(_value) }}
      >
        {({ value }) => <span className={type}>{`${Math.round(value)}°`}</span>}
      </Motion>
    );
  }

  renderIcon() {
    const { dayWeather, nightWeather } = this.props;
    const dayIcon = this.getIconName(dayWeather);
    const nightIcon = this.getIconName(nightWeather);

    if (dayIcon === nightIcon) {
      return (
        <div
          className={`weather-box-icon weather-box-icon-single ${dayIcon}`}
          style={{ backgroundImage: `url(${this.getIconUrl(dayWeather)})` }}
        />
      );
    } else {
      return (
        <div className="weather-box-icon weather-box-icon-combo">
          <div className="day-icon">
            <div
              className={dayIcon}
              style={{ backgroundImage: `url(${this.getIconUrl(dayWeather)})` }}
            />
          </div>
          <div className="night-icon">
            <div
              className={nightIcon}
              style={{
                backgroundImage: `url(${this.getIconUrl(nightWeather)})`
              }}
            />
          </div>
        </div>
      );
    }
  }

  getIconName(weather) {
    const dayWeather = weather.replace("nt_", "");

    return (
      {
        chanceflurries: "flurries",
        chancerain: "rain",
        chancesleet: "flurries",
        chancesnow: "snow",
        chancetstorms: "lightning",
        clear: "sun",
        cloudy: "cloud",
        flurries: "flurries",
        fog: "cloud",
        hazy: "cloud",
        mostlycloudy: "cloud",
        mostlysunny: "cloud",
        partlycloudy: "cloud",
        partlysunny: "sun",
        sleet: "flurries",
        rain: "rain",
        snow: "snow",
        sunny: "sun",
        tstorms: "lightning",
        unknown: "unknown"
      }[dayWeather] || "unknown"
    );
  }

  getIconUrl(weather) {
    const prefix = `https://static.radulescu.me/codepen/storm/`;

    return `${prefix}${this.getIconName(weather)}.png`;
  }
}

WeatherBox.defaultProps = {
  isActive: false,
  weekdayShort: "?",
  day: "?",
  high: 0,
  low: 0,
  dayWeather: "unknown",
  nightWeather: "unknown"
};

ReactDOM.render(<WeatherApp />, document.getElementById("root"));