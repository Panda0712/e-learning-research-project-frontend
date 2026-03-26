import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { homepageService } from "../../apis/homepage";
import Banner from "../../components/homepage/Banner";
import Benefits from "../../components/homepage/Benefits";
import Commitment from "../../components/homepage/Commitment";
import Feedbacks from "../../components/homepage/Feedbacks";
import Introduce from "../../components/homepage/Introduce";
import Popular from "../../components/homepage/Popular";
import Loading from "../../components/ui/Loading";
import type { HomepageData } from "../../types/homepage.type";

const Homepage = () => {
  const [data, setData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    homepageService
      .getHomepageDataAPI({ popularLimit: 6, reviewLimit: 3 })
      .then((res) => {
        if (!isMounted) return;
        setData(res);
      })
      .catch((err) => {
        if (!isMounted) return;
        toast.error(err?.message || "Cannot load homepage data.");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <Loading caption="Loading homepage data..." />;

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
