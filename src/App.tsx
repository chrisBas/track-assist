import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./component/Layout";
import CrystalUrchinCalculator from "./page/CrystalUrchinCalculator";
import Home from "./page/Home";
import MortgageCalculator from "./page/MortgageCalculator";
import { Page } from "./type/Pages";

function App() {
  const routes: { path: Page; element: JSX.Element }[] = [
    {
      path: "mortgage-calc",
      element: <MortgageCalculator />,
    },
    {
      path: "crystal-urchin-calc",
      element: <CrystalUrchinCalculator />,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
