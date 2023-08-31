import Stars from "./components/Stars";

import "./App.css";
import { useState, useRef, useEffect, useCallback } from "react";
import { LIMIT, planetsInSolarSystem } from "./constant";
import Planet from "./components/Planet";

function App() {
  const [planets, setPlanets] = useState(planetsInSolarSystem);
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null);

  const loadMorePlanets = useCallback(async () => {
    try {
      const response = await fetch(
        `https://planets-api-rho.vercel.app/api/planets?offset=${offset}`
      );
      const data = await response.json();
      setPlanets([...planets, ...data]);
      setOffset((previousOffset) => previousOffset + LIMIT);
    } catch (error) {
      console.error(error);
    }
  }, [offset, planets]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting) {
        // Load more planets when the loader is visible
        loadMorePlanets();
      }
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, [loadMorePlanets]);

  return (
    <div className="universe">
      <div className="stars">
        <Stars />
      </div>
      <h1 className="title">Explore the Universe</h1>
      <p className="subheading">Journey through the cosmos</p>

      <div className="planets">
        {planets.map((planet) => (
          <Planet key={planet.name} data={planet} />
        ))}
      </div>

      <div ref={loaderRef} className="spinner"></div>
    </div>
  );
}

export default App;
