// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import useUrlPosition from "../hooks/useUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [formData, setFormData] = useState({
    cityName: "",
    country: "",
    date: new Date(),
    notes: "",
    emoji: "",
  });
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");
  const { createCity, isLoading } = useCities();

  const navigate = useNavigate();
  const [lat, lng] = useUrlPosition();

  useEffect(() => {
    async function getCityData() {
      if (!lat && !lng) return;

      try {
        setIsGeocodingLoading(true);
        setGeocodingError("");

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(`It doesn't seem a city. click somewhere else 😎`);

        setFormData((prev) => ({
          ...prev,
          cityName: data.city || data.locality || "",
          country: data.countryName || "",
          emoji: data.countryCode || "",
        }));
      } catch (error) {
        setGeocodingError(error.message);
      } finally {
        setIsGeocodingLoading(false);
      }
    }
    getCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.date || !formData.cityName) return;

    const newCity = {
      cityName: formData.cityName,
      country: formData.country,
      emoji: formData.emoji,
      date: formData.date,
      notes: formData.notes,
      position: { lat, lng },
    };

    await createCity(newCity);

    navigate("/app/cities");
  }

  if (isGeocodingLoading) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, cityName: e.target.value }))
          }
          value={formData.cityName}
        />
        <span className={styles.flag}>{convertToEmoji(formData.emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {formData.cityName}?</label>
        <DatePicker
          id="date"
          selected={formData.date}
          onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">
          Notes about your trip to {formData.cityName}
        </label>
        <textarea
          id="notes"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          value={formData.notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button type="back" onClick={(e) => navigate(-1)}>
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
