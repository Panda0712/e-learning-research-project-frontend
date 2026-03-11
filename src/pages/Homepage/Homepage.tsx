import { useEffect, useState } from "react";
import { homepageService } from "../../apis/homepage";
import Banner from "../../components/homepage/Banner";
import Benefits from "../../components/homepage/Benefits";
import Commitment from "../../components/homepage/Commitment";
import Feedbacks from "../../components/homepage/Feedbacks";
import Introduce from "../../components/homepage/Introduce";
import Popular from "../../components/homepage/Popular";
import type { HomepageData } from "../../types/homepage.type";

const Homepage = () => {
  const [data, setData] = useState<HomepageData | null>(null);

  useEffect(() => {
    let alive = true;

    homepageService
      .getHomepageDataAPI({ popularLimit: 6, reviewLimit: 3 })
      .then((res) => {
        if (alive) setData(res);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <Banner />
      <Introduce stats={data?.stats} />
      <Benefits />
      <Commitment />
      <Popular courses={data?.popularCourses} />
      <Feedbacks feedbacks={data?.feedbacks} />
    </div>
  );
};

export default Homepage;
