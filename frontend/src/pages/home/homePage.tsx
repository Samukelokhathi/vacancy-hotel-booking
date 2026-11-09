import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import type { Hotel } from "../../models/hotel.types";
import { fetchHotels } from "../../store/hotelSlice";
import { setSearchFilters } from "../../store/searchSlice";
import { formatPrice, pluralise } from "../../utils/format";
import {
  filterHotels,
  filtersFromParams,
  priceOptions,
  starOptions,
} from "../../utils/hotelFilters";
import HotelCard, {
  HotelCardSkeleton,
} from "../../components/hotelCard/hotelCard";
import HotelRow from "../../components/hotelRow/hotelRow";
import styles from "./homePage.module.css";

interface CityGroup {
  city: string;
  hotels: Hotel[];
  lowestPrice: number;
}

const groupHotelsByCity = (hotels: Hotel[]): CityGroup[] => {
  const hotelsByCity = new Map<string, Hotel[]>();
  for (const hotel of hotels) {
    const cityName = hotel.city.trim() || "Other";
    hotelsByCity.set(cityName, [...(hotelsByCity.get(cityName) ?? []), hotel]);
  }
  return [...hotelsByCity.entries()]
    .map(([city, cityHotels]) => ({
      city,
      hotels: [...cityHotels].sort(
        (firstHotel, secondHotel) =>
          secondHotel.starRating - firstHotel.starRating,
      ),
      lowestPrice: Math.min(...cityHotels.map((hotel) => hotel.pricePerNight)),
    }))
    .sort(
      (firstGroup, secondGroup) =>
        secondGroup.hotels.length - firstGroup.hotels.length ||
        firstGroup.city.localeCompare(secondGroup.city),
    );
};

const cityLink = (city: string, extraParams = "") =>
  `/home?city=${encodeURIComponent(city)}${extraParams}`;

