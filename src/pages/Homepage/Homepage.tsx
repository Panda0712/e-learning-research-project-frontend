import Banner from "../../components/homepage/Banner";
import Benefits from "../../components/homepage/Benefits";
import Commitment from "../../components/homepage/Commitment";
import Feedbacks from "../../components/homepage/Feedbacks";
import Introduce from "../../components/homepage/Introduce";
import Popular from "../../components/homepage/Popular";

const Homepage = () => {
  return (
    <div>
      <Banner />
      <Introduce />
      <Benefits />
      <Commitment />
      <Popular />
      <Feedbacks />
    </div>
  );
};

export default Homepage;
