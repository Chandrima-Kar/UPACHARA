import Image from "next/image";
import AboutUs from "@/pages/About/about";
import DiseasePredictor from "@/pages/Disease/symptoms";
import AlternativeDrug from "@/pages/Drug/drugAlternative";

export default function Home() {
  return (
    <div>
      {/* <AboutUs /> */}
      {/* <DiseasePredictor /> */}
      <AlternativeDrug />
    </div>
  );
}
