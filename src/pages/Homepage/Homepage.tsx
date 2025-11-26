import Banner from "./Banner/Banner";
import Benefits from "./Benefits/Benefits";
import Commitment from "./Commitment/Commitment";
import Feedbacks from "./Feedbacks/Feedbacks";
import Introduce from "./Introduce/Introduce";
import Popular from "./Popular/Popular";

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
