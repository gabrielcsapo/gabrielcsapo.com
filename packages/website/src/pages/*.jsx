import { useTitle } from "@utils/useTitle";

export default function Unknown() {
  useTitle("Error route");

  return <>Unknown route</>;
}
