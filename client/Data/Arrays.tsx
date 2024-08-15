import { AiFillProduct } from "react-icons/ai";
import { BiPurchaseTag, BiSearch } from "react-icons/bi";
import { FaFirstOrderAlt, FaSalesforce } from "react-icons/fa";
import { GrOrderedList } from "react-icons/gr";
import { SiGooglesheets } from "react-icons/si";

export const inventryLocation = {
  ib: "GT Road",
  mt: "Model Town",
  dl: "Delhi",
  dn: "Dehradun",
  sl: "Sample Line",
  main: "Main",
  gd: "Godawn",
};

export const menus = [
  { name: "Products", url: "/products", icon: <AiFillProduct size={20} /> },
  {
    name: "Dealer Order",
    url: "/delaerorder",
    icon: <FaFirstOrderAlt size={20} />,
  },
  { name: "Orders", url: "/order", icon: <GrOrderedList size={20} /> },
  {
    name: "Search",
    url: "/search",
    icon: <BiSearch size={20} />,
  },
  {
    name: "Image Sheet",
    url: "/sheets",
    icon: <SiGooglesheets size={20} />,
  },
];
