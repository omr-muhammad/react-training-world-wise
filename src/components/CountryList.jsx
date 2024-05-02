import styles from "./CountryList.module.css";

import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

export default function CountryList() {
  const { isLoading, cities } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add you first city by clicking on a city on the map" />
    );

  let countriesName = "";
  let countries = [];

  cities.forEach((city) => {
    console.log(!countriesName.includes(city.country));
    if (!countriesName.includes(city.country))
      countries = countries.concat({
        country: city.country,
        emoji: city.emoji,
      });

    countriesName += city.country;
  });

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.name} />
      ))}
    </ul>
  );
}