type CityTab = "popular" | "topRated" | "budget";
const BUDGET_PRICE_LIMIT = 1500;

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, isLoading, error } = useSelector(
    (state: RootState) => state.hotels,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const filters = useMemo(
    () => filtersFromParams(new URLSearchParams(queryString)),
    [queryString],
  );
  const hasFilters = queryString !== "";
  const [activeCityTab, setActiveCityTab] = useState<CityTab>("popular");

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  // the address is the source of the search; share it with the search bar
  useEffect(() => {
    dispatch(setSearchFilters(filters));
  }, [dispatch, filters]);

  const cityGroups = useMemo(() => groupHotelsByCity(hotels), [hotels]);
  const citiesWithSeveralHotels = cityGroups.filter(
    (cityGroup) => cityGroup.hotels.length >= 2,
  );
  const hotelsInOtherCities = cityGroups
    .filter((cityGroup) => cityGroup.hotels.length < 2)
    .flatMap((cityGroup) => cityGroup.hotels);
  const fiveStarHotels = useMemo(
    () => hotels.filter((hotel) => hotel.starRating >= 5),
    [hotels],
  );

  const cityLinks = useMemo(() => {
    if (activeCityTab === "topRated") {
      return groupHotelsByCity(fiveStarHotels).map((cityGroup) => ({
        city: cityGroup.city,
        linkTo: cityLink(cityGroup.city, "&stars=5"),
        note: pluralise(cityGroup.hotels.length, "five-star hotel"),
      }));
    }
    if (activeCityTab === "budget") {
      const budgetHotels = hotels.filter(
        (hotel) => hotel.pricePerNight <= BUDGET_PRICE_LIMIT,
      );
      return groupHotelsByCity(budgetHotels).map((cityGroup) => ({
        city: cityGroup.city,
        linkTo: cityLink(cityGroup.city, `&maxPrice=${BUDGET_PRICE_LIMIT}`),
        note: `From ${formatPrice(cityGroup.lowestPrice)} a night`,
      }));
    }
    return cityGroups.map((cityGroup) => ({
      city: cityGroup.city,
      linkTo: cityLink(cityGroup.city),
      note: pluralise(cityGroup.hotels.length, "hotel"),
    }));
  }, [activeCityTab, cityGroups, hotels, fiveStarHotels]);

  const isFirstLoad = isLoading && hotels.length === 0;

  // ---------- search results ----------
  if (hasFilters) {
    const matchingHotels = filterHotels(hotels, filters);
    const filterSummary = [
      filters.maxPrice > 0 &&
        priceOptions.find(
          (priceOption) => priceOption.value === filters.maxPrice,
        )?.label,
      filters.stars > 0 &&
        starOptions.find((starOption) => starOption.value === filters.stars)
          ?.label,
    ].filter(Boolean);

    return (
      <div className={styles.page}>
        <div className={styles.resultsHeader}>
          <div>
            <h1 className={styles.resultsTitle}>
              {isFirstLoad
                ? "Searching…"
                : `${pluralise(matchingHotels.length, "stay")}${filters.city ? ` in ${filters.city}` : ""}`}
            </h1>
            {filterSummary.length > 0 && (
              <p className={styles.resultsSubtitle}>
                {filterSummary.join(" · ")}
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => setSearchParams({})}
          >
            Clear filters
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.resultsGrid}>
          {isFirstLoad &&
            Array.from({ length: 10 }, (_, placeholderIndex) => (
              <HotelCardSkeleton key={placeholderIndex} />
            ))}
          {!isFirstLoad &&
            matchingHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>

        {!isFirstLoad && !error && matchingHotels.length === 0 && (
          <div className={styles.emptyState}>
            <h2>No exact matches</h2>
            <p>Try a different city, or widen the price or star filters.</p>
            <button
              type="button"
              className={styles.darkButton}
              onClick={() => setSearchParams({})}
            >
              Show all hotels
            </button>
          </div>
        )}
      </div>
    );
  }

  // ---------- browse rows ----------
  return (
    <div className={styles.page}>
      {error && <p className={styles.error}>{error}</p>}

      {isFirstLoad &&
        [0, 1, 2].map((rowIndex) => (
          <HotelRow key={rowIndex} title="Loading stays…">
            {Array.from({ length: 6 }, (_, placeholderIndex) => (
              <HotelCardSkeleton key={placeholderIndex} />
            ))}
          </HotelRow>
        ))}

      {!isFirstLoad && !error && hotels.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No hotels listed yet</h2>
        </div>
      )}

      {fiveStarHotels.length >= 2 && (
        <HotelRow
          title="Top-rated stays"
          subtitle="Five-star hotels"
          linkTo="/home?stars=5"
        >
          {fiveStarHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </HotelRow>
      )}

      {citiesWithSeveralHotels.map((cityGroup) => (
        <HotelRow
          key={cityGroup.city}
          title={`Stay in ${cityGroup.city}`}
          subtitle={`${pluralise(cityGroup.hotels.length, "hotel")} · from ${formatPrice(cityGroup.lowestPrice)} a night`}
          linkTo={cityLink(cityGroup.city)}
        >
          {cityGroup.hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </HotelRow>
      ))}

      {hotelsInOtherCities.length > 0 && (
        <HotelRow
          title={
            citiesWithSeveralHotels.length
              ? "More places to stay"
              : "Places to stay"
          }
        >
          {hotelsInOtherCities.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </HotelRow>
      )}

      {cityGroups.length > 0 && (
        <section className={styles.cityLinksSection}>
          <h2 className={styles.cityLinksTitle}>Browse by city</h2>
          <div className={styles.tabs} role="tablist">
            {(
              [
                ["popular", "Popular"],
                ["topRated", "Top rated"],
                ["budget", "Budget friendly"],
              ] as const
            ).map(([tabKey, tabLabel]) => (
              <button
                key={tabKey}
                type="button"
                role="tab"
                aria-selected={activeCityTab === tabKey}
                className={activeCityTab === tabKey ? styles.activeTab : ""}
                onClick={() => setActiveCityTab(tabKey)}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          {cityLinks.length > 0 ? (
            <ul className={styles.cityLinksGrid}>
              {cityLinks.map((cityLinkItem) => (
                <li key={cityLinkItem.city}>
                  <Link to={cityLinkItem.linkTo}>
                    <span>{cityLinkItem.city}</span>
                    <small>{cityLinkItem.note}</small>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.cityLinksEmpty}>
              No hotels in this group yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
