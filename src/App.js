import axios from "axios";
import { useState } from "react";
import styles from "./App.module.scss";
import Button from "./components/UI/Button";
function App() {
  const [bikePoints, setBikePoints] = useState([]);
  const [id, setId] = useState("BikePoints_85");
  const [name, setName] = useState("Bermondsey");
  const [resultsCount, setResultsCount] = useState(15);
  const [initialRender, setInitialRender] = useState(true);
  const [error, setError] = useState(false);
  const [selectedItem, setSelectedItem] = useState("unselected");
  const [isLoading, setIsLoading] = useState(false);

  const hasError =
    error || (!initialRender && bikePoints && bikePoints.length < 1);

  const reset = () => {
    setResultsCount(15);
    setError(false);
    setBikePoints([]);
    setInitialRender(true);
    setSelectedItem("unselected");
  };

  const getAllBikePointsHandler = async () => {
    reset();
    try {
      setIsLoading(true);
      const res = await axios("https://api.tfl.gov.uk/BikePoint/");
      setBikePoints(res.data);
    } catch (err) {
      setError(true);
    }
    setIsLoading(false);

    setInitialRender(false);
  };

  const bpByIdHandler = async () => {
    reset();
    try {
      setIsLoading(true);
      const res = await axios(`https://api.tfl.gov.uk/BikePoint/${id}`);
      setBikePoints([res.data]);
    } catch (err) {
      setError(true);
    }
    setIsLoading(false);

    setInitialRender(false);
  };

  const bpByNameHandler = async () => {
    reset();
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.tfl.gov.uk/BikePoint/Search?query=${name}`
      );
      setBikePoints(res.data);
    } catch (err) {
      setError(true);
    }
    setIsLoading(false);

    setInitialRender(false);
  };

  const updateResultsCountHandler = () => {
    setResultsCount((prevState) => prevState + 100);
  };

  const selectBpHandler = (_, id) => {
    setSelectedItem(id);
  };

  return (
    <div>
      <Button onClick={getAllBikePointsHandler}>Get all bike points</Button>
      <br />

      <label htmlFor="name">Fetch by name: </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button className={styles.secondary} onClick={bpByNameHandler}>
        Fetch data
      </button>
      <br />
      <br />
      <label htmlFor="id">Fetch by id: </label>
      <input
        type="text"
        id="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      ></input>
      <button className={styles.secondary} onClick={bpByIdHandler}>
        Fetch data
      </button>
      {isLoading && (
        <div className={styles["loading-container"]}>
          <div className={styles["loading-content"]}>
            <p>Loading bike points</p>
          </div>
        </div>
      )}
      {hasError && (
        <div className={styles["error-container"]}>
          <div className={styles["error-content"]}>
            <p>No bike points to be found</p>
          </div>
        </div>
      )}
      {bikePoints && bikePoints.length > 0 && (
        <>
          <div className={styles["grid-container"]}>
            {bikePoints.slice(0, resultsCount).map((bikePoint) => (
              <div
                onClick={(e) => {
                  selectBpHandler(e, bikePoint.id);
                }}
                key={bikePoint.id}
                className={`${styles["grid-item"]} ${
                  selectedItem === bikePoint.id && styles.selected
                }`}
              >
                <p>
                  <strong>{bikePoint.id}</strong>
                </p>
                <p>{bikePoint.commonName}</p>
                {selectedItem === bikePoint.id && (
                  <p>
                    {bikePoint?.lat}, {bikePoint?.lon}
                  </p>
                )}
              </div>
            ))}
          </div>
          {bikePoints.length > resultsCount && (
            <Button onClick={updateResultsCountHandler}>
              Show 100 more results
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
