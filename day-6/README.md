A simple React weather app that replicates the feel of a [certain popular RPG](https://en.wikipedia.org/wiki/Shin_Megami_Tensei:_Persona_4) that's known for its strong sense of visual style. 

Used the [Weather Underground](https://www.wunderground.com/) for the API as it was the only one I could find that offered historical data (for free).  Kinda regret doing it as the response fields were somewhat inconsistent naming wise. 
One positive here is that they offer IP based geolocation so you don't need to ask the user for `navigator.geolocation` permission or use a third party service like [freegeoip.net](https://freegeoip.net/)

Some possible enhancements could be: 

- Storing celsius/fahrenheit preference in `localStorage` and restoring it on subsequent visits
- Allowing the user to input a city name